import React, { useState } from "react";
import AppLogo from "../assets/iconLogo.svg?react";
import { StringData } from "../data/StringData";
import plusIcon from '../assets/Icon.png'
import { genId } from "../utils/URLConstants";
import JsonLogo from "../assets/chat_history.svg?react";
import BotLogo from '../assets/botIcon.svg?react'
import { useDispatch } from "react-redux";
import { getWithoutHeaders } from "../utils/networkUtils";
import LoaderSpecific from "./LoaderSpecfic";

const SideBarItems = () => {
    const [isSessionLoads,setSessionLoads] = useState(false)

const dispatch = useDispatch()

  const gen_id = async() => {
    setSessionLoads(true)
    // dispatch({type:'CLOSEDASH'})
    // dispatch({type:"LOADIN"})
    try{
      const res = await getWithoutHeaders(genId)
      if (res.ok){
        setSessionLoads(false)
        dispatch({type:'CLOSEDASH'})
        // dispatch({type:'LOADOUT'})
        dispatch({type:"TRIGGER"})
        // SetGenData(res.data.session_id)
        dispatch({type:'ONOPEN'})
        dispatch({type:"MSGIS",payload:`GENERATED SESSION ID IS: ${res.data.session_id}`})
      }
      else{
        setSessionLoads(false)
        dispatch({type:'CLOSEDASH'})
        dispatch({type:'ONOPEN'})
        dispatch({type:"MSGIS",payload:`SESSION ID NOT GENERATED`})
      }    

    }
    catch(error){
        setSessionLoads(false)
      console.log("The Generate Id Error:",error)
    }
  }
  const handleChat = () => {
    dispatch({type:'CHAT'})
    dispatch({type:'CLOSEDASH'})

  }
  const handleHistory = () => {
     dispatch({type:'HISTORY'})
     dispatch({type:'CLOSEDASH'})


  }
  return (
    <div className="w-full flex flex-col gap-23">
      <div className="relative top-4 left-3 flex gap-6 items-center">
        <AppLogo width={40} height={40} />
        <p className="text-2xl font-light text-[#6366F1]">
          {StringData.dash_app_name}
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <button
          className="hover:opacity-60 cursor-pointer"
          onClick={gen_id}
        >
          <div className=" relative  py-5 px-6 bg-[#4F46E5] rounded-lg">
            {isSessionLoads?<LoaderSpecific size={5} classNameProp={'rounded-lg'}/>:
            <div className="flex justify-center gap-2 items-center">
            <img src={plusIcon} className="w-3 h-3" />
            <p className="text-white text-md lg:text-lg font-semibold">
              {StringData.generate}
            </p>
            </div>
            }
          </div>
        </button>
        <button className="hover:border hover:opacity-50 border-[#2D3449] rounded-xl cursor-pointer"
        onClick={handleHistory}>
        <div className="flex justify-center gap-5 px-6 py-2">
            <JsonLogo width={20} height={20}/>
            <p className="text-md text-[#89CEFF] font-serif font-light">{StringData.history}</p>
        </div>
        </button>
        <button className="hover:border hover:opacity-50 border-[#2D3449] rounded-xl cursor-pointer"
        onClick={handleChat}>
        <div className="flex justify-center gap-5 px-6 py-2">
            <BotLogo width={20} height={20}/>
            <p className="text-md text-[#89CEFF] font-serif font-light">{StringData.chat_play}</p>
        </div>
        </button>
      </div>
    </div>
  );
};

export default SideBarItems;
