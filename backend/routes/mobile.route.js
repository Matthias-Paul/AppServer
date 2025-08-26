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
import { registerValidation, loginValidation, transactionValidator, serviceDetailsValidation } from '../middlewares/express-validation.js'
import { verifyUser } from '../middlewares/verifyUser.js'




const router = express.Router()


router.post('/mobile/auth/register', registerValidation, register)
router.post('/mobile/auth/login', loginValidation, login)
router.get('/mobile/services',verifyUser, getServicesWithMediaCounts)
router.post('/mobile/media/download', verifyUser, transactionValidator, downloadMedia)
router.post('/mobile/services', verifyUser, serviceDetailsValidation, getServiceWithMedia)
router.get('/mobile/credit/history',verifyUser, creditHistory)
router.get('/mobile/download/history', verifyUser, downloadHistory)



export default router
