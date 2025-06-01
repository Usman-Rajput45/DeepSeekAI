import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Promt from './Promt'

const Home = () => {

  const [chatHistory, setChatHistory] = useState([])


  const handleNewChat = () => {
    setChatHistory([])
  }


  const addMessageToHistory = (message) => {
    setChatHistory(prev => [...prev, message])
  }

  return (
    <div className='flex h-screen bg-[#1e1e1e] text-white'>
      <div className='w-64 bg-[#232327]'>
        <Sidebar chatHistory={chatHistory} onNewChat={handleNewChat} />
      </div>

      <div className='flex-1 flex flex-col w-full'>
        <div className='flex-1 flex items-center justify-center px-6'>
          <Promt addMessageToHistory={addMessageToHistory} chatHistory={chatHistory} />
        </div>
      </div>
    </div>
  )
}

export default Home
