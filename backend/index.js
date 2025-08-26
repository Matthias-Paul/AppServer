// import fs from 'fs'
import path from 'path'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { getNetworkInfo } from './utils/getLocalIP.js'
import { testDbConnection } from './database/DB.config.js'
import authRoute from './routes/auth.route.js'
import adminRoute from './routes/admin.route.js'
import mobileRoute from './routes/mobile.route.js'
import multer from 'multer'
import { getStoragePath } from './utils/getStoragePath.js'
// import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 7001
// const HOST = "0.0.0.0"

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// // Set proper working directory for packaged app
// if (process.env.NODE_ENV === 'production') {
//   // In packaged app, set cwd to the backend directory
//   process.chdir(__dirname)
// }

// Update file paths to be relative to backend directory
// app.use('/fileStorage', express.static(path.join(__dirname, 'fileStorage')))

app.use(cookieParser())
app.use(
  cors({
    origin: ['http://localhost:*', 'http://localhost:3000', 'file://', 'app://', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', authRoute)
app.use('/api', adminRoute)
app.use('/api', mobileRoute)

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message })
  } else if (
    err.message === 'Unsupported file type' ||
    err.message === 'Unsupported media file type'
  ) {
    return res.status(400).json({ success: false, message: err.message })
  }
})

// app.use('/fileStorage', express.static(path.join(process.cwd(), 'backend/fileStorage')))
app.use('/fileStorage', express.static(getStoragePath()))

console.log('Serving static files from:', getStoragePath())

// Global config storage
let globalConfig = null

// Add endpoint to serve config
app.get('/api/config', (req, res) => {
  res.json(globalConfig || {})
})

// process.on('uncaughtException', (error) => {
//   console.error('Backend uncaught exception:', error)
//   process.exit(1)
// })

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Backend unhandled rejection at:', promise, 'reason:', reason)
//   process.exit(1)
// })

// console.log('Backend starting...')
// console.log('Working directory:', process.cwd())
// console.log('__dirname:', __dirname)

// Add endpoint to serve config
// app.get('/api/config', (req, res) => {
//   res.json(global.networkConfig || {})
// })

export async function startServer() {
  try {
    console.log('=== BACKEND STARTUP DEBUG ===')

    console.log('Initializing storage directories...')
    getStoragePath('images') // This will create the directory if it doesn't exist
    getStoragePath('videos') // Add other subdirectories as needed
    getStoragePath('documents')
    console.log('Storage directories initialized')
    const { ip, ssid, password } = await getNetworkInfo()
    console.log('Network info retrieved successfully')

    console.log('IP:', ip)
    console.log('SSID:', ssid)
    console.log('Password:', password)

    // Create config object
    const config = {
      backendIP: ip,
      backendPort: PORT,
      timestamp: new Date().toISOString()
    }

    // Store config globally for the API endpoint
    // global.networkConfig = config
    globalConfig = config
    console.log('Config stored:', config)

    // Send config to parent process (main Electron process) if running as child process
    // if (process.send) {
    //   process.send({
    //     type: 'network-config',
    //     config: config
    //   })
    //   console.log('Sent config to main process via IPC')
    // }

    // // Also write to file as fallback (for development)
    // try {
    //   const configPath = path.join(process.cwd(), 'src/renderer/src/assets/config.json')
    //   if (!fs.existsSync(path.dirname(configPath))) {
    //     fs.mkdirSync(path.dirname(configPath), { recursive: true })
    //   }
    //   fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    //   console.log('Config written to file as fallback:', configPath)
    // } catch (error) {
    //   console.log('Could not write config file (this is normal in production):', error.message)
    // }

    if (!(await testDbConnection())) {
      throw new Error("Database Connection Failed");
    }
    console.log('Database connection tested')

    // Add a test route to verify server is working
    app.get('/api/test', (req, res) => {
      console.log('Test endpoint hit!')
      res.json({ status: 'Server is running', config: globalConfig })
    })

    // Start server on all interfaces
    await new Promise((resolve, reject) => {
      const server = app.listen(PORT, '0.0.0.0', (error) => {
        if (error) {
          console.error('Server failed to start:', error)
          reject(error)
        } else {
          console.log(`Server running at: http://0.0.0.0:${PORT}`)
          console.log(`Also accessible at: http://${ip}:${PORT}`)
          console.log(`Test URL: http://localhost:${PORT}/api/test`)
          resolve(server)
        }
      })
    })

    // Return config to main process
    return config
  }
  catch(error){
    console.error('Error starting server:', error)
    throw error
  }

  // app.listen(PORT, ip, () => {
  //   console.log(`Server running at: http://${ip}:${PORT}`)
  // })
}

// Only start server if this file is run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer()
}
