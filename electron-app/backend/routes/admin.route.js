import express from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import upload from '../utils/bannerUpload.js'
import mediaUpload from "../utils/mediaUpload.js";
import { getUsers, createService, getServices, addMedia, getServiceMedia } from "../controllers/admin.js";
import {  } from "../middlewares/express-validation.js"

const router = express.Router();

router.get("/users", verifyUser, getUsers);
router.post("/services", verifyUser, upload.single('banner'), createService);
router.post("/services/:id/addMedia", verifyUser, mediaUpload.single("file"), addMedia);
router.get("/services/:id", getServices);
router.get("/services/:serviceId/media", getServiceMedia);




export default router;
