import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { getStoragePath } from './getStoragePath.js'

// Set storage engine for general file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the subfolder based on file type
    let subfolder = 'documents' // default

    if (file.mimetype.startsWith('image/')) {
      subfolder = 'images'
    } else if (file.mimetype.startsWith('video/')) {
      subfolder = 'videos'
    } else if (file.mimetype.startsWith('audio/')) {
      subfolder = 'audio'
    }

    const uploadPath = getStoragePath(subfolder)
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, uuidv4() + ext)
  }
})

// File filter for media files
const fileFilter = (req, file, cb) => {
  // Allow images, videos, audio, and some document types
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mkv|mov|wmv|flv|webm|mp3|wav|flac|aac|pdf|doc|docx|txt/
  const ext = path.extname(file.originalname).toLowerCase()

  if (allowedTypes.test(ext.slice(1))) {
    cb(null, true)
  } else {
    cb(new Error(`Unsupported file extension: ${ext}`))
  }
}

export const electronUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
})
