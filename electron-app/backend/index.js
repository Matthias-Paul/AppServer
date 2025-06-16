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

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    return res.status(400).json({ success: false, message: err.message })
  } else if (
    err.message === 'Unsupported file type' ||
    err.message === 'Unsupported media file type'
  ) {
    // Custom file type errors
    return res.status(400).json({ success: false, message: err.message })
  }
})

app.use('/fileStorage', express.static(path.join(process.cwd(), 'backend/fileStorage')))

export async function startServer() {
  const { ip, ssid, password } = await getNetworkInfo()

  console.log('IP:', ip)
  console.log('SSID:', ssid)
  console.log('Password:', password)

  const frontendEnvPath = path.join(process.cwd(), '../electron-app/.env')

  let existingEnv = ''
  if (fs.existsSync(frontendEnvPath)) {
    existingEnv = fs.readFileSync(frontendEnvPath, 'utf-8')
  }

  let envLines = existingEnv.split('\n')

  function setEnvValue(key, value) {
    const lineIndex = envLines.findIndex((line) => line.startsWith(`${key}=`))
    const line = `${key}=${value}`
    if (lineIndex !== -1) {
      envLines[lineIndex] = line
    } else {
      envLines.push(line)
    }
  }

  setEnvValue('VITE_BACKEND_IP', ip)
  setEnvValue('VITE_BACKEND_PORT', PORT)
  setEnvValue('VITE_NETWORK_NAME', ssid)
  setEnvValue('VITE_NETWORK_PASSWORD', password)

  fs.writeFileSync(frontendEnvPath, envLines.join('\n'))
  console.log('✅ Updated frontend .env at:', frontendEnvPath)

  testDbConnection()

  app.listen(PORT, ip, () => {
    console.log(`🚀 Server running at: http://${ip}:${PORT}`)
  })
}

startServer()
