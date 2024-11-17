import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

import { Chart, registerables } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, TagIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

Chart.register(...registerables); // Đăng ký các thành phần cần thiết


const CountProjectByUser = () => {

    const [mockProjects, setMockProjects] = useState([]);
    const [mockIssues, setMockIssues] = useState([]);

    const token = localStorage.getItem('jwt');

    const fetchProjectOwned = async () => {
        if (!token) {
            console.log("Bạn chưa đăng nhập")
        }
        else {
            try {
                const response = await axios.get(`http://localhost:1000/api/projects/owner`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Dữ liệu mockProjects", response.data)
                setMockProjects(response.data);


            } catch (error) {
                console.log("Có lỗi xẩy ra trong quá trình thực hiện dữ liệu", error);
            }
        }
    }

    const [selectedProjectId, setSelectedProjectId] = useState('');

    const fetchAllByProject = async () => {
        if (!token) {
            console.log("Bạn chưa đăng nhập")
        }
        else {
            try {
                const response = await axios.get(`http://localhost:1000/api/issues/projects/${selectedProjectId}/issues`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Dữ liệu mockIssues", response.data)
                setMockIssues(response.data)
            } catch (error) {
                console.log("Có lỗi xẩy ra trong quá trình thực hiện dữ liệu", error);
            }
        }
    }

    const [issues, setIssues] = useState(mockIssues)
    const [statusFilter, setStatusFilter] = useState("all")

    useEffect(() => {
        // In a real application, you would fetch data from an API here
        fetchProjectOwned();
        fetchAllByProject();
        setIssues(mockIssues)
    }, [selectedProjectId])

    const filteredIssues = statusFilter === "all"
        ? issues
        : issues.filter(issue => issue.status?.toLowerCase() === statusFilter)

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    }

    const calculateCommission = (issue) => {
        return (issue.commission * issue.completionPercentage) / 100
    }

    const totalCommission = filteredIssues.reduce((sum, issue) => sum + calculateCommission(issue), 0)


    return (

        <div>
            <Card className="w-full mb-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Thống kê nhiệm vụ theo dự án</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>

                                <TableHead>Dự án</TableHead>
                                <TableHead>Mức đề xuất</TableHead>
                                <TableHead>Mức thu về</TableHead>
                                <TableHead>Chưa làm</TableHead>
                                <TableHead>Đang làm</TableHead>
                                <TableHead>Đã làm</TableHead>
                                <TableHead>Tổng số</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockProjects.map((project) => {
                                const projectIssues = mockIssues.filter(issue => issue.projectId === project.id)
                                const todoCount = projectIssues.filter(issue => issue.status === "pending").length
                                const inProgressCount = projectIssues.filter(issue => issue.status === "In_Progress").length
                                const doneCount = projectIssues.filter(issue => issue.status === "done").length
                                const totalCount = projectIssues.length

                                return (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">{project.name}</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>{todoCount}</TableCell>
                                        <TableCell>{inProgressCount}</TableCell>
                                        <TableCell>{doneCount}</TableCell>
                                        <TableCell>{totalCount}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Danh sách tác vụ</CardTitle>
                    <div className="flex justify-between items-center">
                        {/* <div className="text-lg font-semibold">
                            Tổng hoa hồng: {formatCurrency(totalCommission)}
                        </div> */}
                        <Select onValueChange={setSelectedProjectId}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Lọc theo trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockProjects?.map((item) => (
                                    <SelectItem value={item.id.toString()} key={item.id}>{item.name}</SelectItem>
                                ))}

                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>Danh sách các vấn đề trong dự án</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">ID</TableHead>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Mức độ hoàn thành</TableHead>
                                <TableHead>Độ ưu tiên</TableHead>
                                <TableHead>Ngày bắt đầu</TableHead>
                                <TableHead>Ngày kết thúc</TableHead>
                                <TableHead>Người được giao</TableHead>
                                {/* <TableHead>Mức độ hoàn thành</TableHead> */}

                                <TableHead>Thực hưởng</TableHead>
                                <TableHead>Thanh toán</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockIssues?.map((issue) => (
                                <TableRow key={issue.id}>
                                    <TableCell className="font-medium">{issue.id}</TableCell>
                                    <TableCell>{issue.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            issue.status === "Done" ? "default" :
                                                issue.status === "pending" ? "secondary" : "outline"
                                        }>
                                            {issue.finish === null ? '0%' : `${issue.finish}%`}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            issue.priority === "High" ? "default" : // 'High' -> "default"
                                                issue.priority === "Medium" ? "secondary" : // 'Medium' -> "secondary"
                                                    issue.priority === "Low" ? "success" : "outline" // 'Low' -> "outline"
                                        }>
                                            {issue.priority === "High" ? "Cao" :
                                                issue.priority === "Medium" ? "Bình thường" :
                                                    issue.priority === "Low" ? "Thấp" : ""}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <CalendarIcon className="inline mr-2 h-4 w-4" />
                                        {format(new Date(issue.startDate), 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <CalendarIcon className="inline mr-2 h-4 w-4" />
                                        {format(new Date(issue.dueDate), 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell>{issue.assignes?.fullname}</TableCell>
                                    {/* <TableCell>
                                        {issue.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="mr-1">
                                                <TagIcon className="inline mr-1 h-3 w-3" />
                                                {tag}
                                            </Badge>
                                        ))}
                                    </TableCell> */}
                                    <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(issue.userIssueSalaries[0]?.salary)}</TableCell>
                                    <TableCell>
                                        <span
                                            style={{
                                                backgroundColor: issue.userIssueSalaries[0]?.paid ? 'green' : 'red',
                                                color: 'white',  // Màu chữ trắng để dễ đọc trên nền đỏ hoặc xanh
                                                padding: '5px 10px', // Padding để tạo khoảng cách giữa chữ và viền
                                                borderRadius: '5px', // Bo góc cho đẹp
                                            }}
                                        >
                                            {issue.userIssueSalaries[0]?.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

    );
};

export default CountProjectByUser;
