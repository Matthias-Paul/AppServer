import express from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import { getUsers } from "../controllers/admin.js";

const router = express.Router();

router.get("/users", verifyUser, getUsers);

export default router;
