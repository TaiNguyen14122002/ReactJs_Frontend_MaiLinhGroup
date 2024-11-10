
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ProjectCardExpiring from '../Project/ProjectCardExpiring';

const ProjectListExpiring = () => {
    const [projects, setProjects] = useState([]);
    const [sortCriteria, setSortCriteria] = useState("daysLeft");
    const token = localStorage.getItem('jwt');

    const fetchProjectExpiring = async () => {
        if (!token) {
            console.log("Người dùng không tồn tại")
        }
        try {
            const response = await axios.get(`http://localhost:1000/api/projects/expiring`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            console.log("Danh sách dự án sắp hết hạn", response.data);
            setProjects(response.data);

        } catch (error) {
            console.log("Có lỗi xảy ra trong quá trình thực hiện dữ liệu", error)
        }
    }

    useEffect(() => {
        fetchProjectExpiring();
        const sortedProjects = [...projects].sort((a, b) => {
            if (sortCriteria === "daysLeft") {
                const daysLeftA = new Date(a.dueDate).getTime() - new Date().getTime()
                const daysLeftB = new Date(b.dueDate).getTime() - new Date().getTime()
                return daysLeftA - daysLeftB;
            } else if (sortCriteria === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortCriteria === "dueDate") {
                return new Date(a.dueDate) - new Date(b.dueDate)
            }
            return 0;
        })
        setProjects(sortedProjects)
    }, [sortCriteria])
    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <header className="p-4 bg-white dark:bg-gray-800 shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Kế hoạch sắp hết hạn</h1>
            </header>
            <main className="flex-grow overflow-hidden">
                <div className="h-full p-4 flex flex-col">
                    <div className="mb-4 flex justify-end">
                        <Select onValueChange={setSortCriteria} defaultValue={sortCriteria}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sắp xếp theo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daysLeft">Thời gian còn lại</SelectItem>
                                <SelectItem value="name">Tên dự án</SelectItem>
                                <SelectItem value="dueDate">Ngày hết hạn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-grow overflow-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {projects.map((project) => (
                                <ProjectCardExpiring key={project.id} project={project} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProjectListExpiring
