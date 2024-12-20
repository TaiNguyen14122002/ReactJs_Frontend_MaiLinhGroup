import { deleteProject, fetchProjectById } from '@/Redux/Project/Action'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { DotFilledIcon, DotsVerticalIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { MoreVertical } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProjectCard = ({ item }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('jwt');

    const [isPinned, setIsPinned] = useState(item.action === 0);
    const [project, setProject] = useState(item); // Lưu trữ dữ liệu dự án trong state

    const handleDelete = () => {
        dispatch(deleteProject({ projectId: item.id }));
    };

    // Hàm để cập nhật trạng thái ghim của dự án
    const UpdateProjectPinned = async () => {
        try {
            if (!token) {
                console.error("Token không tồn tại");
                return;
            }

            const newAction = isPinned ? 1 : 0;

            // Gửi yêu cầu PUT để cập nhật trạng thái ghim
            const response = await axios.put(
                `https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/${item.id}/update-action-deleted`,
                { action: newAction },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        action: newAction
                    }
                }
            );

            // Chuyển đổi trạng thái ghim trong state
            setIsPinned(!isPinned);

            // Cập nhật lại thông tin dự án trong state mà không cần gọi lại API
            setProject((prevState) => ({
                ...prevState,
                action: newAction
            }));

            console.log(response.data);
        } catch (error) {
            console.log("Có lỗi xảy ra khi Ghim dự án", error);
        }
    }

    // Hàm để xóa dự án
    const UpdateProjectAction = async () => {
        try {
            const response = await axios.put(
                `https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/${item.id}/update-action-deleted`,
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

    const truncateText = (text, maxLength) => {
        if (!text) return ''; // Kiểm tra nếu text là null hoặc undefined
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };
    return (
        <Card className={cn(
            "flex flex-col relative",
            project.category === "Front End" && "bg-blue-100",
            project.category === "backend" && "bg-green-100",
            project.category === "Full Stack" && "bg-purple-100"
        )} key={project.id}>
            <CardContent className="flex flex-col gap-4 p-6">
                <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                        <h2 onClick={() => navigate("/project/" + project.id)} className="cursor-pointer text-xl font-semibold">{project.name}</h2>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => UpdateProjectPinned()}>
                                    {isPinned ? 'Ghim' : 'Bỏ ghim'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => UpdateProjectAction()}>
                                    Xoá kế hoạch
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Xuất thống kê
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <span className={cn(
                        "inline-block text-sm px-2.5 py-0.5 rounded-full",
                        project.category === "Front End" && "bg-blue-500 font-bold text-white border border-yellow-200",
                        project.category === "backend" && "bg-green-500 font-bold text-white  border border-blue-200",
                        project.category === "Full Stack" && "bg-gradient-to-r text-white font-bold bg-purple-500  border border-blue-200"
                    )}>
                        {project.category}
                    </span>
                </div>
                <p className="text-gray-800 flex-grow">
                    {truncateText(project.description, 120)}
                </p>
                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
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
    );
};

export default ProjectCard;