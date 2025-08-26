import { Sequelize } from 'sequelize'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Function to get the appropriate database path
const getDbPath = () => {
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

        const dbDir = join(userDataPath, 'data-storage')

        // Ensure directory exists
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true })
        }

        console.log(`Using production database path (${process.platform}):`, join(dbDir, 'db.sqlite'))
        return join(dbDir, 'db.sqlite')
      } else {
        // In development: use project directory
        const devPath = join(__dirname, '..', 'data-storage', 'db.sqlite')
        const devDir = dirname(devPath)

        if (!fs.existsSync(devDir)) {
          fs.mkdirSync(devDir, { recursive: true })
        }

        console.log('Using development database path:', devPath)
        return devPath
      }
    } catch (error) {
      console.log('Error determining database path, using fallback:', error.message)
    }
  }

  // Fallback path
  const fallbackPath = join(__dirname, '..', 'data-storage', 'db.sqlite')
  const fallbackDir = dirname(fallbackPath)

  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true })
  }

  console.log('Using fallback database path:', fallbackPath)
  return fallbackPath
}

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: getDbPath(),
  logging: false
})

export const testDbConnection = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: false })
    console.log('Connection has been established successfully.')
    return true
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    return false
  }
}
