import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { differenceInDays, format, parseISO } from 'date-fns';
import { ArrowDown, ArrowUp, ArrowUpDown, CalendarArrowDown, CalendarCheck, Clock, DollarSign, Search, User } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import { vi } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom';

const IssueExpiring = () => {
    const token = localStorage.getItem('jwt');
    const [issueExpiring, setIssueExpiring] = useState([]);

    const fetchIssueExpiring = async () => {
        try {
            if (!token) {
                console.log("Phiên đăng nhập đã hết hạn")
            }
            const response = await axios.get(`http://localhost:1000/api/issues/expiring`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("Dữ liệu", response.data)
            setIssueExpiring(response.data)

        } catch (error) {
            console.log("Có lỗi xảy ra trong quá trình thực hiện dữ liệu", error)
        }
    }

    useEffect(() => {
        fetchIssueExpiring();
    }, [token])

    const priorityColors = {
        Low: "bg-blue-100 text-blue-800",
        Medium: "bg-yellow-100 text-yellow-800",
        High: "bg-red-100 text-red-800"
    }

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        done: "bg-green-100 text-green-800",
        "Chưa làm": "bg-gray-100 text-gray-800"
    }

    const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' })
    const [searchTerm, setSearchTerm] = useState('')

    const filteredAndSortedTasks = useMemo(() => {
        const today = new Date()
        let filteredTasks = issueExpiring
            .filter(task => {
                const dueDate = parseISO(task.dueDate)
                return differenceInDays(dueDate, today) >= 0 && task.status !== 'done'
            })
            .filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.assignee.fullname.toLowerCase().includes(searchTerm.toLowerCase())
            )

        return filteredTasks.sort((a, b) => {
            if (sortConfig.key === 'assignee.fullname') {
                if (a.assignee.fullname < b.assignee.fullname) return sortConfig.direction === 'asc' ? -1 : 1
                if (a.assignee.fullname > b.assignee.fullname) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            }

            if (sortConfig.key === 'price') {
                const priceA = a.price ? parseInt(a.price) : 0
                const priceB = b.price ? parseInt(b.price) : 0
                return sortConfig.direction === 'asc' ? priceA - priceB : priceB - priceA
            }

            if (sortConfig.key === 'daysLeft') {
                const daysLeftA = differenceInDays(parseISO(a.dueDate), new Date())
                const daysLeftB = differenceInDays(parseISO(b.dueDate), new Date())
                return sortConfig.direction === 'asc' ? daysLeftA - daysLeftB : daysLeftB - daysLeftA
            }

            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [issueExpiring, sortConfig, searchTerm])


    console.log("tai", filteredAndSortedTasks)

    const requestSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const SortableTableHead = ({ children, sortKey }) => {
        return (
            <TableHead>
                <Button
                    variant="ghost"
                    onClick={() => requestSort(sortKey)}
                    className="hover:bg-transparent font-semibold text-gray-700"
                >
                    {children}
                    {sortConfig.key === sortKey ? (
                        sortConfig.direction === 'asc' ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowDown className="ml-2 h-4 w-4" />
                        )
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            </TableHead>
        )
    }

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A'
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(amount))
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''; // Xử lý trường hợp không có ngày
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    };

    const getDaysLeft = (dueDate) => {
        const today = new Date()
        const due = parseISO(dueDate)
        const daysLeft = differenceInDays(due, today)
        return daysLeft
    }

    const getPriorityDisplay = (priority) => {
        switch (priority) {
            case 'High':
                return 'Cao';
            case 'Medium':
                return 'Bình thường';
            case 'Low':
                return 'Thấp';
            default:
                return 'Không xác định';
        }
    };

    const navigate = useNavigate();
    const handleRowClick = (itemId, projectId) => {
        navigate(`/project/${projectId}/issue/${itemId}`); // Chuyển hướng đến trang chi tiết của nhiệm vụ
    };




    return (
        <Card className="w-full shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardTitle className="text-2xl font-bold text-white">Nhiệm vụ sắp hết hạn</CardTitle>
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
                            className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-100">
                            <TableRow>
                                <SortableTableHead sortKey="title">Tiêu đề</SortableTableHead>
                                <SortableTableHead sortKey="description">Mô tả</SortableTableHead>
                                <SortableTableHead sortKey="priority">Ưu tiên</SortableTableHead>
                                <SortableTableHead sortKey="status">Trạng thái</SortableTableHead>
                                <SortableTableHead sortKey="daysLeft">Còn lại</SortableTableHead>
                                <SortableTableHead sortKey="dueDate">Ngày hết hạn</SortableTableHead>
                                <SortableTableHead sortKey="price">Lương</SortableTableHead>
                                <SortableTableHead sortKey="assignee.fullname">Người được giao</SortableTableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredAndSortedTasks.map((task) => (
                                <TableRow key={task.id} className="hover:bg-gray-50 transition-colors" onClick={() => handleRowClick(task.id, task.projectID)} style={{ cursor: 'pointer' }}>
                                    <TableCell className="font-medium">{task.title}</TableCell>
                                    <TableCell className="max-w-xs truncate">{task.description}</TableCell>
                                    <TableCell>
                                        <Badge className={`${priorityColors[task.priority]} px-2 py-1 rounded-full text-xs font-semibold`}>
                                            {getPriorityDisplay(task.priority)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${statusColors[task.status]} px-2 py-1 rounded-full text-xs font-semibold`}>
                                            {task.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                            {getDaysLeft(task.dueDate)} ngày
                                        </div>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center">
                                            <CalendarCheck className="mr-2 h-4 w-4 text-gray-400" />
                                            {formatDate(task.dueDate)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center">

                                            {formatCurrency(task.price)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <User className="mr-2 h-4 w-4 text-gray-400" />
                                            {task.assignee.fullname}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>

                </div>

            </CardContent>

        </Card>
    )
}

export default IssueExpiring
