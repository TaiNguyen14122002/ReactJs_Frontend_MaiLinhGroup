
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { AlertTriangleIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'

const ProjectExpired = () => {
    const [listProjects, setListProjects] = useState([]);
    const token = localStorage.getItem('jwt');
    const [selectedProject, setSelectedProject] = useState([])
    const [endDate, setEndDate] = useState('');
    

    const fetchListProject = async () => {
        if (!token) {
            console.log("Người dùng không tồn tại");
        }
        try {
            const response = await axios.get(`http://localhost:1000/api/projects/expired`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            console.log("Dữ liệu dự án trễ hạn", response.data);
            setListProjects(response.data);
        } catch (error) {
            console.log("Xảy ra lỗi khi hiển thị dữ liệu");
        }

    }

    const handleDateChange = (event) => {
        setEndDate(event.target.value);
    };



    useEffect(() => {
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
        setEndDate(project.endDate)
      }

      const handleExtendSubmit = () => {
        console.log("Gia hạn thành công")
      }


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý kế hoạch trễ hạn</h1>
                </div>
            </header>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Danh sách kế hoạch trễ hạn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Tên kế hoạch</TableHead>
                                        <TableHead>Ngày bắt đầu</TableHead>
                                        <TableHead>Ngày kết thúc</TableHead>
                                        <TableHead>Số ngày trễ</TableHead>
                                        <TableHead className="text-right">Hành động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {listProjects.map((project) => {
                                        const overdueDays = calculateOverdueDays(project.endDate)
                                        
                                        return (
                                            <TableRow key={project.id} className="hover:bg-muted/50 transition-colors">
                                                <TableCell className="font-medium">{project.id}</TableCell>
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
                                                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleExtend(project)}>
                                                                Gia hạn
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Gia hạn dự án: {selectedProject?.name}</DialogTitle>
                                                            </DialogHeader>
                                                            <form onSubmit={handleExtendSubmit} className="space-y-4">
                                                                <div>
                                                                    <Label htmlFor="newEndDate">Ngày kết thúc mới</Label>
                                                                    <Input id="newEndDate" value ={endDate} onChange={handleDateChange} type="date" required className="mt-1" />
                                                                </div>
                                                                <Button type="submit">Xác nhận</Button>
                                                            </form>
                                                        </DialogContent>
                                                    </Dialog>
                                                    {/* <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleComplete(project.id)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircleIcon className="mr-2 h-4 w-4" />
                            Hoàn thành
                          </Button> */}
                                                </TableCell>

                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>

                        </div>
                    </CardContent>
                </Card>

            </main>
        </div>
    )
}

export default ProjectExpired
