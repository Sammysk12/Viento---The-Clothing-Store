import React, { useEffect, useState } from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'

import loginImg from '../assets/login.webp'

//slice for login user 
import { loginUser } from '../Redux/Slice/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { mergeCarts } from '../Redux/Slice/cartSlice'


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    //dispatch hook for dispatching
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const location = useLocation();

    const {user, guestId, loading} = useSelector((state) => state.auth);
    const {cart} = useSelector((state) => state.cart)

    //Get redirect parameter and check if it's checkout or something else

    const redirect = new URLSearchParams(location.search).get("redirect") || "/";

    const isCheckoutRedirect = redirect.includes('checkout');


    useEffect(()=>{
      if(user){
        if(cart?.products.length > 0 && guestId){
          dispatch(mergeCarts({guestId, user})).then(()=>{
            navigate(isCheckoutRedirect ? '/checkout' : '/');
          })
        }else {
          navigate(isCheckoutRedirect ? "/checkout" : '/')
        }
      }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch])
    
const handleSubmit = (e) =>{
  e.preventDefault();
  dispatch(loginUser({email,password}))
}

  

  return (
    <div className='flex p-6'>
        <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
            <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
                    <div className='flex justify-center mb-6'>
                        <h2 className='text-xl font-medium'>Rabbit</h2>
                    </div>
                    <h2 className='text-2xl font-bold text-center mb-6'>Hey there!👋🏻</h2>
                    <p className='text-center mb-6'>Enter your Username and Password to Login</p>
                    <div className='mb-4'>
                      <label className='block text-sm font-semibold mb-2'>Email</label>
                      <input type="email" value={email} onChange={(e) =>setEmail(e.target.value)} className='w-full p-2 border rounded' placeholder='Enter your email address'/>
                    </div>

                    <div className='mb-4'>
                      <label className='block text-sm font-semibold mb-2'>Password</label>
                      <input type="password" value={password} onChange={(e) =>setPassword(e.target.value)} className='w-full p-2 border rounded' placeholder='Enter your password'/>
                    </div>
                    <button type='submit' className='w-full bg-black text-white rounded-lg p-2 font-semibold hover:bg-gray-800 transition'>{loading ? "Loading..." : "Sign In"}</button>
                    <p className='mt-6 text-center text small'>Don't have an Account? <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500'>Register</Link> </p>
            </form>
        </div>

        <div className='hidden md:block w-1/2 bg-gray-800'>
        <div className='h-full flex flex-col justify-center items-center'>
            <img src={loginImg} alt='Login to Account' className='h-[750px] w-full object-cover' />
        </div>
        </div>
    </div>
  )
}

export default Login