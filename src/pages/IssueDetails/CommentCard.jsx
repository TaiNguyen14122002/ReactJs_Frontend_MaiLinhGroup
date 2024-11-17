import { deleteComment } from "@/Redux/Comment/Action"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useDispatch } from "react-redux"


const CommentCard = ({item}) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteComment(item.id))
    }
    return (
        <div className="flex justify-between">
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarFallback>{item.user.fullname.slice(-3)[0]}</AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                    <p className="text-indigo-800 font-medium">{item.user.fullname}</p>
                    <p className="text-gray-600">{item.content}</p>
                    <p className="text-xs text-indigo-400 mt-1">{format(new Date(item.creationDateTime), 'dd/MM/yyyy HH:mm')}</p>
                </div>

            </div>
            <Button onClick={handleDelete} className="rounded-full" variant="ghost" size="icon">
                <TrashIcon />
            </Button>

        </div>
    )
}

export default CommentCard