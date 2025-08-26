// src/utils/env-loader.js
import { app } from 'electron'
import dotenv from 'dotenv'
import path from 'path'

export function loadEnvironmentVariables() {
  try {
    if (app.isPackaged) {
      // Production: load from resources
      const envPath = path.join(process.resourcesPath, '.env')
      dotenv.config({ path: envPath })
      console.log('Loaded production environment from:', envPath)
    } else {
      // Development: load from project root
      dotenv.config()
      console.log('Loaded development environment')
    }
  } catch (error) {
    console.warn('Could not load environment variables:', error.message)
  }
}
