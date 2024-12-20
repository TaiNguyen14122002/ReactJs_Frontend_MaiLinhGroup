
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { addDays, format, parseISO } from 'date-fns';
import { AlertTriangleIcon, CalendarIcon, ClockIcon, Eye, InboxIcon, RefreshCw, Search } from 'lucide-react';

import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LoadingPopup } from '../Performance/LoadingPopup';

const ProjectExpired = () => {
    const [listProjects, setListProjects] = useState([]);
    const token = localStorage.getItem('jwt');
    const [selectedProject, setSelectedProject] = useState([])
    const [newEndDate, setNewEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false)



    const fetchListProject = async () => {
        setIsOpen(true)
        if (!token) {
            console.log("Người dùng không tồn tại");
        }
        try {
            const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/expired`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            console.log("Dữ liệu dự án trễ hạn", response.data);
            setListProjects(response.data);
            setIsOpen(false)
        } catch (error) {
            console.log("Xảy ra lỗi khi hiển thị dữ liệu");
        }

    }

    useEffect(() => {
        setIsOpen(true)
        fetchListProject();
        return;
    }, [])

    const calculateOverdueDays = (endDate) => {
        const today = new Date()
        const end = new Date(endDate)
        const diffTime = Math.abs(today.getTime() - end.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return today > end ? diffDays : 0
    }

    const handleExtend = (project) => {
        setSelectedProject(project);
        setNewEndDate(format(addDays(parseISO(project.endDate), 1), 'yyyy-MM-dd'));
    }

    const handleExtendSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProject || !newEndDate) {
            console.log("Không có dự án được chọn hoặc ngày kết thúc mới");
            return;
        }

        try {
            const response = await axios.put(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/${selectedProject.id}/endDate`,
                newEndDate,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("Gia hạn thành công", newEndDate);

            // Update the project in the list
            setListProjects(prevList =>
                prevList.map(project =>
                    project.id === selectedProject.id
                        ? { ...project, endDate: newEndDate }
                        : project
                )
            );

            // Reset the selected project and new end date
            setSelectedProject(null);
            setNewEndDate('');
        } catch (error) {
            console.log("Xảy ra lỗi khi gia hạn dự án", error);
        }
    }

    const filteredProjects = useMemo(() => {
        return listProjects.filter(project =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.id.toString().includes(searchTerm)
        );
    }, [listProjects, searchTerm]);

    const navigate = useNavigate();
    const handleRowClick = (projectId) => {
        navigate(`/project/${projectId}`); // Chuyển hướng đến trang chi tiết của nhiệm vụ
    };


    return (
        <Card className="w-full">
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
                <CardTitle className="text-2xl font-bold text-white">Kế hoạch đã hết hạn</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm theo tiêu đề, mô tả hoặc người được giao"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>

                                <TableHead>Tên kế hoạch</TableHead>
                                <TableHead>Ngày bắt đầu</TableHead>
                                <TableHead>Ngày kết thúc</TableHead>
                                <TableHead>Số ngày trễ</TableHead>
                                <TableHead className="text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map((project) => {
                                    const overdueDays = calculateOverdueDays(project.endDate)

                                    return (
                                        <TableRow key={project.id} className="hover:bg-muted/50 transition-colors">

                                            <TableCell>{project.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    {project.createdDate}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    {project.endDate}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="destructive" className="flex items-center w-fit">
                                                    <AlertTriangleIcon className="mr-1 h-3 w-3" />
                                                    {overdueDays} ngày
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={() => handleExtend(project)}>
                                                            <RefreshCw size={16} color="white" />
                                                            Gia hạn
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Gia hạn dự án {selectedProject?.name}</DialogTitle>
                                                        </DialogHeader>
                                                        <form onSubmit={handleExtendSubmit} className="space-y-4">
                                                            <div>
                                                                <Label htmlFor="newEndDate">Ngày kết thúc mới</Label>
                                                                <Input
                                                                    id="newEndDate"
                                                                    value={newEndDate}
                                                                    onChange={(e) => setNewEndDate(e.target.value)}
                                                                    min={selectedProject ? format(addDays(parseISO(project.endDate), 1), 'yyyy-MM-dd') : ''}
                                                                    type="date"
                                                                    required
                                                                    className="mt-1"
                                                                />
                                                            </div>
                                                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" type="submit">Xác nhận gia hạn</Button>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleRowClick(project.id)}
                                                    className="bg-green-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    <Eye size={16} color="white" className="mr-2" />
                                                    Chi tiết
                                                </Button>

                                            </TableCell>

                                        </TableRow>
                                    )
                                })

                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <InboxIcon className="h-8 w-8 mb-2" />
                                            <p>Không có dữ liệu</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                            }
                        </TableBody>
                    </Table>

                </div>
            </CardContent>
            <LoadingPopup isOpen={isOpen} />
        </Card>

    )
}

export default ProjectExpired
