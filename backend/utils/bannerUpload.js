import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { getStoragePath } from './getStoragePath.js'

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = getStoragePath('images')
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, uuidv4() + ext)
  }
})

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowedTypes.test(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (jpeg, jpg, png) are allowed'))
  }
}

const upload = multer({ storage, fileFilter })

export default upload
