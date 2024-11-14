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

Chart.register(...registerables); // Đăng ký các thành phần cần thiết


const CountProjectByUser = () => {
    // const [chartData, setChartData] = useState(null);
    // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    // const [errorMessage, setErrorMessage] = useState('');
    // const token = localStorage.getItem('jwt');

    // const fetchProjectCountByMonth = async (year) => {
    //     if (!token) {
    //         setErrorMessage("Vui lòng đăng nhập.");
    //         return;
    //     }

    //     try {
    //         const response = await axios.get(`http://localhost:1000/api/projects/countProjects`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             params: { year: year },
    //         });

    //         const data = response.data;

    //         console.log('Dữ liệu từ API:', data);

    //         const months = [
    //             'January', 'February', 'March', 'April', 'May', 'June',
    //             'July', 'August', 'September', 'October', 'November', 'December'
    //         ];

    //         const ownedProjects = months.map(month => data[month.toLowerCase()]?.owned || 0);
    //         const participatedProjects = months.map(month => data[month.toLowerCase()]?.participated || 0);

    //         console.log('Số lượng dự án làm chủ:', ownedProjects);
    //         console.log('Số lượng dự án tham gia:', participatedProjects);

    //         setChartData({
    //             labels: months,
    //             datasets: [
    //                 {
    //                     label: 'Dự án làm chủ',
    //                     data: ownedProjects,
    //                     backgroundColor: '#3498db',
    //                     borderColor: '#2980b9',
    //                     borderWidth: 1,
    //                 },
    //                 {
    //                     label: 'Dự án tham gia',
    //                     data: participatedProjects,
    //                     backgroundColor: '#e74c3c',
    //                     borderColor: '#c0392b',
    //                     borderWidth: 1,
    //                 },
    //             ],
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         setErrorMessage("Đã xảy ra lỗi khi tải dữ liệu.");
    //     }
    // };

    // useEffect(() => {
    //     fetchProjectCountByMonth(selectedYear);
    // }, [selectedYear]);

    const mockProjects = [
        { id: 1, name: "Website Redesign" },
        { id: 2, name: "Mobile App Development" },
        { id: 3, name: "Database Migration" }
      ]

    const mockIssues = [
        {
            id: 1,
            title: "Implement user authentication",
            description: "Set up JWT-based authentication for the application",
            status: "In Progress",
            priority: "High",
            startDate: "2023-06-01",
            dueDate: "2023-06-15",
            tags: ["backend", "security"],
            assignee: { name: "Nguyễn Văn Tài" },
            completionPercentage: 75,
            commission: 1000000,
            projectId: 1
        },
        {
            id: 2,
            title: "Design landing page",
            description: "Create a responsive design for the landing page",
            status: "To Do",
            priority: "Medium",
            startDate: "2023-06-05",
            dueDate: "2023-06-20",
            tags: ["frontend", "design"],
            assignee: { name: "Nguyễn Văn Tài" },
            completionPercentage: 0,
            commission: 800000,
            projectId: 1
        },
        {
            id: 3,
            title: "Fix payment gateway bug",
            description: "Resolve issues with payment processing",
            status: "Done",
            priority: "Critical",
            startDate: "2023-05-28",
            dueDate: "2023-06-02",
            tags: ["backend", "bugfix"],
            assignee: { name: "Nguyễn Văn Tài" },
            completionPercentage: 100,
            commission: 1500000,
            projectId: 2
        },
        {
            id: 4,
            title: "Optimize database queries",
            description: "Improve performance of slow database queries",
            status: "In Progress",
            priority: "High",
            startDate: "2023-06-10",
            dueDate: "2023-06-25",
            tags: ["backend", "performance"],
            assignee: { name: "Nguyễn Văn Tài" },
            completionPercentage: 50,
            commission: 1200000,
            projectId: 3
          }
    ]

    const [issues, setIssues] = useState(mockIssues)
    const [statusFilter, setStatusFilter] = useState("all")

    useEffect(() => {
        // In a real application, you would fetch data from an API here
        setIssues(mockIssues)
    }, [])

    const filteredIssues = statusFilter === "all"
        ? issues
        : issues.filter(issue => issue.status.toLowerCase() === statusFilter)

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    }

    const calculateCommission = (issue) => {
        return (issue.commission * issue.completionPercentage) / 100
    }

    const totalCommission = filteredIssues.reduce((sum, issue) => sum + calculateCommission(issue), 0)


    return (
        // <div>
        //     <h2>Projects Created and Participated Per Month</h2>
        //     {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        //     <label htmlFor="yearSelect">Chọn năm: </label>
        //     <select
        //         id="yearSelect"
        //         value={selectedYear}
        //         onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        //     >
        //         {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(year => (
        //             <option key={year} value={year}>
        //                 {year}
        //             </option>
        //         ))}
        //     </select>

        //     {chartData ? (
        //         <Bar
        //             data={chartData}
        //             options={{
        //                 responsive: true,
        //                 scales: {
        //                     y: {
        //                         beginAtZero: true,
        //                     },
        //                 },
        //             }}
        //         />
        //     ) : (
        //         !errorMessage && <p>Đang tải dữ liệu...</p>
        //     )}
        // </div>
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
                                <TableHead>Chưa làm</TableHead>
                                <TableHead>Đang làm</TableHead>
                                <TableHead>Đã làm</TableHead>
                                <TableHead>Tổng số</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockProjects.map((project) => {
                                const projectIssues = issues.filter(issue => issue.projectId === project.id)
                                const todoCount = projectIssues.filter(issue => issue.status === "To Do").length
                                const inProgressCount = projectIssues.filter(issue => issue.status === "In Progress").length
                                const doneCount = projectIssues.filter(issue => issue.status === "Done").length
                                const totalCount = projectIssues.length

                                return (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">{project.name}</TableCell>
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
                        <div className="text-lg font-semibold">
                            Tổng hoa hồng: {formatCurrency(totalCommission)}
                        </div>
                        <Select onValueChange={setStatusFilter} defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Lọc theo trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="to do">To Do</SelectItem>
                                <SelectItem value="in progress">In Progress</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
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
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ưu tiên</TableHead>
                                <TableHead>Ngày bắt đầu</TableHead>
                                <TableHead>Ngày kết thúc</TableHead>
                                <TableHead>Người được giao</TableHead>
                                <TableHead>Mức độ hoàn thành</TableHead>
                                <TableHead>Hoa hồng</TableHead>
                                <TableHead>Tags</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredIssues.map((issue) => (
                                <TableRow key={issue.id}>
                                    <TableCell className="font-medium">{issue.id}</TableCell>
                                    <TableCell>{issue.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            issue.status === "Done" ? "default" :
                                                issue.status === "In Progress" ? "secondary" : "outline"
                                        }>
                                            {issue.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            issue.priority === "Critical" ? "destructive" :
                                                issue.priority === "High" ? "default" :
                                                    issue.priority === "Medium" ? "secondary" : "outline"
                                        }>
                                            {issue.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <CalendarIcon className="inline mr-2 h-4 w-4" />
                                        {issue.startDate}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <CalendarIcon className="inline mr-2 h-4 w-4" />
                                        {issue.dueDate}
                                    </TableCell>
                                    <TableCell>{issue.assignee.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Progress value={issue.completionPercentage} className="w-[60px]" />
                                            <span>{issue.completionPercentage}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatCurrency(calculateCommission(issue))}</TableCell>
                                    <TableCell>
                                        {issue.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="mr-1">
                                                <TagIcon className="inline mr-1 h-3 w-3" />
                                                {tag}
                                            </Badge>
                                        ))}
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
