import { fetchChatByProject, fetchChatMessages, sendMessage } from '@/Redux/Chat/Action'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const { auth, chat } = useSelector(store => store)
  const { id } = useParams();
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchChatByProject(id))
  }, [id])

  useEffect(() => {
    dispatch(fetchChatMessages(id))
  }, [])

  const handleSendMessage = () => {
    dispatch(sendMessage({
      senderId: auth.user?.id,
      projectId: id,
      content: message,
    }));
    setMessage("");
    console.log("message", message);
  }
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  }



  return (
    // <div className='sticky'>
    //   <div className='border rounded-lg'>

    //     <h1 className='border-b p-5'>Thảo luận</h1>

    //     <ScrollArea className="h-[32rem] w-full p-5 flex gap-3 flex-col">
    //       {chat.messages?.map((item, index) => (
    //         item.sender.id == auth.user.id ? <div key={item} className='flex gap-2 mb-2 justify-start'>
    //           <Avatar>
    //             <AvatarFallback>
    //               {item.sender.fullname.slice(-3)[0]}
    //             </AvatarFallback>

    //           </Avatar>
    //           <div className='space-y-2 py-2 px-5 border rounded-ss-2xl rounded-e-xl'>
    //             <p>{item.sender.fullname}</p>
    //             <p className='text-gray-300'>{item.content}</p>
    //           </div>
    //         </div> :
    //           <div key={item} className='flex gap-2 mb-2 justify-end'>

    //             <div className='space-y-2 py-2 px-5 border rounded-se-2xl rounded-s-xl'>
    //               <p>{item.sender.fullname}</p>
    //               <p className='text-gray-300'>{item.content}</p>
    //             </div>
    //             <Avatar>
    //               <AvatarFallback>
    //                 {item.sender.fullname.slice(-3)[0]}
    //               </AvatarFallback>

    //             </Avatar>
    //           </div>))}

    //     </ScrollArea>
    //     <div className='relative p-0'>
    //       <Input value={message} placeHolder="Nhập thông tin thảo luận ..." className="py-7 border-t outline-none focus:outline-none focus:ring-0 rounded-none border-b-0 border-x-0" onChange={handleMessageChange} />
    //       <Button onClick={handleSendMessage} className="absolute right-2 top-3 rounded-full" size="icon" variant="ghost">
    //         <PaperPlaneIcon />

    //       </Button>

    //     </div>

    //   </div>

    // </div>

    <div className="sticky max-w-md mx-auto h-[600px] flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
        <h1 className="text-xl font-bold text-white">Thảo luận</h1>
      </div>

      <ScrollArea className="flex-grow p-4 space-y-4">
        {chat.messages?.map((item) => (
          <div
            key={item.id}
            className={`flex gap-3 ${item.sender.id === auth.user.id ? 'justify-end' : 'justify-start'}`}
          >
            {item.sender.id !== auth.user.id && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {item.sender.fullname[0]}
                </AvatarFallback>
              </Avatar>
            )}
            <div style={{marginTop: '5px'}}
              className={`max-w-[70%] py-2 px-4 rounded-2xl ${
                item.sender.id === auth.user.id
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm font-medium mb-1">{item.sender.fullname}</p>
              <p className="text-sm">{item.content}</p>
            </div>
            {item.sender.id === auth.user.id && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-500 text-white">
                  {item.sender.fullname[0]}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </ScrollArea>

      <div className="border-t p-4">
        <div className="relative">
          <Input
            value={message}
            onChange={handleMessageChange}
            placeholder="Nhập thông tin thảo luận ..."
            className="pr-12 py-6 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSendMessage}
            className="absolute right-1 top-1 rounded-full h-10 w-10 p-2 bg-blue-500 hover:bg-blue-600 transition-colors"
            size="icon"
          >
            <Send className="h-5 w-5 text-white" />
            <span className="sr-only">Gửi tin nhắn</span>
          </Button>
        </div>
      </div>

    </div>
  )
}

export default ChatBox