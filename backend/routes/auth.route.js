import express from 'express'
import { registerValidation, loginValidation } from '../middlewares/express-validation.js'
import { registerUser, loginUser, logoutUser, checkAdminExists } from '../controllers/auth.js'

const router = express.Router()

router.post('/auth/register', registerValidation, registerUser)
router.post('/auth/login', loginValidation, loginUser)
router.get('/auth/logout', logoutUser)
router.get('/auth/check-admin', checkAdminExists)

export default router
