import { deleteComment } from "@/Redux/Comment/Action"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "@radix-ui/react-icons"
import axios from "axios"
import { format } from "date-fns"
import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"


const CommentCard = ({item}) => {
    const token = localStorage.getItem(`jwt`);
    const [avatar, setAvatar] = useState([]);
    const fetchAvater = useCallback(async() => {
        try{
            const response = await axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/file-info/UserAssigner/${item.user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("TaiNe", response.data)
            setAvatar(response.data)
        } catch(error) {
            console.log("Có lỗi xảy ra trong quá trình thực hiện", error)
        }
    }, [item.id]);

    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteComment(item.id))
    }
    useEffect(() => {
        fetchAvater();
    }, [fetchAvater]);
    return (
        <div className="flex justify-between">
            <div className="flex items-center gap-4">
                <Avatar>
                <AvatarImage src={avatar[0]?.fileName} />
                    <AvatarFallback>{item.user.fullname.slice(-3)[0]}</AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                    <p className="text-indigo-800 font-medium">{item.user.fullname}</p>
                    <p className="text-gray-600">{item.content}</p>
                    <p className="text-xs text-indigo-400 mt-1">{format(new Date(item.creationDateTime), 'dd/MM/yyyy HH:mm')}</p>
                </div>

            </div>
            <Button onClick={handleDelete} className="rounded-full" variant="ghost" size="icon">
                <TrashIcon color="red" />
            </Button>

        </div>
    )
}

export default CommentCard