import express from "express"
import {registerValidation, loginValidation } from "../middlewares/express-validation.js"
import { registerUser, loginUser, logoutUser } from "../controllers/auth.js"

const router = express.Router()




router.post("/auth/register", registerValidation, registerUser)
router.post("/auth/login", loginValidation, loginUser)
router.get("/auth/logout", logoutUser)
   
export default router

              