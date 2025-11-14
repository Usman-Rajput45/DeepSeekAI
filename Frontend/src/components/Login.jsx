import { Axis3DIcon, Eye } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';
// import { login } from '../../../Backend/controller/user.controller';

const Login = () => {
  
  const [formdata, setformdata] = useState({
  
    email: "",
    password: ""
  })

  const [error, setError] = useState("")
  const [loading, setloading] = useState(false)
  const navigate =useNavigate()

  const [, setAuthUser] = useAuth()

  const handleChange = (e) => {
//     console.log(e.target.value)
const value =e.target.value
const name =e.target.name

setformdata({
  ...formdata,
  [name]:value
})
  }

  const handleLogin =async () => {
    setloading(true)
    setError("")
    try{
      // const data = await axios.post("http://localhost:4002/api/v1/user/login", {
        
      //       email:formdata.email,
      //        password:formdata.password,
      //   },{
      const res = await axios.post("https://deepseekai-production.up.railway.app/api/v1/user/login", {
        
             email:formdata.email,
              password:formdata.password,
         },
        {   withCredentials: true}
        );
const data = res.data; 

      

        
        console.log(data)

        alert(data.message || "User Logged In Successfully")
        localStorage.setItem("user",JSON.stringify(data.user))
        localStorage.setItem("token",data.token)
        setAuthUser(data.token)

        navigate("/login")
    }catch(error){
 const msg = error?.response?.data?.errors ||  "Signup Failed"
 setError(msg)
    }
    finally{
   setloading(false)
    }
  }


  return (
    <div className='min-h-screen flex justify-center items-center bg-black px-4'>
      <div className='bg-[#1e1e1e] text-white w-full max-w-md rounded-2xl p-6 shadow-lg  '>
        {/* heading */}
        

       <h1 className='text-white items-center justify-center text-center '>SignUP</h1>

        

       


     

     {/* email */}

    
      <div className='mb-4 mt-2 '>
          <input className='w-full bg-transparent border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]' type="text"
          name='email'
          placeholder='email'
          value={formdata.email}
          onChange={handleChange}
          />
        </div>

     {/* passward */}

       <div className='mb-4 mt-2 relative'>
          <input className='w-full bg-transparent border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]' type="password"
          name='password'
          placeholder='password'
            value={formdata.password}
          onChange={handleChange}
          />
          <span className=' absolute right-3 top-3 text-gray-400'>
            {" "}
            <Eye size={18} />
            {" "}
            </span>
        </div>

     {/* Error Message */}

     {error && <span className='text-red-600 text-sm mb-4 '>{error}</span>}

     
     {/* terms & conditions */}
     <p className='text-sm text-gray-400 mt-4 mb-6 '>By signing up or logging in, you consent to DeepSeek's 
      <a className='underline ' href="">Terms of Use</a> and 
      <a className='underline' href="">Privacy Policy</a>.</p>
      

      {/* Signup Button */}
      <button onClick={handleLogin} 
      disabled={loading}
      className='w-full bg-[#7a6ff6] hover:bg-[#6c61a6] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 '>
        {/* (loading? "Signing...":"SignUP") */}
        {loading ? "Logging in..." : "Login"}

        </button>

      {/* Links */}

      <div className='flex justify-between mt-4 text-sm'>
        <a className='text-[#7a6ff6] hover:underline ' href="">
          Haven't account?
          </a>
        <Link className='text-[#7a6ff6] hover:underline' to={"/signup"}>
        Signup
        </Link>
      </div>

      </div>
    </div>
  )
}

export default Login