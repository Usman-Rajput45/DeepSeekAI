import OpenAI from "openai";
import { promt } from "../model/promt.model.js"


const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.OPEN_API_KEY
});
console.log(openai.apiKey)
export const sendPromt =async (req, res) => {
  const { content } = req.body
  const userId = req.userId

  if(!content || content.trim() === "") {
return res.status(400).json({errors: "Promt Content is required..."})
  }
  try {

    // Save User Promt 
const userPromt =await promt.create({
  userId,
  role: "user",
  content
});

// Send to OpenAi
const completion = await openai.chat.completions.create({
  messages: [{ role: "user", content: content }],
  model: "deepseek-chat",
});

const aiContent = completion.choices[0].message.content

   // Save assistant Promt 
   const aiMessage =await promt.create({
    userId,
    role: "assistant",
    content: aiContent
  });
  return res.status(200).json({reply: aiContent})
  }catch(error) {
console.log("Error in Promt....", error)
return res.status(502).json({error: "Something Went Wronge with AI response.."})
  }
 };