// import OpenAI from "openai";
// import { promt } from "../model/promt.model.js"


// const openai = new OpenAI({
//   baseURL: 'https://api.deepseek.com',
//   apiKey: process.env.OPEN_API_KEY
// });
// console.log(openai.apiKey)
// export const sendPromt =async (req, res) => {
//   const { content } = req.body
//   const userId = req.userId

//   if(!content || content.trim() === "") {
// return res.status(400).json({errors: "Promt Content is required..."})
//   }
//   try {

//     // Save User Promt 
// const userPromt =await promt.create({
//   userId,
//   role: "user",
//   content
// });

// // Send to OpenAi
// const completion = await openai.chat.completions.create({
//   messages: [{ role: "user", content: content }],
//   model: "deepseek-chat",
// });

// const aiContent = completion.choices[0].message.content

//    // Save assistant Promt 
//    const aiMessage =await promt.create({
//     userId,
//     role: "assistant",
//     content: aiContent
//   });
//   return res.status(200).json({reply: aiContent})
//   }catch(error) {
// console.log("Error in Promt....", error)
// return res.status(502).json({error: "Something Went Wronge with AI response.."})
//   }
//  }; 






import OpenAI from "openai";
import { promt } from "../model/promt.model.js";

// Initialize OpenAI / DeepSeek API
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.OPEN_API_KEY
});

// 🧠 Send prompt to DeepSeek and store user + assistant messages
export const sendPromt = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId;

  if (!content || content.trim() === "") {
    return res.status(400).json({ errors: "Prompt content is required." });
  }

  try {
    // Save user prompt
    await promt.create({
      userId,
      role: "user",
      content
    });

    // Send to AI model
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content }],
      model: "deepseek-chat",
    });

    const aiContent = completion.choices[0].message.content;

    // Save AI reply
    await promt.create({
      userId,
      role: "assistant",
      content: aiContent
    });

    return res.status(200).json({ reply: aiContent });
  } catch (error) {
    console.log("Error in sendPromt:", error);
    return res.status(502).json({ error: "Something went wrong with AI response." });
  }
};

// ➕ Start a new chat (optional feature)
export const newChat = async (req, res) => {
  try {
    const userId = req.userId;
    const chat = await promt.create({
      userId,
      role: "system",
      content: "New Chat Started"
    });

    res.status(201).json({ message: "New chat created successfully", chat });
  } catch (error) {
    console.error("Error in creating new chat:", error);
    res.status(500).json({ error: "Failed to create new chat" });
  }
};

// 📜 Fetch all chat history for a user
export const getAllChats = async (req, res) => {
  try {
    const userId = req.userId;
    const chats = await promt
      .find({ userId })
      .sort({ createdAt: -1 })
      .select("role content createdAt");

    res.status(200).json({ chats });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};
