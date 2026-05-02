import React, { useEffect, useState } from "react";
import JsonLogo from "../assets/chat_history.svg?react";
import Refresh from "../assets/refresh.svg?react";
import Download from "../assets/download.svg?react";
import { dataFetch } from "../data/sampleData";
import { StringData } from "../data/StringData";
import PrettyJson from "./PrettyJson";
import { postWithoutHeaders } from "../utils/networkUtils";
import { download, historyChat } from "../utils/URLConstants";
import { useSelector } from "react-redux";
import LoaderSpecific from "./LoaderSpecfic";
const ChatHistory = ({currentSessionId,status}) => {
  const [history,setHistory] = useState([])
  const [isHistoryLoad,setHistoryLoad] = useState(false)
  const isStatus = useSelector(state=>state.isBoolean.isCheck)
  const [refreshLoad,setRefreshLoad] = useState(false)
  const [refreshToggle,setRefreshToggle] = useState(false)

  useEffect(()=>{
  console.log("LOCK FOR CALL CHAT HISTORY",isStatus)

  },[])


  useEffect(()=>{
    const db_call = async() => {
      setHistoryLoad(true)
      setRefreshLoad(true)
      const reqBody = {
        session_id : currentSessionId
      }
      console.log("REQ BODY:", reqBody); // debug
      try {
        const res = await postWithoutHeaders(historyChat,reqBody)
        if(res.ok){
          setHistoryLoad(false)
          setHistory(res.data.chat_history)
          setRefreshLoad(false)
          console.log("LOCK FOR CALL CHAT HISTORY AFTER:",isStatus)

        }
        else{
          console.log("Error occured in Post Call History")
          setHistoryLoad(false)         
          setHistory([
            {
              'role':'user',
              'content':'CHAT HISTORY FAILED TO LOAD FROM DB...'
            }
          ])
          setRefreshLoad(false)

        }
        
      } catch (error) {
          setHistoryLoad(false)
          setRefreshLoad(false)
        console.log("Error Occured in ChatHistory:",error)
          setHistory([
            {
              'role':'user',
              'content':`ERROR IS: ${error}`
            }
          ])
        }
      }
    db_call()
  },[currentSessionId,isStatus,refreshToggle])

  const downloadFile = async () => {
  const res = await fetch(download, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: currentSessionId,
    }),
  });
  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "chat_history.json"; // filename shown in Downloads
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
};

const handleRefresh = () => {
  setRefreshToggle(!refreshToggle)
}


  return (
    <div className="h-full relative">
      <div className="flex flex-col h-full">
        <div className="flex justify-between px-5 py-4 bg-[#060E20] border-b border-[#1E293B]">
          <div className="flex gap-3 items-center">
            <JsonLogo width={22} height={22} />
            <p className="text-white text-sm font-extralight">
              {StringData.history}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button className="cursor-pointer disabled:cursor-not-allowed hover:border hover:p-1 hover:border-[#2D3449] rounded-md" disabled={refreshLoad} onClick={handleRefresh}>
              <Refresh width={13} height={13} />
            </button>
            <button className="cursor-pointer disabled:cursor-not-allowed hover:border hover:p-1 hover:border-[#2D3449] rounded-md" onClick={downloadFile} disabled={refreshLoad}>
              <Download width={13} height={13} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-[#020617]">
          <PrettyJson data={history}/>
        </div>
      </div>
      {isHistoryLoad && <LoaderSpecific size={10}/>}
    </div>
  );
};

export default ChatHistory;
