import axios from 'axios'
import { ArrowUp, Bot, Globe, Paperclip } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import SyntaxHighlighter from "react-syntax-highlighter"
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism"




// import logo from '../../public/logo.png'

const Promt = () => {
    const [InputValue, setInputValue] = useState("")
    const [typeMessage, settypeMessage] = useState("")

    const [promt, setPromt] = useState([])
    const [loading, setLoading] = useState(false)

    const promtEndRef =useRef()

  

     useEffect(() => {
       const user = JSON.parse(localStorage.getItem("user"))
       const storedPromt = localStorage.getItem(`promtHistory_${user._id}`)
     if(storedPromt){
      setPromt(JSON.parse(storedPromt))
     }
     }, [])

       useEffect(()=> {
         const user = JSON.parse(localStorage.getItem("user"))
      localStorage.setItem(`promtHistory_${user._id}`,JSON.stringify(promt))
    },[promt])
     


    useEffect(()=>{
     promtEndRef.current?.scrollIntoView({behaviour: "smooth"})
    },[promt, loading])

    console.log(promt)

    const handleSend =async () => {
      const trimmed = InputValue.trim()
      if(!trimmed) return
      settypeMessage(trimmed) 
      setInputValue("")
      setLoading(true)

      try{
        const token = localStorage.getItem("token")
       
        const {data} =  await axios.post("http://localhost:4002/api/v1/DeepSeekAi/promt",
            {content:trimmed},
            {
              headers:{
                Authorization:`Bearer ${token}`
              },
              withCredentials:true

            }
           )
           setPromt((prev) => [
            ...prev,
            {role:"user", content:trimmed},
            {role:"assistant", content:data.reply}
           ])

      }catch (error) {

         setPromt((prev) => [
            ...prev,
            {role:"user", content:trimmed},
            {role:"assistant", content:"Something went wronge with the AI response"}
           ])

      }finally {
       setLoading(false)
       settypeMessage(null)
      }
    }

    // const hanldeKeyDown = (e) => {
    //   if(e.key === "Enter") {
    //     handleSend()
    //   }
    // }

    const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Only Enter (no Shift) → Submit
      e.preventDefault(); // Prevent newline
      handleSend();
    }
    // Shift+Enter → default behavior inserts newline, no need to handle
  };


  return (

   
      



    <div className='flex flex-col h-screen items-center justify-between flex-1 w-full px-4 pb-4'>

 
  

      {/* Greeting  */}
      <div className='mt-16 text-center '>
         <div className='flex items-center justify-center gap-2'>
        <img src="data:image/png;base64,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" alt="DeepSeek Logo" className='h-8' />
        <h1 className='text-3xl font-semibold text-white mb-2'>Hi, i'm Deepseek</h1>
        </div>
        <p className='text-gray-400 text-base mt-2'>How can I help you today?</p>

      </div>

    {/* Promt */}

<div className=' w-full max-w-4xl flex-1 overflow-y-auto mt-6 mb-4 space-y-4 max-h-[60vh] px-1'>
  {promt.map((msg, index) => (
    <div key={index} className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`${msg.role === "user" ? "bg-blue-700 text-white" : "bg-[#232323] text-white"} max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={prism}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg mt-2"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-500 px-1 py-0.5 rounded" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {msg.content}
        </ReactMarkdown>
      </div>
    </div>
  ))}

  {loading && typeMessage && (
    <div className="w-full flex justify-end">
      <div className="bg-blue-700 text-white px-4 py-2 rounded-xl text-sm whitespace-pre-wrap">
        {typeMessage}
      </div>
    </div>
  )}

  {loading && (
    <div className="w-full flex justify-start">
      <div className="bg-[#232323] text-white px-4 py-2 rounded-xl text-sm animate-pulse">
        Loading...
      </div>
    </div>
  )}
  <div ref={promtEndRef} />
</div>





  {/* 👇 Fixed Input Section
  <div className="w-full max-w-4xl mx-auto mb-4">
    <input
      type="text"
      placeholder="Type your message..."
      className="w-full p-3 rounded-lg border border-gray-300"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  </div>
</div> */}







      {/* Input Box */}
      <div className='w-full max-w-4xl relative mt-auto '>
      
        <div className='bg-[#2f2f2f] rounded-[2rem] px-6 py-8 shadow-md'>
          <input type="text"
          value={InputValue}
          onChange={(e)=>setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
           placeholder='Message DeepSeek'
           className='bg-transparent w-full text-white placeholder-gray-400 text-lg outline-none ' />

          <div className='flex items-center justify-between mt-4 gap-4'>
            <div className='flex gap-2'>
              <button className='flex items-center gap-2 border border-gray-500 text-white text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition'>
                <Bot className='w-4 h-4'/>DeepThink (R1)
                </button>
                <button className='flex items-center gap-2 border border-gray-500 text-white text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition'>
                  <Globe className='w-4 h-4'/> 
                  Search
                  </button>
                </div>
                <div className='flex items-center gap-2'>
                 <button className='text-gray-400 hover:text-white transition'>
                  <Paperclip className='w-5 h-5'/>
                  </button >
                 <button
                 onClick={handleSend}
                 className='bg-gray-500 hover:bg-blue-900 p-2 rounded-full text-white transition'>
                  <ArrowUp className='w-4 h-4'/>
                  </button>
                </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Promt