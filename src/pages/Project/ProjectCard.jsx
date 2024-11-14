import { deleteProject, fetchProjectById } from '@/Redux/Project/Action'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { DotFilledIcon, DotsVerticalIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { MoreVertical } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProjectCard = ({ item }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('jwt');
    const handleDelete = () => {
        dispatch(deleteProject({ projectId: item.id }));
    };


    const UpdateProjectPinned = async () => {
        try {

            if (!token) {
                console.error("Token không tồn tại");
                return;
            }

            const response = await axios.put(
                `http://localhost:1000/api/projects/${item.id}/update-action`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);
        } catch (error) {
            console.log("Có lỗi xảy ra khi Ghim dự án", error);
        }
    }

    const UpdateProjectAction = async () => {
        try {
            const response = await axios.put(
                `http://localhost:1000/api/projects/${item.id}/update-action-deleted`,
                { action: -1 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        action: -1
                    }
                }
            );
            console.log("Dữ liệu nhận được từ API:", response);
            console.log("Dữ liệu sau khi được cập nhật", response.data);
        } catch (error) {
            console.log("Có lỗi xảy ra trong quá trình thực hiện dữ liệu", error);
        }
    }

    return (
        <Card className={cn(
            "flex flex-col relative",
            item.category === "Front End" && "bg-yellow-50",
            item.category === "backend" && "bg-blue-50",
            item.category === "Full Stack" && "bg-gradient-to-br from-blue-50 to-yellow-50"
        )} key={item.id}>
            <CardContent className="flex flex-col gap-4 p-6">
                <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                        <h2 onClick={() => navigate("/project/" + item.id)} className="cursor-pointer text-xl font-semibold">{item.name}</h2>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => UpdateProjectPinned()}>Ghim</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => UpdateProjectAction()}>Xoá kế hoạch</DropdownMenuItem>
                                <DropdownMenuItem >Xuất thống kê</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <span className={cn(
                        "inline-block text-sm px-2.5 py-0.5 rounded-full",
                        item.category === "Front End" && "bg-yellow-100 text-yellow-800 border border-yellow-200",
                        item.category === "backend" && "bg-blue-100 text-blue-800 border border-blue-200",
                        item.category === "Full Stack" && "bg-gradient-to-r from-blue-100 to-yellow-100 text-blue-800 border border-blue-200"
                    )}>
                        {item.category}
                    </span>
                </div>
                <p className="text-muted-foreground flex-grow">
                    {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </CardContent>
        </Card>

    )
}

export default ProjectCard