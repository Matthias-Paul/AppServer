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

export const loginUser = async(req, res, next)=>{


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If there are validation errors, return the first error message
        return res.status(400).json({
            statusCode: 400,
            success: false,  
            message: errors.array()[0].msg 
        }); 
    }
    try {
        const {email, password } = matchedData(req)
        
        let user = await User.findOne({ where: { email } });
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found.",
            });
        }

       
        const isMatch = await bcryptjs.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials.",
            });    
        }
        const token = await generateToken(user.id, user.role, res); 
        console.log(token)
  
        return res.status(200).json({
            success:true,  
            user:{
                id:user.id,
                name:user.username,
                email:user.email,
                role:user.role,  
                createdAt:user.created_at,    
                updatedAt:user.updated_at  
            },      
            message:"Login Successful"
        })
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        });
    
    }
}


export const logoutUser = async (req, res)=>{

  try {
      
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });   

    return res.status(200).json({
        statusCode: 200,
        success: true,
        message:"User log out successfully"
        
    })


  } catch (error) {
     console.log(error.message)

    
    return res.status(500).json({
        statusCode: 500,
        success: false,
        message:"Internal Server Error"
    })
  }
      
}

