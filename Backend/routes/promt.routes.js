// import express from 'express'
// import { sendPromt } from '../controller/promt.controller.js';
// import useMiddleware from '../middleware/promt.middleware.js';


// const router = express.Router()

// router.post("/promt", useMiddleware, sendPromt);


// export default router;




import express from 'express'
import useMiddleware from '../middleware/promt.middleware.js'
import {
  sendPromt,
  newChat,
  getAllChats
} from '../controller/promt.controller.js'

const router = express.Router()

// 🧠 Send user prompt + get AI reply
router.post("/promt", useMiddleware, sendPromt)

// ➕ Create new empty chat (optional)
router.post("/newchat", useMiddleware, newChat)

// 📜 Get all previous chat messages for this user
router.get("/chats", useMiddleware, getAllChats)

export default router
