import fs from 'fs'
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

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cookieParser())
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
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

app.use('/fileStorage', express.static(path.join(process.cwd(), 'backend/fileStorage')))

// Add endpoint to serve config
app.get('/api/config', (req, res) => {
  res.json(global.networkConfig || {})
})

export async function startServer() {
  const { ip, ssid, password } = await getNetworkInfo()

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
  global.networkConfig = config

  // Send config to parent process (main Electron process) if running as child process
  if (process.send) {
    process.send({
      type: 'network-config',
      config: config
    })
    console.log('Sent config to main process via IPC')
  }

  // Also write to file as fallback (for development)
  try {
    const configPath = path.join(process.cwd(), 'src/renderer/src/assets/config.json')
    if (!fs.existsSync(path.dirname(configPath))) {
      fs.mkdirSync(path.dirname(configPath), { recursive: true })
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    console.log('Config written to file as fallback:', configPath)
  } catch (error) {
    console.log('Could not write config file (this is normal in production):', error.message)
  }

  testDbConnection()

  app.listen(PORT, ip, () => {
    console.log(`Server running at: http://${ip}:${PORT}`)
  })
}

startServer()
