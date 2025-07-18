import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ userId, role }, secret);
};

export default generateToken;
