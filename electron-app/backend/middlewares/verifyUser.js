import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/users.model.js";

dotenv.config();

export const verifyUser = async (req, res, next) => {
  try {
    const userToken = req.cookies.token;

    if (!userToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided. Please log in!",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in .env");
    }

    const decoded = jwt.verify(userToken, secret);

   
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",    
      });
    }

    req.user = user;


    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Unauthorized.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
