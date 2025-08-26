import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Function to get the appropriate file storage path
export const getStoragePath = (subPath = '') => {
  // Check if we're in an Electron environment and app.asar (packaged)
  if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
    try {
      // Check if we're inside app.asar (packaged)
      if (__dirname.includes('app.asar')) {
        // In production: use a writable location outside app.asar
        const os = require('os')
        const appName = 'MediaUnboxed'
        let userDataPath

        // Platform-specific user data paths
        switch (process.platform) {
          case 'darwin': // macOS
            userDataPath = join(os.homedir(), 'Library', 'Application Support', appName)
            break
          case 'win32': // Windows
            userDataPath = join(os.homedir(), 'AppData', 'Roaming', appName)
            break
          case 'linux': // Linux
            userDataPath = join(os.homedir(), '.config', appName)
            break
          default:
            // Fallback for other platforms
            userDataPath = join(os.homedir(), `.${appName}`)
            break
        }

        const storageDir = join(userDataPath, 'fileStorage', subPath)

        // Ensure directory exists
        if (!fs.existsSync(storageDir)) {
          fs.mkdirSync(storageDir, { recursive: true })
        }

        console.log(`Using production file storage path (${process.platform}):`, storageDir)
        return storageDir
      } else {
        // In development: use project directory
        const devPath = join(__dirname, '..', 'fileStorage', subPath)
        const devDir = devPath

        if (!fs.existsSync(devDir)) {
          fs.mkdirSync(devDir, { recursive: true })
        }

        console.log('Using development file storage path:', devPath)
        return devPath
      }
    } catch (error) {
      console.log('Error determining file storage path, using fallback:', error.message)
    }
  }

  // Fallback path
  const fallbackPath = join(__dirname, '..', 'fileStorage', subPath)

  if (!fs.existsSync(fallbackPath)) {
    fs.mkdirSync(fallbackPath, { recursive: true })
  }

  console.log('Using fallback file storage path:', fallbackPath)
  return fallbackPath
}

// Helper to get the URL path for serving files
export const getStorageUrlPath = (filename, subPath = '') => {
  return `/fileStorage/${subPath}/${filename}`.replace(/\/+/g, '/')
}
