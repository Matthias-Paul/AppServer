import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), './backend/fileStorage/images')

    // ✅ Ensure the folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }

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
