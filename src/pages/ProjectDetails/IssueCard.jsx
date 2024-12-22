import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DotsVerticalIcon, PersonIcon } from "@radix-ui/react-icons"
import UserList from "./UserList"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { deleteIssue } from "@/Redux/Issue/Action"
import { useEffect, useState, useCallback } from "react"
import axios from "axios"


const IssueCard = ({ item, projectId }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem(`jwt`);

    const handleIssueDelete = () => [
        dispatch(deleteIssue({ issueId: item.id }))
    ]

    const [projectTabs, setProjectTabs] = useState([]);
    const [avatar, setAvatar] = useState([]);

    // Sử dụng useCallback để đảm bảo callback không bị tạo lại mỗi lần render
    const fetchProjectTabs = useCallback(async () => {
        try {
            const response = await axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/taskCategories/project/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProjectTabs(response.data);
        } catch (error) {
            console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error);
        }
    }, [projectId, token]);

    const fetchAvater = useCallback(async() => {
        try{
            const response = await axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/file-info/UserAssigner/${item.assignee.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAvatar(response.data)
        } catch(error) {
            console.log("Có lỗi xảy ra trong quá trình thực hiện", error)
        }
    }, [token]);

    // Hàm callback để cập nhật dữ liệu trong state
    const handleUpdate = () => {
        fetchProjectTabs();
        fetchAvater();
    }

    useEffect(() => {
        fetchProjectTabs();
        fetchAvater();
    }, [fetchProjectTabs, fetchAvater]); // Dùng useEffect để gọi các hàm fetch khi token hoặc projectId thay đổi

    return (
        <Card className="rounded-md py-1 pb-2">
            <CardHeader className="py-0 pb-1">
                <div className="flex justify-between items-center">
                    <CardTitle className="cursor-pointer" onClick={() => navigate(`/project/${projectId}/issue/${item.id}`)}>
                        {item.assignee?.fullname || "Chưa phân công"}
                    </CardTitle>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button className="rounded-full" size="icon" variant="ghost">
                                <DotsVerticalIcon />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            {projectTabs.map((tab) => (
                                <DropdownMenuItem key={tab.label} value={tab.label}>{tab.label}</DropdownMenuItem>
                            ))}
                            <DropdownMenuItem onClick={handleIssueDelete}>Xoá nhiệm vụ</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>

            </CardHeader>

            <CardContent className="py-0">
                <div className="flex items-center justify-between">
                    <p>Nhiệm vụ -{1}</p>

                    <DropdownMenu className="w-[30rem] border border-red-400">
                        <DropdownMenuTrigger>
                            <Button size="icon" className="bg-gray-900 hover:text-black text-white rounded-full">
                                <Avatar>
                                    <AvatarImage src={avatar[0]?.fileName} />
                                    <AvatarFallback>
                                        <PersonIcon />
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            {/* Truyền callback handleUpdate vào UserList */}
                            <UserList issueDetails={item} onUpdate={handleUpdate} />
                        </DropdownMenuContent>

                    </DropdownMenu>

                </div>
            </CardContent>
        </Card>
    )
}

export default IssueCard;
