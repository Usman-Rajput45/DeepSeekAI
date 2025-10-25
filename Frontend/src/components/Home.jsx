// import React, { useState } from 'react'
// import Sidebar from './Sidebar'
// import Promt from './Promt'

// const Home = () => {

//   const [chatHistory, setChatHistory] = useState([])


//   const handleNewChat = () => {
//     setChatHistory([])
//   }


//   const addMessageToHistory = (message) => {
//     setChatHistory(prev => [...prev, message])
//   }

//   return (
//     <div className='flex h-screen bg-[#1e1e1e] text-white'>
//       <div className='w-64 bg-[#232327]'>
//         <Sidebar chatHistory={chatHistory} onNewChat={handleNewChat} />
//       </div>

//       <div className='flex-1 flex flex-col w-full'>
//         <div className='flex-1 flex items-center justify-center px-6'>
//           <Promt addMessageToHistory={addMessageToHistory} chatHistory={chatHistory} />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Home







import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Promt from './Promt'

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const storageKey = `promtHistory_${user?._id || "guest"}`

  const [allChats, setAllChats] = useState([])      // array of { id, title, messages: [{role, content}] }
  const [currentChatId, setCurrentChatId] = useState(null)
  const [chatMessages, setChatMessages] = useState([]) // messages shown in Promt

  // load saved chats
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey)) || []
      setAllChats(saved)
      if (saved.length > 0) {
        // keep UI initial empty; we won't auto-open a chat
      }
    } catch (e) {
      setAllChats([])
    }
    // eslint-disable-next-line
  }, [])

  // persist chats
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(allChats))
  }, [allChats])

  // Create New Chat (blank) — newest chats appear at start
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: []
    }
    setAllChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    setChatMessages([])
  }

  // Select chat from sidebar — load messages into Promt
  const handleSelectChat = (chatId) => {
    const chat = allChats.find(c => c.id === chatId)
    setCurrentChatId(chatId)
    setChatMessages(chat ? chat.messages : [])
  }

  // Delete chat
  const handleDeleteChat = (chatId) => {
    const updated = allChats.filter(c => c.id !== chatId)
    setAllChats(updated)
    if (currentChatId === chatId) {
      setCurrentChatId(null)
      setChatMessages([])
    }
  }

  // Add a single message (object {role, content}) to the current chat.
  // Also handles case where no chat is selected (it will create one).
  const addMessageToChat = (message) => {
    // if there's no active chat -> create one and put message in it
    if (!currentChatId) {
      const newChat = {
        id: Date.now(),
        title: message.role === "user" ? (message.content.slice(0, 30) || "New Chat") : "New Chat",
        messages: [message]
      }
      setAllChats(prev => [newChat, ...prev])
      setCurrentChatId(newChat.id)
      setChatMessages([message])
      return
    }

    // update existing chat and move it to top (most recent first)
    let updatedChat = null
    const others = []
    for (const c of allChats) {
      if (c.id === currentChatId) {
        const newMessages = [...(c.messages || []), message]
        const newTitle = (c.title === "New Chat" || !c.title || c.title.trim() === "")
          && message.role === "user"
          ? message.content.slice(0, 30)
          : c.title
        updatedChat = { ...c, messages: newMessages, title: newTitle }
      } else {
        others.push(c)
      }
    }

    // if somehow chat not found (edge), create
    if (!updatedChat) {
      const newChat = {
        id: currentChatId,
        title: message.role === "user" ? message.content.slice(0, 30) : "Chat",
        messages: [message]
      }
      setAllChats(prev => [newChat, ...prev])
      setChatMessages([message])
      return
    }

    // put updated chat first, then others (keeps newest on top)
    setAllChats([updatedChat, ...others])
    setChatMessages(prev => [...prev, message])
  }

  return (
    <div className='flex h-screen bg-[#1e1e1e] text-white'>
      <div className='w-64 bg-[#232327]'>
        <Sidebar
          allChats={allChats}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          currentChatId={currentChatId}
        />
      </div>

      <div className='flex-1 flex flex-col w-full'>
        <div className='flex-1 flex items-center justify-center px-6'>
          <Promt
            addMessageToHistory={addMessageToChat}
            chatHistory={chatMessages}
            clearOnNewChat={() => { setChatMessages([]) }}
          />
        </div>
      </div>
    </div>
  )
}

export default Home
