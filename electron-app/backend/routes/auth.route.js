import express from "express"
import {registerValidation, loginValidation } from "../middlewares/express-validation.js"
import { registerUser } from "../controllers/auth.js"
import { verifyUser } from "../middlewares/verifyUser.js"

const router = express.Router()




router.post("/auth/register", registerValidation, registerUser)

// router.post("/login", loginValidation, loginUser)
// router.get("/logout", logoutUser)
   
export default router

              