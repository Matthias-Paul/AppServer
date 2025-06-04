import express from "express";
import User from "../models/users.model.js";
import { validationResult, matchedData } from "express-validator";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js"


dotenv.config();

export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    const { username, email, password, role } = matchedData(req);

    const existingEmail = await User.findOne({ where: { email } });
    
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use.",
      });
    }

    const existingUsername = await User.findOne({ where: { username } });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username is already in use.",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      role,
    });

    const { password_hash: _, ...userWithoutPassword } = user.get({ plain: true });

    const token = await generateToken(user.id, user.role, res); 
        console.log(token)
  
    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      message: "Signup successful!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
  }
};

