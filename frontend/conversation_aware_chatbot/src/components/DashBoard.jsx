import { useEffect, useState } from 'react'
import ChatBot from './ChatBot'
import ChatHistory from './ChatHistory'
import NavBar from './NavBar'
import { useSelector } from 'react-redux'

const DashBoard = () => {
  const [sessionId,setSessionId] = useState("")
  const [status,setStatus] = useState(false)

  const current_session_id = useSelector((state)=>state.isSession.isSession)
  const screenSplit = useSelector((state)=>state.isBoolean.isSplitSscreen)

  useEffect(()=>{
    console.log('SCreen:',screenSplit)

  },[screenSplit])

  const handleSession = (value) =>{
  console.log('SESSION ID FETCHED:',value?.sessionId)
    setSessionId(value?.sessionId)
 
  }
  const checking = (value) =>{
    setStatus(value)
  }

  return (
    <div className='flex flex-col gap-0 h-[100dvh] w-full overflow-hidden'>
      <div className='w-full'>
        <NavBar handleCurrentSession={handleSession}/>        
      </div>
      <div className=' min-h-0 flex flex-1 w-full overflow-hidden'>
      <div className={`md:w-1/2 md:inline  min-w-0 min-h-0 h-full  ${screenSplit?'w-full':'hidden'}`}>
        <ChatBot currentSessionId={current_session_id} checkBool={checking}/>
      </div>
      <div className={`md:w-1/2 md:inline min-w-0 min-h-0 h-full  ${screenSplit?'hidden':'w-full'}`}>
        <ChatHistory currentSessionId={current_session_id} status={status}/>
      </div>
      </div>
    </div>
  )
}

export default DashBoard
