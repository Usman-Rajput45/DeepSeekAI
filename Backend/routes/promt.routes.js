import express from 'express'
import { sendPromt } from '../controller/promt.controller.js';
import useMiddleware from '../middleware/promt.middleware.js';


const router = express.Router()

router.post("/promt", useMiddleware, sendPromt);


export default router;