import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'
import {BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import DashBoard from '../src/components/DashBoard'
import Loader from './components/Loader'
import Modal from './components/Modal'
import { Sidebar } from 'primereact/sidebar'
import SideBarItems from './components/SideBarItems'

function App() {
  const [count, setCount] = useState(0)
  const isLoading = useSelector((state)=>state.isLoad.isLoading)
  const dispatch =useDispatch()
  const isModal = useSelector((state)=>state.isModal.isModal)
  const isMsg = useSelector((state)=>state.isModal.isMsg)
  const isDash = useSelector((state)=>state.isBoolean.isDashBoardToggle)

  useEffect(()=>{
    console.log("DASHBOARD:",isDash)

  },[isDash])


  const handleClose = () => {
    dispatch({type:'CLOSEDASH'})
  }

useEffect(()=>{
  console.log('Is LOadinghhhhhhhh',isLoading)
},[isLoading])

  // useEffect(()=>{
  //   dispatch({type:'LOADOUT'})
  // })

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<DashBoard/>}/>
      </Routes>
    </Router>
    {isLoading && <Loader/>}
    <Modal
    isOpen={isModal}
    message={isMsg}
    />
    <Sidebar visible={isDash}
    onHide={handleClose}
    >
      <div className='w-full h-hull'>
        <SideBarItems/>
      </div>
    </Sidebar>
    </>
  )
}

export default App
