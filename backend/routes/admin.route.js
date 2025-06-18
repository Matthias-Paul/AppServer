import express from 'express'
import { verifyUser } from '../middlewares/verifyUser.js'
import upload from '../utils/bannerUpload.js'
import { electronUpload } from '../utils/multer.js'
import {
  getUsers,
  createService,
  getServices,
  addMedia,
  getServiceMedia,
  getAllServices,
  createMedia,
  getAllMedia,
  deleteMedia,
  addUser,
  getMedia,
  updateMedia,
  getAllServicesWithMedia,
} from '../controllers/admin.js'
import { registerValidation } from '../middlewares/express-validation.js'

const router = express.Router()

router.get('/users', verifyUser, getUsers)
router.get('/services', getAllServices)
router.post('/addUser', verifyUser, registerValidation, addUser)
router.post('/services', verifyUser, upload.single('banner'), createService)
router.post('/media', verifyUser, electronUpload.single('file'), createMedia)
router.get('/media', getAllMedia)
router.post('/services/:id/addMedia', verifyUser, electronUpload.single('file'), addMedia)
router.get('/services/:id', getServices)
router.get('/services/:serviceId/media', getServiceMedia)
router.delete('/media/:id', verifyUser, deleteMedia)
router.get('/media/:id',  getMedia)
router.put('/media/:id', verifyUser, electronUpload.single('file'), updateMedia)
router.get('/services/withMedia/:id', getAllServicesWithMedia)


export default router
