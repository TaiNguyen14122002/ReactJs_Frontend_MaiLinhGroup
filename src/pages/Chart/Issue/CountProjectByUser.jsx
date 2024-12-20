import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

import { Chart, registerables } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Check, FileSpreadsheet, TagIcon, Upload, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LoadingPopup } from '@/pages/Performance/LoadingPopup';


Chart.register(...registerables); // Đăng ký các thành phần cần thiết


const CountProjectByUser = () => {

    const [mockProjects, setMockProjects] = useState([]);
    const [mockIssues, setMockIssues] = useState([]);

    const [previewData, setPreviewData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    const[isOpen, setIsopen] = useState(false);

    const token = localStorage.getItem('jwt');

    const fetchProjectOwned = async () => {
        setIsopen(true)
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
                setIsopen(false);


            } catch (error) {
                console.log("Có lỗi xẩy ra trong quá trình thực hiện dữ liệu", error);
            }finally{
                
            }
        }
    }

    const [selectedProjectId, setSelectedProjectId] = useState('');

    const fetchAllByProject = async () => {
        setIsopen(true)
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
                setIsopen(false)
            } catch (error) {
                console.log("Có lỗi xẩy ra trong quá trình thực hiện dữ liệu", error);
            }finally{
                
            }
        }
    }

    const [issues, setIssues] = useState(mockIssues)
    const [statusFilter, setStatusFilter] = useState("all")

    useEffect(() => {
        // In a real application, you would fetch data from an API here
        setIsopen(true);
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

    const handleExportExcel = async () => {
        if (!selectedProjectId) {
            toast.warning(
                <div>
                    <div>
                        <h2 style={{ margin: '0', fontSize: '18px' }}>Cảnh báo</h2>
                        <p style={{ margin: '0', fontSize: '14px' }}>Xin vui lòng lựa chọn dự án trước khi xuất thống kê ra file Excel</p>
                    </div>
                </div>
            );
        } else {
            setIsopen(true)
            try {
                const response = await axios.get(`http://localhost:1000/api/issues/api/export/issues/${selectedProjectId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    responseType: 'blob'
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'issues.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                console.log("Done")
                setIsopen(false)

            } catch (error) {
                console.log("Có lỗi xảy ra trong quá trình thực hiển dữ liệu", error)
            }
            console.log("Exporting Excel for project:", selectedProjectId)
        }
    }

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0]
        if (file) {
            setFileName(file.name)
            try {
                const data = await file.arrayBuffer()
                const workbook = XLSX.read(data)

                if (workbook.SheetNames.length === 0) {
                    throw new Error('Không tìm thấy sheet nào trong file Excel')
                }

                const worksheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json(worksheet)

                if (jsonData.length === 0) {
                    throw new Error('Không tìm thấy dữ liệu trong file Excel')
                }

                setPreviewData(jsonData.slice(0, 5)) // Preview first 5 rows
                setIsModalOpen(true)
                setError(null)
            } catch (err) {
                setError('Lỗi khi đọc file Excel. Vui lòng đảm bảo đây là file Excel hợp lệ.')
                console.error(err)
            }
        }
    }

    const handleImport = async () => {
        if (previewData) {
            const jsonString = JSON.stringify(previewData, null, 2)
            console.log('Imported JSON data:', jsonString);

            try {
                const response = await axios.put(
                    `http://localhost:1000/api/issues/update/${selectedProjectId}`,
                    jsonString,  // Chỉ gửi dữ liệu, không cần bao bọc vào object nữa
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                fetchAllByProject();
            } catch (error) {
                console.log("Có lỗi xảy ra trong quá trình thực hiện dữ liệu", error);
            }

            alert('Dữ liệu đã được nhập thành công!');

            handleCloseModal()
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setPreviewData(null)
        setFileName(null)
    }

    const [searchTerm, setSearchTerm] = useState('')

    const filteredProjects = mockProjects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    )



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
                                const todoCount = projectIssues.filter(issue => issue.status === "Chưa làm").length
                                const inProgressCount = projectIssues.filter(issue => issue.status === "Đang làm").length
                                const doneCount = projectIssues.filter(issue => issue.status === "Hoàn thành").length
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
                    <div className='flex justify-between items-center'>
                        <div>
                            <CardTitle className="text-2xl font-bold">Danh sách tác vụ</CardTitle>
                            <div className="flex justify-between items-center">
                                {/* <div className="text-lg font-semibold">
                            Tổng hoa hồng: {formatCurrency(totalCommission)}
                        </div> */}
                                <Select onValueChange={setSelectedProjectId}>
                                    <SelectTrigger className="w-[320px] mt-5">
                                        <SelectValue placeholder="Lọc theo trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* {mockProjects?.map((item) => (
                                            <SelectItem value={item.id.toString()} key={item.id}>{item.name}</SelectItem>
                                        ))} */}

                                        <div className="p-2">
                                            <Input
                                                placeholder="Tìm kiếm..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="mb-2"
                                            />
                                        </div>
                                        {filteredProjects.length > 0 ? (
                                            filteredProjects.map((item) => (
                                                <SelectItem value={item.id.toString()} key={item.id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-center text-gray-500">Không có kết quả</div>
                                        )}

                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                        <div>
                            <div className="flex justify-end space-x-2 mb-4">
                                <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleExportExcel}>
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    Xuất Excel
                                </Button>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        aria-label="Chọn file Excel để xem trước và nhập"
                                    />
                                    <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Chọn file Excel để nhập
                                    </Button>
                                </div>

                                {error && (
                                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                                        {error}
                                    </div>
                                )}
                                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                    <DialogContent className="max-w-4xl w-full">
                                        <DialogHeader>
                                            <DialogTitle>Xem trước dữ liệu từ file: {fileName}</DialogTitle>
                                        </DialogHeader>
                                        <div className="overflow-y-auto max-h-[60vh]">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        {previewData && previewData.length > 0 && Object.keys(previewData[0]).map((header) => (
                                                            <TableHead key={header}>{header}</TableHead>
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {previewData && previewData.map((row, index) => (
                                                        <TableRow key={index}>
                                                            {Object.values(row).map((value, cellIndex) => (
                                                                <TableCell key={cellIndex}>{value.toString()}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <DialogFooter className="sm:justify-end">
                                            <Button onClick={handleCloseModal} variant="outline" className="bg-red-100 hover:bg-red-200 text-red-600">
                                                <X className="mr-2 h-4 w-4" />
                                                Hủy
                                            </Button>
                                            <Button onClick={handleImport} className="bg-green-500 hover:bg-green-600 text-white">
                                                <Check className="mr-2 h-4 w-4" />
                                                Xác nhận nhập
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                            </div>
                        </div>
                    </div>

                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>Danh sách các vấn đề trong dự án</TableCaption>
                        <TableHeader>
                            <TableRow>
                                {/* <TableHead className="w-[50px]">ID</TableHead> */}
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
                                    {/* <TableCell className="font-medium">{issue.id}</TableCell> */}
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
                <LoadingPopup isOpen={isOpen}/>
            </Card>
        </div>

    );
};

export default CountProjectByUser;
