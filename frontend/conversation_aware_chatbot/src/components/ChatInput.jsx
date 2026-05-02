import { useState, useRef, useEffect } from "react";
import Send from '../assets/send.svg?react'
import RateErr from "../assets/rateErr.svg?react";
import { StringData } from "../data/StringData";
import { postWithoutHeaders } from "../utils/networkUtils";
import { chat } from "../utils/URLConstants";
import { useDispatch, useSelector } from "react-redux";
const ChatInput = ({ onSend,currentSessionId }) => {
const isHitNum = import.meta.env.VITE_RATE_HIT_COUNTER_HOUR
const KEY = "rate_err";
const INITIAL_VALUE = "fresh_start_rate_limit";
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
//   const [cooldown, setCooldown] = useState(0);
  const [storedValue, setStoredValue] = useState(() => {
    // Check if the laptop already has a value
    const saved = localStorage.getItem(KEY);
    return saved ? saved : INITIAL_VALUE;
});
const isHits = useSelector((state)=>state.isBoolean.isHits)
const isStatus = useSelector(state=>state.isBoolean.isCheck)


useEffect(()=>{
    // dispatch({type:"ISHIT",payload: 8})

    console.log("HITTSSS",isHits)
    if( isHits < 0){
        dispatch({type:'ISHIT',payload:0})     
    }
},[isHits])


useEffect(() => {
  localStorage.setItem(KEY, storedValue);
  console.log(localStorage.getItem(KEY),"KEYYY")
}, [storedValue]);

//-------------------------

const COOLDOWN_KEY = "cooldown_expiry";

// ... inside component ...

const [cooldown, setCooldown] = useState(() => {
    const expiry = localStorage.getItem(COOLDOWN_KEY);
    if (!expiry) return 0;

    const remaining = Math.ceil((Number(expiry) - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
});

// Update the timer every second
useEffect(() => {
    localStorage.removeItem(COOLDOWN_KEY); 
    // add above statement if u want to stop the timer abruptly
    if (cooldown <= 0) {
        localStorage.removeItem(COOLDOWN_KEY); // Clean up
        setStoredValue(INITIAL_VALUE)
        return;
    }

    const timer = setInterval(() => {
        setCooldown((prev) => {
            const newVal = prev - 1;
            if (newVal <= 0) clearInterval(timer);
            return newVal > 0 ? newVal : 0;
        });
    }, 1000);

    return () => clearInterval(timer);
}, [cooldown]);


//-------------------

  const dispatch = useDispatch()

  const handleChange = (e) => {
    setMessage(e.target.value);

    // Auto resize
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const addChat = async() =>{
        dispatch({type:'LOADIN'})

        const reqBody = {
            query : message,
            session_id : currentSessionId
        }
        console.log(reqBody,"REQ BODY FOR CHAT BOT")
        try {
            const res = await postWithoutHeaders(chat,reqBody)
            dispatch({type:"ISHIT",payload:isHits-1})
            if (res?.ok){
                const currentQues = res?.data?.user_input
                const content = res?.data?.agent_response
                onSend(
                    {
                        user_action : currentQues,
                        agent_res : content
                    }
                )
                dispatch({type:'LOADOUT'})

            }
            else if(res?.status === 429){
            dispatch({type:"ISHIT",payload:isHitNum})
            dispatch({type:'LOADOUT'})
            setStoredValue("error_msg");
            // setCooldown(60)
            const duration =  60  * 1000; // 1 Hour in ms
        const expiryTime = Date.now() + duration;
        
        localStorage.setItem(COOLDOWN_KEY, expiryTime.toString());
        setCooldown(duration / 1000);
           }
            else{
            console.log("Escape Msg Chat")
            setTimeout(()=>{
                dispatch({type:'LOADOUT'})
                dispatch({type:'ONOPEN'})
                dispatch({type:"MSGIS",payload:`MODEL EXPERIENCING HIGH DEMANDS`})
            },9000)
        }
            
        } catch (error) {
            console.log("Error Ocuured Message Chat:",error)
        dispatch({type:'ONOPEN'})
        dispatch({type:"MSGIS",payload:`ERROR OCCURED: ${error}`})
        }
    }
    addChat()
    setMessage("");
    textareaRef.current.style.height = "auto";
  };

  useEffect(()=>{
    console.log(currentSessionId,"CURRENT SESSION ID")
  },[])

//   useEffect(() => {
//   if (cooldown > 0) {
//     const timer = setTimeout(() => {
//       setCooldown(prev => prev - 1);
//     }, 1000);

//     return () => clearTimeout(timer);
//   } else {
//     setStoredValue(INITIAL_VALUE); // ✅ RE-ENABLE INPUT
//   }
// }, [cooldown]);

  return (
    <div className="w-full flex flex-col gap-3">
        <div className={`${storedValue !== 'error_msg'?'hidden':''}  max-w-[90%] mx-auto w-full flex items-center gap-2 bg-[#93000A]/40  rounded-lg py-2 px-2 border border-[#93000A]`}>
                <RateErr className="w-6 h-6 sm:w-4 sm:h-4 md:w-6 md:h-6 shrink-0" />
            <p className="text-[#FFB4AB] text-sm sm:text-md">{StringData.rateMsg}<span className="text-[#FCD34D] font-bold">{cooldown}</span>s.</p>
        </div>
    <div className="relative w-full max-w-[90%] mx-auto">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask something..."
        rows={1}
        className="w-full resize-none rounded-xl bg-[#0F172A] text-white p-6 pr-20 outline-none"
      />

      {/* Ask Button */}
      <div className="absolute right-3 bottom-4 flex flex-row sm:gap-5 gap-2 items-end">
        <div>
            <p className="text-[10px] text-[#64748B] opacity-45"><span className="text-[12px]">{isHits ?? isHitNum}</span>{StringData.msgRemain}</p>
        </div>
        <button
        onClick={sendMessage}
        disabled={storedValue === "error_msg"}
        className={`disabled:cursor-not-allowed cursor-pointer  disabled:bg-red-300 bg-indigo-500 text-white px-3 py-2 rounded-lg hover:opacity-80`}
      >
        <div className="flex gap-2 items-center">
        <p className="text-sm">{StringData.ask}</p>
        <Send width={13} height={13}/>
        </div>
      </button>
      </div>
      
    </div>
    </div>
  );
};

export default ChatInput;