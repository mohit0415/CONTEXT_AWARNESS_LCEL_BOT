import { useEffect, useState } from 'react'
// import MyIcon from './assets/iconLogo.svg?react';
import AppLogo from '../assets/iconLogo.svg?react'
import plusIcon from '../assets/Icon.png'
import { StringData } from '../data/StringData'
import { Dropdown } from 'primereact/dropdown';
import { getWithoutHeaders } from '../utils/networkUtils';
import { fetchSessions, genId } from '../utils/URLConstants';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import LoaderSpecific from './LoaderSpecfic';
        

const NavBar = ({handleCurrentSession}) => {
  const dispatch = useDispatch()
  const sessionTrigger = useSelector(state=>state.isBoolean.isSessionTrigger)
  const screenSplit = useSelector(state=>state.isBoolean.isSplitSscreen)
  const [sessionLoad,setSessionLoad] = useState(false)
  const [dropDownLoad,setDropDownLoad] = useState(false)


  const [selectedSession,setSelectedSession] = useState({
    'session_id':"103f1059-690a-4d38-85c8-aace59262293"
  })
  const [sessions,setSessions] = useState([
    {
      'session_id':"103f1059-690a-4d38-85c8-aace59262293"
    }
  ])
  const [genData,SetGenData] = useState("")

  const handleAdd = (e) =>{
    let res
    e.preventDefault()
    dispatch(({type:'LOADIN'}))

    const requestBody = {
        name : name,
        price : Number(price),
        qty : Number(qty)
    }
    const addData = async() =>{
        try {
            if(name !== '')
            {
            
                res = await postWithoutHeaders(addItems,requestBody)
            }
            // const res = JSON.parse(result)
            if(res?.stausCode == 200){
                setTimeout(()=>{
                    // setMsg(true)
                     dispatch({type:'LOADOUT'})
                setToggleRefresh(!toggleRefresh)
               
                dispatch({type:'ONOPEN'})
                dispatch({type:'MSGIS',payload:'Recorded Inserted...'})


                },3000)
                setPrice('')
                setQty('')
                setName('')

                
            }
            else{
                setMsg(false)
                dispatch({type:'LOADOUT'})
                dispatch({type:'ONOPEN'})
                dispatch({type:'MSGIS',payload:'Recorded Not Inserted..,Sorry'})
            }
        } catch (error) {
            console.log('Data not Added',err)
            dispatch({type:'LOADOUT'})
            
        }
    }
    addData()
}
// useEffect(()=>{
//   if (selectedSession !== null){
//     handleCurrentSession(selectedSession)
//   }
// },[selectedSession])
  useEffect(()=>{
    const fetchSession = async() => {
      setDropDownLoad(true)
      try {
        const res = await getWithoutHeaders(fetchSessions)
        if (res?.ok){
          setDropDownLoad(false)
          setSessions(res?.data?.detail)
        }
        else{
          console.log('Escape')
          setDropDownLoad(false)
          dispatch({type:'MSGIS',payload:'Session IDs not Synced Properly..'})
        }

      } catch (error) {
        console.log('the error is',error)
        dispatch({type:'MSGIS',payload:'Session IDs not Synced Properly..'})

      }

    }
    fetchSession() 

  },[genData,sessionTrigger])
  
  const gen_id = async() => {
    // dispatch({type:"LOADIN"})
    setSessionLoad(true)
    try{
      const res = await getWithoutHeaders(genId)
      if (res.ok){
        // dispatch({type:'LOADOUT'})
        setSessionLoad(false)
        SetGenData(res.data.session_id)
        dispatch({type:'ONOPEN'})
        dispatch({type:"MSGIS",payload:`GENERATED SESSION ID IS: ${res.data.session_id}`})
      }
      else{
        setSessionLoad(false)
        dispatch({type:"MSGIS",payload:`NEW SESSION ID NOT ABLE TO CREATE..`})
      }    

    }
    catch(error){
      setSessionLoad(false)
      console.log("The Generate Id Error:",error)
    }
  }
  const handleChange = (e) => {
    setSelectedSession(e.value)
    handleCurrentSession(e.value.session_id)
    dispatch({type:'UPDATE',payload : e.value.session_id})
  }


  const handleDashBoard = () =>{
    dispatch({type:'OPENDASH'})
  }

  return (
    <div className='bg-[#020617] border-b border-[#334155] py-4 px-5'>
         <div className='flex justify-between items-center'>
            <div className='flex justify-start gap-6'>
              <div className='flex items-center gap-4 border-r-2 pr-5 border-[#1E293B]'>
                 <AppLogo width={40} height={40} className='hidden md:inline'/>
                 <div className='inline md:hidden'><Button icon="pi pi-th-large" style={{ backgroundColor: '#6366F1',width:'40px',height:'40px',borderColor:'black'}} pt={{icon: { style: { color: 'black',textShadow: '0 0 1.0px black'} } }} onClick={handleDashBoard}/></div>
                 <p className='text-white font-bold text-xsm md:text-md md:inline hidden'>{StringData.app_name}</p>
              </div>
              <div className='flex flex-row  items-center'>
                <Dropdown  loading={dropDownLoad} value={selectedSession} onChange={handleChange} options={sessions} optionLabel="session_id" placeholder='Select a Session ID'
                className='bg-[#0F172A] text-white w-[200px] md:w-[300px] lg:w-[400px] max-w-full' />
              </div>
              <button className='hover:opacity-60 cursor-pointer md:inline hidden' onClick={gen_id}>
                <div className='relative flex justify-center gap-2 items-center py-2 px-6 bg-[#4F46E5] rounded-lg'>
                  <img src={plusIcon} className='w-3 h-3'/>
                  {!sessionLoad?<p className='text-white text-md lg:text-lg font-semibold'>{StringData.new}</p>:<LoaderSpecific size={7}/>}
                </div>
              </button>
        
            </div>

        </div>
    </div>
  )
}

export default NavBar


        