import React from 'react'
// import StringData from '../json/StringData'
import   { StringData } from '../data/StringData'
import cancelButton from '../assets/closeIcon.png'
import { useDispatch } from 'react-redux'
import Notify from "../assets/notifyIcon.svg?react";


const Modal = ({isOpen,message}) => {
    const dispatch = useDispatch()
    const handleClose = () => {
        dispatch({type:'ONCLOSE'})
    }
  return (
    <div className={`${isOpen?'':'hidden'}`}>
      <div className='loader-overlay'>
        <div className=' relative flex gap-1 lg:gap-5 bg-[#222A3D] flex-col py-3 px-4 aspect-video items-center justify-center w-[90%] max-w-[300px] md:max-w-[380px] rounded-2xl'>
             <img src={cancelButton} className='w-3 absolute top-4 right-4 cursor-pointer' onClick={handleClose}/>
            <div className='flex  border-b-2 border-[#464554] pb-3 min-w-full justify-center'>
                <div className='flex gap-3 items-center'>
                <Notify width={15} height={18}/>
                <p className='text-[#DAE2FD] italic text-sm md:text-md font-bold '>{StringData.notify}</p>
                </div>

            </div>
            <p className='text-xs md:text-[15px] text-center mx-auto text-[#C7C4D7] py-4'>{message}</p>
        </div>

      </div>
    </div>
  )
}

export default Modal
