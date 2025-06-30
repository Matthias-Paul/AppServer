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
  settings,
  checkSettings,
  editService,
  removeMediaFromService,
  getConnectionStatus,
  addExistingMediaToService,
  allocateCredits,
  creditHistory,
  creditUsage,
} from '../controllers/admin.js'
import { registerValidation } from '../middlewares/express-validation.js'

const router = express.Router()

router.get('/users', verifyUser, getUsers)
router.get('/services', getAllServices)
router.post('/addUser', verifyUser, registerValidation, addUser)
router.get('/settings/checks', verifyUser, checkSettings)
router.put(
  '/settings',
  verifyUser,
  upload.fields([
    { name: 'church_logo', maxCount: 1 },
    { name: 'church_banner', maxCount: 1 }
  ]),
  settings
)
router.post('/services', verifyUser, upload.single('banner'), createService)
router.post('/media', verifyUser, electronUpload.single('file'), createMedia)
router.get('/media', getAllMedia)
router.get('/connection/status', getConnectionStatus);
router.get('/credit/history', verifyUser, creditHistory);
router.get('/credit/usage', verifyUser, creditUsage);

router.put('/services/:id/editService', verifyUser, upload.single('banner'), editService)
router.post('/services/:id/addMedia', verifyUser, electronUpload.single('file'), addMedia)
router.get('/services/:id', getServices)
router.get('/services/:serviceId/media', getServiceMedia)
router.delete('/media/:id', verifyUser, deleteMedia)
router.get('/media/:id', getMedia)
router.put('/media/:id', verifyUser, electronUpload.single('file'), updateMedia)
router.get('/services/withMedia/:id', getAllServicesWithMedia)
router.delete('/services/:serviceId/:mediaId', verifyUser, removeMediaFromService)
router.put('/services/addExistingMedia/:serviceId/:mediaId', verifyUser, addExistingMediaToService)
router.post('/credit/allocate/:id', verifyUser, allocateCredits)


export default router
