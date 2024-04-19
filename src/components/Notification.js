import React from 'react'

export const Notification = ({checkmark, text}) => {
  return (
    <div className='SignUpNotification absolute top-10 right-10 w-[200px] h-[150px] shadow-xl border-solid border-2 border-gray-400 rounded-md bg-white'>
      <p className='mt-5 font-bold text-center'>{text}</p>
      {checkmark ? <div className="w-10 h-10 m-auto tex6-center mt-7 checkmark"></div> : 
        <div className="w-10 h-10 m-auto tex6-center mt-7 noncheckmark"></div>}
    </div>  
  )
}
