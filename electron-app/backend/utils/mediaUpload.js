

// backend/middleware/multerConfig.js
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// Extension map to media types
  const extensionToType = {
  '.mp3': 'audios',
  '.wav': 'audios',
  '.aac': 'audios',
  '.mp4': 'videos',
  '.avi': 'videos',
  '.mov': 'videos',
  '.jpg': 'images',
  '.jpeg': 'images',
  '.png': 'images',
  '.gif': 'images',
  '.pdf': 'documents',
  '.txt': 'documents'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const mediaType = extensionToType[ext]

    console.log(mediaType)

    if (!mediaType) {
      return cb(new Error('Unsupported media file type'), false)
    }

    const targetPath = path.join(process.cwd(), `backend/fileStorage/${mediaType}`)

    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true })
    }

    cb(null, targetPath)
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const uniqueName = `${uuidv4()}${ext}`
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  if (extensionToType[ext]) {
    cb(null, true)
  } else {
    cb(new Error('Unsupported file type'), false)
  }
}

const mediaUpload = multer({ storage, fileFilter })

export default mediaUpload
