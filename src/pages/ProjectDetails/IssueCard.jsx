import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DotsVerticalIcon, PersonIcon } from "@radix-ui/react-icons"
import UserList from "./UserList"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { deleteIssue } from "@/Redux/Issue/Action"
import { useEffect, useState } from "react"
import axios from "axios"


const IssueCard = ({ item, projectId }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem(`jwt`);

    const handleIssueDelete = () => [
        dispatch(deleteIssue({ issueId: item.id }))
    ]

    const [projectTabs, setProjectTabs] = useState([]);

    const fetchProjectTabs = async () => {
        try {
            const response = await axios.get(`http://localhost:1000/api/taskCategories/project/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Tabdfsfwedscfsfwes Project", response.data)
            setProjectTabs(response.data);

        } catch (error) {
            console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error);
        }
    }
    useEffect(() => {
        fetchProjectTabs();
    }, [token])


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
                                    <AvatarFallback>
                                        <PersonIcon />
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <UserList issueDetails={item} />
                        </DropdownMenuContent>

                    </DropdownMenu>

                </div>
            </CardContent>



        </Card>
    )
}

export default IssueCard