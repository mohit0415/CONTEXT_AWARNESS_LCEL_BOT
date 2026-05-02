import React, { useEffect, useRef, useState } from "react";
import Responsing from "./Responsing";
import ChatInput from "./ChatInput";
import { useDispatch } from "react-redux";

const ChatBot = ({currentSessionId,checkBool}) => {
  const dispatch = useDispatch()
  const bottomRef = useRef(null);
  const [check,setCheck] = useState(false)
  const [sessionMessages, setSessionMessages] = useState({});
  const[messages,setMessages]=useState([
  // { role: 'user', content: "Hi" },
  { role: 'ai', content: "👋 Hi! I'm your Smart Assistant\nI can help you with:\n✅ Tech troubleshooting - Fix issues with your devices and software\n✅ Personal questions - Chat naturally and I'll remember our conversation\n✅ Location Finding.. - Find where you are exactly in this world\nJust ask me anything - I'll figure out how to help you best!" },

  // { role: 'user', content: "I'm good, what about you?" },
  // { role: 'ai', content: "I'm doing great! How can I help you today?" },

])

useEffect(() => {
  if (!sessionMessages[currentSessionId]) {
    setSessionMessages(prev => ({
      ...prev,
      [currentSessionId]: [
        {
          role: "ai",
          content: "👋 Hi! I'm your Smart Assistant\nI can help you with:\n✅ Tech troubleshooting - Fix issues with your devices and software\n✅ Personal questions - Chat naturally and I'll remember our conversation\n✅ Location Finding.. - Find where you are exactly in this world\nJust ask me anything - I'll figure out how to help you best!",
        },
      ],
    }));
  }
}, [currentSessionId]);


const messagesSession = sessionMessages[currentSessionId] || [];


useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messagesSession]);

  const onSend = (value) =>{
  //   setMessages(prev=>[...prev,{
  //     'role':'user',
  //     'content':value?.user_action
  //   },
  // {
  //   'role':'ai',
  //   'content':value?.agent_res
  // }])
    setSessionMessages(prev => ({
    ...prev,
    [currentSessionId]: [
      ...(prev[currentSessionId] || []),
      { role: "user", content: value?.user_action },
      { role: "ai", content: value?.agent_res },
    ],
  }));
  dispatch({type:"TOGGLES"})
  checkBool(!check)

  }
  return (
    <div className="w-full h-full">
      <div className="bg-[#0B1326] h-full border-r border-[#334155] w-full flex flex-col">
        <div className="overflow-y-auto flex-1 p-4 pb-1 pt-5">
          {messagesSession.map((item, index) => (
            <div
              className={`flex my-6 ${item.role == "user" ? "justify-end pr-3" : "justify-start pl-3"}`}
              key={index}
            >
              <Responsing role={item?.role} content={item?.content} />
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="sticky bottom-0 w-full bg-[#131B2E] py-4">
          <ChatInput onSend={onSend} currentSessionId={currentSessionId}/>
        </div>
      </div>
    </div>
  );
};  

export default ChatBot;
