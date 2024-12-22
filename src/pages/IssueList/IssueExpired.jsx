import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { addDays, differenceInDays, format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, CalendarCheck, CalendarIcon, Clock, DollarSign, Eye, RefreshCw, Search, User } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingPopup } from '../Performance/LoadingPopup';

const IssueExpired = () => {
    const token = localStorage.getItem('jwt')
    const [issueExpired, setExpired] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [extensionDays, setExtensionDays] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(true);

    const fetchIssueExpired = async () => {
        setIsOpen(true);
        if (!token) {
            console.log("Phiên đăng nhập đã hết hạn");
            setIsOpen(false); // Tắt popup nếu không có token
            return; // Dừng hàm nếu token không tồn tại
        }

        try {
            const response = await axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/issues/expired`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Dữ liệu:", response.data);
            setExpired(response.data); // Lưu dữ liệu vào trạng thái
        } catch (error) {
            console.error("Có lỗi xảy ra trong quá trình tải dữ liệu:", error);
        } finally {
            setIsOpen(false); // Đảm bảo popup luôn tắt sau khi xử lý xong
        }
    };

    useEffect(() => {
        setIsOpen(true);
        fetchIssueExpired();
    }, [token])

    const priorityColors = {
        Low: "bg-blue-100 text-blue-800",
        Medium: "bg-yellow-100 text-yellow-800",
        High: "bg-red-100 text-red-800"
    }

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        done: "bg-green-100 text-green-800"
    }

    const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' })
    const [searchTerm, setSearchTerm] = useState('')

    const filteredAndSortedTasks = useMemo(() => {
        const today = new Date()
        let filteredTasks = issueExpired
            .filter(task => {
                const dueDate = parseISO(task.dueDate)
                return differenceInDays(dueDate, today) < 0
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

            if (sortConfig.key === 'daysOverdue') {
                const daysOverdueA = differenceInDays(new Date(), parseISO(a.dueDate))
                const daysOverdueB = differenceInDays(new Date(), parseISO(b.dueDate))
                return sortConfig.direction === 'asc' ? daysOverdueA - daysOverdueB : daysOverdueB - daysOverdueA
            }

            if (sortConfig.key === 'startDate' || sortConfig.key === 'dueDate') {
                return sortConfig.direction === 'asc'
                    ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
                    : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key])
            }

            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [issueExpired, sortConfig, searchTerm])

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

    const getDaysOverdue = (dueDate) => {
        const today = new Date()
        const due = parseISO(dueDate)
        return differenceInDays(today, due)
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

    useEffect(() => {
        if (selectedTask) {
            setExtensionDays(selectedTask.dueDate);  // Gán giá trị dueDate ban đầu của task vào extensionDays khi chọn task
        }
    }, [selectedTask]);

    // const handleExtendDueDate = (taskId) => {
    //     console.log(`Extending task with ID: ${taskId}`);
    //     setExpired(prevTasks =>
    //         prevTasks.map(task =>
    //             task.id === taskId
    //                 ? { ...task, dueDate: format(parseISO(extensionDays), 'yyyy-MM-dd') }
    //                 : task
    //         )
    //     )
    //     console.log("Dữ liệu sau khi cập nhập", extensionDays)
    //     setSelectedTask(null)
    // }

    const CustomToast = () => {
        return (
            <div style={{ padding: '10px', backgroundColor: '#4caf50', color: 'white' }}>
                <strong>Thông báo thành công!</strong>
                <p>Ngày hết hạn đã được cập nhật thành công.</p>
            </div>
        );
    };

    const handleExtendDueDate = async (taskId) => {
        setIsLoading(true)
        console.log("Tai", extensionDays)
        try {
            const response = await axios.put(
                `https://springbootbackendpms2012202-production.up.railway.app/api/issues/${taskId}/due-date`,
                extensionDays, // Gửi trực tiếp chuỗi ngày mà không cần bao bọc trong đối tượng
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json', // Đảm bảo Content-Type là application/json
                    },
                }
            );
            //   const updatedTask = await response.json()

            setExpired(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId
                        ? { ...task, dueDate: format(parseISO(extensionDays), 'yyyy-MM-dd') }
                        : task
                )
            )

            toast(<CustomToast />);

            console.log("done")

            setSelectedTask(null)
        } catch (error) {
            console.error('Error updating due date:', error)
        } finally {
            setIsLoading(false)
        }
    }
    const navigate = useNavigate();
    const handleRowClick = (itemId, projectId) => {
        navigate(`/project/${projectId}/issue/${itemId}`); // Chuyển hướng đến trang chi tiết của nhiệm vụ
    };

    return (
        
        <Card className="w-full shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
                <CardTitle className="text-2xl font-bold text-white">Nhiệm vụ đã hết hạn</CardTitle>
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
                        <TableHeader className="bg-gray-100">
                            <TableRow>
                                <SortableTableHead sortKey="title">Tiêu đề</SortableTableHead>
                                <SortableTableHead sortKey="description">Mô tả</SortableTableHead>
                                <SortableTableHead sortKey="priority">Ưu tiên</SortableTableHead>
                                <SortableTableHead sortKey="status">Trạng thái</SortableTableHead>
                                {/* <SortableTableHead sortKey="startDate">Ngày giao</SortableTableHead> */}
                                <SortableTableHead sortKey="dueDate">Ngày hết hạn</SortableTableHead>
                                <SortableTableHead sortKey="daysOverdue">Quá hạn</SortableTableHead>
                                <SortableTableHead sortKey="price">Giá trị</SortableTableHead>
                                <SortableTableHead sortKey="assignee.fullname">Người được giao</SortableTableHead>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredAndSortedTasks.map((task) => (
                                <TableRow key={task.id} className="hover:bg-gray-50 transition-colors" >
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
                                    {/* <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                            {format(parseISO(task.startDate), 'dd/MM/yyyy', { locale: vi })}
                                        </div>
                                    </TableCell> */}
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center">
                                            <CalendarCheck className="mr-2 h-4 w-4 text-gray-400" />
                                            {format(parseISO(task.dueDate), 'dd/MM/yyyy', { locale: vi })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center text-red-600">
                                            <AlertTriangle className="mr-2 h-4 w-4" />
                                            {getDaysOverdue(task.dueDate)} ngày
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
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedTask(task)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                                    >
                                                        <RefreshCw size={16} color="white" />
                                                        Gia hạn
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Gia hạn nhiệm vụ {task.title}</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="extensionDays" className="text-sm font-medium">
                                                                Ngày hết hạn mới
                                                            </Label>

                                                            <Input
                                                                id="extensionDays"
                                                                type="date"
                                                                className="col-span-3"
                                                                value={extensionDays}
                                                                onChange={(e) => setExtensionDays(e.target.value)}
                                                                min={task ? format(addDays(parseISO(task.dueDate), 1), 'yyyy-MM-dd') : ''}

                                                            />
                                                        </div>
                                                    </div>
                                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => selectedTask && handleExtendDueDate(selectedTask.id)}
                                                        disabled={isLoading}>
                                                        {isLoading ? 'Đang xử lý...' : 'Xác nhận gia hạn'}
                                                    </Button>
                                                </DialogContent>
                                            </Dialog>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRowClick(task.id, task.projectID)}
                                                className="bg-green-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                            >
                                                <Eye size={16} color="white" className="mr-2" />
                                                Chi tiết
                                            </Button>

                                        </div>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </div>

            </CardContent>
            <LoadingPopup isOpen={isOpen} />

        </Card>
    )
}

export default IssueExpired
