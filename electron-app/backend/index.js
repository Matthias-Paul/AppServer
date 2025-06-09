import fs from 'fs'
import path from 'path'
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import { getLocalIPAddress } from './utils/getLocalIP.js';
import { testDbConnection } from './database/DB.config.js';
import authRoute from "./routes/auth.route.js";
import adminRoute from "./routes/admin.route.js";
   



dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
let IP = '127.0.0.1'

try {
  IP = getLocalIPAddress()
} catch (err) {
  console.error('Failed to get local IP address:', err)
}
  console.log("IP", IP)

app.use(cookieParser());
app.use(
  cors({
   origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const frontendEnvPath = path.join(process.cwd(), '../electron-app/.env');

let existingEnv = '';
if (fs.existsSync(frontendEnvPath)) {
  existingEnv = fs.readFileSync(frontendEnvPath, 'utf-8');
}

let envLines = existingEnv.split('\n');

// Helper to update or append a key-value pair
function setEnvValue(key, value) {
  const lineIndex = envLines.findIndex(line => line.startsWith(`${key}=`));
  const line = `${key}=${value}`;
  if (lineIndex !== -1) {
    envLines[lineIndex] = line; // Update existing
  } else {
    envLines.push(line); // Append new
  }
}

// Set or update the VITE variables
setEnvValue('VITE_BACKEND_IP', IP);
setEnvValue('VITE_BACKEND_PORT', PORT);

// Write updated .env content
fs.writeFileSync(frontendEnvPath, envLines.join('\n'));

console.log('Updated frontend .env at:', frontendEnvPath);

app.use(express.json());

testDbConnection()




app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is up and runninggggggggg!' });
});


app.use("/api", authRoute)
app.use("/api", adminRoute)





export function startServer() {
 app.listen(PORT, IP, () => {
  console.log(`Server running at:`);
  console.log(`IP:  http://${IP}:${PORT}`);
});

}


startServer() 