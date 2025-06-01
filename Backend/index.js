import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import userRoutes from "./routes/user.routes.js"
import promtRoutes from "./routes/promt.routes.js"
import cors from "cors"

import { User } from './model/user.model.js';
import cookieParser from 'cookie-parser';


dotenv.config()
const app = express()
const port = process.env.PORT || 4001;
const MONGO_URL = process.env.MONGODB_URL

//Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin:process.env.FrontEnd_URL,
   credentials: true, 

    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders:["Content-Type", "Authorization"]
  })
)

// DB Connection Code Goes Here!
mongoose.connect(MONGO_URL
//   , {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 10000 // Optional: gives MongoDB 10s to connect
// }
)
.then(()=>console.log("Connected to MongoDB"))
.catch((error)=>console.error("MongoDB Connection Error:" ,error))

//Routes
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/DeepSeekAi", promtRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
