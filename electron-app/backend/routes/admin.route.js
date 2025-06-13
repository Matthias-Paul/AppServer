import express from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import upload from '../utils/bannerUpload.js'
import { getUsers, createService, getServices } from "../controllers/admin.js";
import {  } from "../middlewares/express-validation.js"

const router = express.Router();

router.get("/users", verifyUser, getUsers);
router.post("/services", verifyUser, upload.single('banner'), createService);
router.get("/services/:id", getServices);



export default router;
