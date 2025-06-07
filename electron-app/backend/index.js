
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import { getLocalIPAddress } from './utils/getLocalIP.js';
import { testDbConnection } from './database/DB.config.js'
import authRoute from "./routes/auth.route.js"
   



dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);



app.use(express.json());

testDbConnection()




app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is up and runninggggggggg!' });
});


app.use("/api", authRoute)



export function startServer() {
  const IP = getLocalIPAddress();
  app.listen(PORT, IP, () => {
    console.log(`Server running at http://${IP}:${PORT}`);
  });
}


startServer() 