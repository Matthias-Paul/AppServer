import express from 'express'
import { verifyUser } from '../middlewares/verifyUser.js'
import upload from '../utils/bannerUpload.js'
import { electronUpload } from '../utils/multer.js'
import {
  getUsers,
  createService,
  getServices,
  addMedia,
  getServiceMedia
} from '../controllers/admin.js'
import {} from '../middlewares/express-validation.js'

const router = express.Router()

router.get('/users', verifyUser, getUsers)
router.post('/services', verifyUser, upload.single('banner'), createService)
router.post('/services/:id/addMedia', verifyUser, electronUpload.single('file'), addMedia)
router.get('/services/:id', getServices)
router.get('/services/:serviceId/media', getServiceMedia)

export default router
