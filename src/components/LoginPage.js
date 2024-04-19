import React from 'react'
import axios from 'axios';
import { Context } from '../App';

export const LoginPage = () => {
  const {setPage, setUser, backendLocation} = React.useContext(Context)
  const [data, setData] = React.useState({username: '', password: ''})
  const instance = axios.create({
    baseURL: backendLocation
  })

  const login = (e) => {
    e.preventDefault();
    console.log(data);
    instance.post('/api/v1/users/login', data )
    .then((response) => {
      if (response.status === 200) {
        setUser(data.username)
        setPage('userpage');
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  return (
    <div className='pageContainer md:min-w-[736px] md:w-[60%] md:max-w-[1000px]  bg-white rounded-2xl h-[90%] absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] overflow-auto flex flex-col justify-center items-center'>
        <div className='flex flex-col justify-center w-[94%] h-[94%]'>
            <h1 className='text-[40px] font-medium text-black'>Login</h1>
            <form className='flex flex-col w-[100%] mt-[24px]'>
                <label className='text-[16px] text-wengebrown'>Username</label>
                <input className='text-wengebrown border-2 border-wengebrown rounded-md p-[8px] mt-[8px]' type='text' onChange={(e) => {setData({...data, username: e.target.value})}}/>
                <label className='text-[16px] text-wengebrown mt-[16px]'>Password</label>
                <input className='text-wengebrown border-2 border-wengebrown rounded-md p-[8px] mt-[8px]' type='password' onChange={(e) => {setData({...data, password: e.target.value})}}/>
                <button className='text-white bg-darkraspberry rounded-md p-[8px] mt-[16px]' onClick={(e) => {login(e)}}>Login</button>
            </form>
            <p className='mt-[20px] mx-auto border-b-2 border-b-black cursor pointer w-[60px] flex cursor-pointer justify-center' onClick={() => {setPage('signup')}}>Sign Up</p>
        </div>
    </div>
  )
}
