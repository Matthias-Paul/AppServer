import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = async (userId, role, res)=> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  const userToken = jwt.sign({ userId, role }, secret, {
    expiresIn: "7d",
  });

  res.cookie("token", userToken, {
    httpOnly: true,
    sameSite: "strict",
  });

  return userToken;
};

export default generateToken;