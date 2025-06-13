import express from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import { getUsers, createService } from "../controllers/admin.js";
import { serviceValidator } from "../middlewares/express-validation.js"

const router = express.Router();

router.get("/users", verifyUser, getUsers);
router.post("/services", verifyUser, serviceValidator, createService);



export default router;
