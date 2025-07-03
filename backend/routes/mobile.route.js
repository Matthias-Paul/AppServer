import express from 'express'

import {
  register,
  login,
  getServicesWithMediaCounts,
  getServiceWithMedia,
  downloadMedia,
  creditHistory,
  downloadHistory,
} from '../controllers/mobile.js'
import { registerValidation, loginValidation } from '../middlewares/express-validation.js'




const router = express.Router()


router.post('/mobile/auth/register', registerValidation, register)
router.post('/mobile/auth/login', loginValidation, login)
router.get('/mobile/services', getServicesWithMediaCounts)
router.get('/mobile/media/download/:mediaId/:userId', downloadMedia)
router.get('/mobile/services/:serviceId', getServiceWithMedia)
router.get('/mobile/credit/history/:userId', creditHistory)
router.get('/mobile/download/history/:userId', downloadHistory)



export default router
