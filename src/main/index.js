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

if (!gotTheLock) {
  app.quit()
} else {
  let mainWindow
  let serverProcess = null // Track the server process globally

  function startBackendServer() {
    const isDev = is.dev
    let serverPath
    let workingDir

    if (isDev) {
      // In development, point to your backend folder
      serverPath = join(__dirname, '../../backend/index.js')
      workingDir = join(__dirname, '../../backend')
    } else {
      // In production, use the bundled backend
      serverPath = join(process.resourcesPath, 'backend/index.js')
      workingDir = join(process.resourcesPath, 'backend')
    }

    console.log('Starting backend server...')
    console.log('Server path:', serverPath)
    console.log('Working directory:', workingDir)
    console.log('Environment:', isDev ? 'development' : 'production')

    try {
      serverProcess = spawn(process.execPath, [serverPath], {
        stdio: 'inherit',
        cwd: workingDir, // Set working directory
        env: {
          ...process.env,
          NODE_ENV: isDev ? 'development' : 'production',
          ELECTRON_ENV: 'true'
        }
      })

      serverProcess.on('error', (err) => {
        console.error('Failed to start backend server:', err)
      })

      serverProcess.on('exit', (code, signal) => {
        console.log(`Backend server exited with code: ${code}, signal: ${signal}`)
        serverProcess = null
      })

      console.log('✅ Backend server started successfully')
      return true
    } catch (error) {
      console.error('❌ Error starting backend server:', error)
      return false
    }
  }

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

    // Start Express Server first
    console.log('🚀 Starting application...')
    const serverStarted = startBackendServer()

    if (!serverStarted) {
      console.error('❌ Failed to start backend server. App may not function properly.')
    }

    // Default open or close DevTools by F12 in development
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // IPC handlers
    ipcMain.on('ping', () => console.log('pong'))

    ipcMain.handle('select-media-file', async () => {
      const result = await dialog.showOpenDialog({
        title: 'Select Media File',
        properties: ['openFile'],
        filters: [
          { name: 'Media', extensions: ['jpg', 'png', 'mp3', 'mp4', 'pdf', 'txt', 'wav', 'avi', 'mov'] }
        ]
      });

      if (result.canceled) return null;
      return result.filePaths[0]; // Full file path
    });

    // Wait a moment for server to start, then create window
    setTimeout(() => {
      createWindow()
    }, 2000) // Give server 2 seconds to start

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

  // Handle second instance
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
