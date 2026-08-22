import {Link, Links, useNavigate} from 'react-router-dom'
import logo from '../assets/imagefor.png'
import "../styles/LoginRegister.css"
import axios from 'axios'
import { useState } from 'react'
import { userApi } from '../api/api'
import { toast } from 'react-toastify'

const Register = () => {
  const navigate = useNavigate()
    //email and password useState
   const [Email, setEmail] = useState("");
   const [password, setpassword] = useState("")
    const [username, setusername] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")


    //login handler axios funciton
   async function RegisterHandler(data){
        try {
          const res = await userApi.post('/register',data)
          console.log(data);
          toast.success("succesfully register")
          navigate("/user-job")
        } catch (error) {
          console.log(error);
           const message =
    error.response?.data?.errors?.[0] ||
    error.response?.data?.message ||
    "Registration failed";

  toast.error(message);
        }
    }

    //button disable funciton
    const isDisable = Email.trim() === "" || password.trim() ==="" ||
     username.trim() === "" || phoneNumber === "";

     //form handler 
    function formHandler(e){
        e.preventDefault()
      
    if(isDisable) return //when this function is true lower function not work
        
    const data = {
      email:Email,
      password:password,
      username:username,
      phoneNumber:phoneNumber
    }
    RegisterHandler(data)
    }
  return (
    <div className='login-main-container ' >
      
        <div className='right-side-main'>
        <img src={logo} alt=''/>
        </div> 
     <div className='left-side-main'>

        <form className='left-form'  onSubmit={(e)=>formHandler(e)}>
       <div className="login-top-heading">
             <p className="first-font">Welcome to NextHire</p>
          <p className="p-login">Sign up</p>
         </div>
           <label htmlFor="username">Username</label>
          <input type="text" 
            id='username'
            className='input-fleid'
            value={username}
            onChange={(e)=>setusername(e.target.value)}
            />

            <label htmlFor="email">Email</label>
                {/* email input */}
            <input type="text" 
            id='email'
            className='input-fleid'
            value={Email}
            onChange={(e)=>setEmail(e.target.value)}
            />

            {/* phone number input */}
            <label htmlFor="phone">Phone Number</label>
  
            <input type="number" 
            id='phone'
            className='input-fleid'
            value={phoneNumber}
            onChange={(e)=>setPhoneNumber(e.target.value)}
            />

            <label htmlFor="password">Password</label>
                {/* password input */}

            <input type="text"
             id='password' 
             className='input-fleid'
             value={password}
              onChange={(e)=>setpassword(e.target.value)}
             />

            <button type="submit"
            disabled={isDisable}
            style={{
                cursor : isDisable ? 'not-allowed' : 'pointer',
                opacity:isDisable? 0.3 : 1
            }}
            >Register</button>
    <hr />
            <p>Don't have an account?<Link to={'/'} 
              className="left-link">Login</Link></p>
       
        </form>
        
             </div>
       
       
    </div>
  )
}

export default Register