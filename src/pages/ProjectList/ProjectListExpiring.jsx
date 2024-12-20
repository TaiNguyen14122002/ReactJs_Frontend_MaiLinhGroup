
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import ProjectCardExpiring from '../Project/ProjectCardExpiring';
import { CalendarIcon, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingPopup } from '../Performance/LoadingPopup';

const ProjectListExpiring = () => {
    const [projects, setProjects] = useState([]);
    const [sortCriteria, setSortCriteria] = useState("daysLeft");
    const token = localStorage.getItem('jwt');
    const [searchTerm, setSearchTerm] = useState('')
    const [sortOrder, setSortOrder] = useState('')

    const [isOpen, setIsOpen] = useState(false);

    const fetchProjectExpiring = async () => {
        setIsOpen(true)
        
        if (!token) {
            console.log("Người dùng không tồn tại")
        }
        try {
            const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/expiring`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            console.log("Danh sách dự án sắp hết hạn", response.data);
            setProjects(response.data);
            setIsOpen(false)

        } catch (error) {
            console.log("Có lỗi xảy ra trong quá trình thực hiện dữ liệu", error)
        }finally{
            setIsOpen(false)
        }
    }
    const filteredAndSortedPlans = useMemo(() => {
        return projects
            .filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const dateA = new Date(a.endDate).getTime()
                const dateB = new Date(b.endDate).getTime()
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
                
            })
            setIsOpen(false)
    }, [projects, searchTerm, sortOrder, token])

    const getDaysLeft = (endDate) => {
        const today = new Date()
        const end = new Date(endDate)
        const timeDiff = end.getTime() - today.getTime()
        return Math.ceil(timeDiff / (1000 * 3600 * 24))
    }
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    }

    useEffect(() => {
        setIsOpen(true)
        fetchProjectExpiring();
        
    },[token])

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };
    return (
        <div>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 p-6 bg-gradient-to-r from-blue-500 to-purple-600  shadow-md">
                    <h1 className="text-2xl font-bold text-white">Kế hoạch sắp hết hạn</h1>
                    <div className="flex w-full md:w-auto gap-4">
                        <div className="relative flex-grow md:flex-grow-0 md:w-64">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                            <Input
                                type="text"
                                placeholder="Tìm kiếm theo tên ..."
                                className="pl-10 w-full bg-white border-transparent placeholder-blue-400 text-blue-600 focus:border-blue-400 focus:ring-blue-400 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
                            <SelectTrigger className="w-[180px] bg-white border-transparent text-blue-600 focus:border-blue-400 focus:ring-blue-400 transition-all">
                                <SelectValue placeholder="Lọc theo ngày hết hạn" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-blue-200">
                                <SelectItem value="asc" className="text-blue-600 focus:bg-blue-50">Hết hạn gần nhất</SelectItem>
                                <SelectItem value="desc" className="text-blue-600 focus:bg-blue-50">Hết hạn xa nhất</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {filteredAndSortedPlans.length === 0 ? (
                    <p className="text-center text-blue-500 mt-8">Không có dự án sắp hết hạn được tìm thấy</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6">
                        {filteredAndSortedPlans.map((plan) => {
                            const daysLeft = getDaysLeft(plan.endDate)
                            return (
                                <Card key={plan.id} className="flex flex-col bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader className="bg-[rgb(29,134,192)]">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-white font-bold text-2xl">{truncateText(plan.name, 32)}</CardTitle>
                                            <Badge variant={daysLeft <= 3 ? "destructive" : "secondary"} className={daysLeft <= 3 ? "bg-red-500 text-white" : "bg-yellow-500 text-white"}>
                                                Còn lại {daysLeft} ngày
                                            </Badge>
                                        </div>
                                        <CardDescription className="text-white">Hết hạn vào {new Date(plan.endDate).toLocaleDateString()}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow mt-4">
                                        <div className="flex items-center space-x-2 text-blue-600 mb-4">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span>Ngày tạo kế hoạch: {new Date(plan.createdDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-blue-600 mb-4">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span>Ngày kết thúc: {new Date(plan.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-500">Chi phí dự án: {formatCurrency(plan.fundingAmount)}</p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between ">
                                        <Button variant="outline" className="border-blue-400 bg-[rgb(29,134,192)] w-full text-white hover:bg-blue-100">Chi tiết</Button>
                                        {/* <Button className="bg-[rgb(29,134,192)] hover:bg-blue-700 text-white">Gia hạn thời gian</Button> */}
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                )}
                <LoadingPopup isOpen={isOpen}/>
            </div>
            
        </div>

    )
}

export default ProjectListExpiring
