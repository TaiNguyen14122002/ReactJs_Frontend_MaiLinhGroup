import { fetchChatByProject, fetchChatMessages, sendMessage } from '@/Redux/Chat/Action'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { MoreVertical, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const { auth, chat } = useSelector(store => store)
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem('jwt')


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

  const [avaterUser, setAvaterUser] = useState([])

  const fetchFileUser = async () => {
    try {
      if (!token) {
        console.log("Phiên đăng nhập đã hết hạn")
      }
      const response = await axios.get(`http://localhost:1000/api/file-info/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Avater", response.data)
      setAvaterUser(response.data)

    } catch (error) {
      console.log("Có lỗi xẩy ra trong quá trình thực hiện dữ liệu", error)
    }
  }

  useEffect(() => {
    fetchFileUser();
  }, [token])



  return (
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
                <AvatarImage src={avaterUser[0]?.fileName} alt="Avatar" />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {item.sender.fullname[0]}
                </AvatarFallback>
              </Avatar>
            )}
            <div style={{ marginTop: '5px' }}
              className={`max-w-[70%] py-2 px-4 rounded-2xl ${item.sender.id === auth.user.id
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
            >
              <p className="text-sm font-medium mb-1">{item.sender.fullname}</p>
              <p className="text-sm">{item.content} </p>
              <span className="text-xs text-gray-500 mt-1">
                {/* {format(new Date(item.createdAt), 'HH:mm')} */}
                Đã gửi lúc 23:30
              </span>
            </div>
            
            {item.sender.id === auth.user.id && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-500 text-white">
                  <AvatarImage src={avaterUser[0]?.fileName} alt="Avatar" />
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