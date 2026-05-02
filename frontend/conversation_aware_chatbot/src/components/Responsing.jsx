import BotIcon from '../assets/botIcon.svg?react'
import DevIcon from '../assets/devIcon.svg?react'
import { StringData } from '../data/StringData'

const Responsing = ({role,content}) => {
  return (
    <div>
      <div style={{whiteSpace : 'pre-line'}} className="flex flex-col gap-2 w-full max-w-5xl">
        <div className={`flex ${role === 'user'?'justify-end':'justify-start'}`}>
          <div className="flex gap-3">
            <div className='flex items-center'>
              {role === 'user'?<DevIcon width={15} height={15}/>:<BotIcon width={15} height={15}/>}
            </div>
            <p className='text-[12px] text-[#818CF8]'>{role == 'user'?StringData.dev:StringData.assist}</p>
          </div>       
        </div>
        <div className={`border-[#2D3449] border rounded-b-lg p-3 ${role === 'user'?'rounded-tl-lg':'rounded-tr-lg bg-[#131B2E]'}`}>
          <p className={`text-white text-md ${role === 'user'?'text-right':''}`}>{content}</p>
        </div>
    </div>
    </div>
  )
}

export default Responsing
