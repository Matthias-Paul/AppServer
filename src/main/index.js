import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Handle __dirname with ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const gotTheLock = app.requestSingleInstanceLock()

// Store network configuration
let networkConfig = null

// Function to set config from backend
export function setNetworkConfig(config) {
  networkConfig = config
  console.log('Network config received in main process:', config)
}

if (!gotTheLock) {
  app.quit()
} else {
  let mainWindow

  function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 1000,
      show: false,
      contextIsolation: true,
      nodeIntegration: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    mainWindow.on('ready-to-show', () => {
      mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (is.dev) {
      mainWindow.webContents.openDevTools()
    }

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.mediaunboxed.desktop')

    //  Start Express Server as a child process
    const serverProcess = spawn(process.execPath, [join(__dirname, '../../backend/index.js')], {
      stdio: ['inherit', 'inherit', 'inherit', 'ipc'], // Enable IPC
      env: {
        ...process.env,
        NODE_ENV: is.dev ? 'development' : 'production'
      }
    })

    // Listen for messages from backend
    serverProcess.on('message', (message) => {
      if (message.type === 'network-config') {
        networkConfig = message.config
        console.log('Received network config from backend:', networkConfig)
      }
    })

    serverProcess.on('error', (err) => {
      console.error('Failed to start server:', err)
    })

    serverProcess.on('exit', (code) => {
      console.log(`Server exited with code: ${code}`)
    })

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // IPC handlers
    ipcMain.on('ping', () => console.log('pong'))

    // Handle config request from renderer
    ipcMain.handle('get-config', () => {
      console.log('Config requested from renderer, returning:', networkConfig)
      return networkConfig
    })

    // Handle media file selection
    ipcMain.handle('select-media-file', async () => {
      const result = await dialog.showOpenDialog({
        title: 'Select Media File',
        properties: ['openFile'],
        filters: [
          { name: 'Media', extensions: ['jpg', 'png', 'mp3', 'mp4', 'pdf', 'txt', 'wav', 'avi', 'mov'] }
        ]
      })

      if (result.canceled) return null
      return result.filePaths[0] // Full file path
    })

    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  // Cleanup when app is closing
  app.on('before-quit', (event) => {
    if (serverProcess) {
      console.log('🛑 Shutting down backend server...')
      serverProcess.kill('SIGTERM')

      // Give server time to shutdown gracefully
      setTimeout(() => {
        if (serverProcess) {
          console.log('🔪 Force killing backend server...')
          serverProcess.kill('SIGKILL')
        }
      }, 5000)
    }
  })

  // Quit when all windows are closed, except on macOS
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
