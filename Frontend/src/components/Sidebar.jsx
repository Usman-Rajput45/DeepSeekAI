import React, { useState } from 'react'
import { LogOut, X } from "lucide-react"
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  console.log(user)

  const [, setAuthUser] = useAuth()
  const navigate = useNavigate()

  const handleLogout =async () => {
   try{

     const {data} = await axios.get("http://localhost:4002/api/v1/user/logout", {
      withCredentials:true
    })
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  
    alert(data.message)
  
    setAuthUser(null)
    navigate("/login")

   }catch(error) {
alert(error?.response?.data?.errors || "Logout Failed")
   }
  }

  return (



    <div className='h-full flex flex-col bg-[#232327]'>

     
{/* Header */}
<div className='p-4 border-b border-gray-700 flex items-center justify-between'>
    <div className='text-xl font-bold text-white hover:cursor-pointer '>Deepseek</div>
    <button><X className='text-gray-300 w-6 h-6 ' /></button>
</div>


{/* History */}
<div className='flex-1 overflow-y-auto px-4 py-3 space-y-2 '>


  <button className='w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl mb-4  '>+ New Chat</button>


  <div className='text-gray-500 text-sm mt-20 text-center '>No chat history yet</div>
</div>


{/* Footer */}
<div className='p-4 border-t border-gray-700 '>
  <div className='flex flex-col gap-3 '>
    <div className='flex items-center gap-2 cursor-pointer '>
      <img className='rounded-full w-8 h-8' src="data:image/jpeg;base64,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" alt="" />
      <span className='text-gray-300 '>{user? user.firstName: "My Profile"}</span>
    </div>
    <button onClick={handleLogout} className='flex items-center text-sm gap-2 text-white px-4 py-2 rounded-lg hover:bg-gray-700 duration-300 transition'>
      <LogOut className=''/>
      Logout
      </button>
  </div>
</div>

    </div>
  )
}

export default Sidebar










