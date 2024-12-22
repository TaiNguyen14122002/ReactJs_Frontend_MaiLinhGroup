import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

import { useNavigate, useParams } from 'react-router-dom';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const GetIssuesCountByStatus = () => {
    const [priority, setPriority] = useState(null);
    const [stats, setStats] = useState(null);
    const [countByStatusAndAssignee, setcountByStatusAndAssignee] = useState(null);
    const [listIssue, setListIssue] = useState([]);
    const navigate = useNavigate();

    const [selectedIssue, setSelectedIssue] = useState(null);

    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

    const [issues, setIssues] = useState([]);
    const token = localStorage.getItem('jwt');  // Lấy JWT từ localStorage
    const { projectId } = useParams();  // Lấy projectId từ URL
    console.log("Đang lấy thống kê cho projectId:", projectId);

    const { id } = useParams();


    //Biểu đồ nhiệm vụ theo độ ưu tiên
    useEffect(() => {
        // Kiểm tra nếu không có token
        if (!token) {
            console.error("Không tìm thấy token");
            return;
        }

        // Gọi API với header đúng
        axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/issues/countByPriority/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Truyền token vào header Authorization
            },
        })
            .then(response => {
                setPriority(response.data);  // Lưu kết quả vào state
            })
            .catch(error => {
                console.error("Có lỗi khi lấy thống kê vấn đề!", error);
            });
    }, [projectId, token]);  // Chỉ phụ thuộc vào projectId và token

    //Biểu đồ nhiệm vụ theo trạng thái
    useEffect(() => {
        // Kiểm tra nếu không có token
        if (!token) {
            console.error("Không tìm thấy token");
            return;
        }

        // Gọi API với header đúng
        axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/issues/countByStatus/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Truyền token vào header Authorization
            },
        })
            .then(response => {
                setStats(response.data);  // Lưu kết quả vào state
            })
            .catch(error => {
                console.error("Có lỗi khi lấy thống kê vấn đề!", error);
            });
    }, [projectId, token]);  // Chỉ phụ thuộc vào projectId và token


    useEffect(() => {
        if (!token) {
            console.log("không tìm thấy token");
            return;
        }

        axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/issues/GetIssueByProjectIdAndUserId`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { projectId: id }

        })
            .then(response => {
                setIssues(response.data);
            })
            .catch(error => {
                console.error("Có lỗi khi lấy danh sách nhiệm vụ", error);

            })
    }, [projectId, token])

    //Hiển thị trạng thái nhiệm vụ các thành viên
    useEffect(() => {
        if (!token) {
            console.log("không tìm thấy token");
            return;
        }

        axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/issues/countByStatusAndAssignee/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },


        })
            .then(response => {
                setcountByStatusAndAssignee(response.data);
            })
            .catch(error => {
                console.error("Có lỗi khi lấy danh sách nhiệm vụ", error);

            })
    }, [projectId, token])

    //Hiển thị nhiệm vụ trong dự án
    useEffect(() => {
        if (!token) {
            console.log("không tìm thấy token");
            return;
        }

        axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/issues/project/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setListIssue(response.data);
            })
            .catch(error => {
                console.error("Có lỗi khi lấy danh sách nhiệm vụ", error);

            })
    }, [projectId, token])



    if (!priority || !stats || !countByStatusAndAssignee) {
        return <p>Đang tải dữ liệu...</p>;  // Hiển thị thông báo nếu dữ liệu chưa được tải xong
    }

    //Biểu đồ Hiển thị trạng thái nhiệm vụ các thành viên

    const labels = Object.keys(countByStatusAndAssignee);

    // Duyệt qua từng user và lấy dữ liệu theo trạng thái
    const inProgressData = labels.map(user => countByStatusAndAssignee[user]?.['Chưa làm'] || 0);
    const pendingData = labels.map(user => countByStatusAndAssignee[user]?.['Đang làm'] || 0);
    const doneData = labels.map(user => countByStatusAndAssignee[user]?.['Hoàn thành'] || 0);


    const barDataStatus = {
        labels: labels,
        datasets: [
            {
                
                label: 'Chưa làm',
                data: inProgressData,
                backgroundColor: '#ff6f61',
                borderColor: '#ff6f61',
                borderWidth: 1,
            },
            {
                label: 'Đang làm',
                data: pendingData,
                backgroundColor: '#8884d8',
                borderColor: '#8884d8',
                borderWidth: 1,
            },
            {
                label: 'Hoàn thành',
                data: doneData,
                backgroundColor: '#ffeb3b',
                borderColor: '#ffeb3b',
                borderWidth: 1,
            }
        ]
    };



    // Dữ liệu cho biểu đồ Bar
    const barData = {
        labels: ['Khẩn cấp', 'Quan trọng', 'Bình thường', 'thấp'],
        datasets: [
            {
                label: 'Độ ưu tiên',
                data: [priority.total, priority.High, priority.Medium, priority.Low],  // Dữ liệu cho biểu đồ
                backgroundColor: ['#8884d8', '#ff6f61', '#ffeb3b', '#4caf50'],  // Màu nền riêng cho từng thanh
                borderColor: ['#8884d8', '#ff6f61', '#ffeb3b', '#4caf50'],
                borderWidth: 1,
            }
        ]
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.dataset.label + ': ' + context.raw;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
            }
        }
    };

    // Chuyển đổi trạng thái từ tiếng Anh sang tiếng Việt
    const convertStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'Chưa làm';
            case 'in_progress':
                return 'Đang làm';
            case 'done':
                return 'Đã làm';
            default:
                return status;
        }
    };

    const statss = {
        pending: stats['Chưa làm'] || 0,  // Lấy số lượng "Chưa làm"
        done: stats['Hoàn thành'] || 0,
        in_progress: stats['Đang làm'] || 0      // Lấy số lượng "Hoàn thành"
    };


    // Dữ liệu cho biểu đồ Pie
    const pieData = {
        // labels: ['Chưa phân công', 'Chưa làm', 'Đang làm', 'Hoàn thành'],
        // labels: Object.keys(stats),
        labels: Object.keys(stats).map(key => key === "notyetassigned" ? "Chưa phân công" : key),
        datasets: [
            {
                label: 'Nhiệm vụ',
                // data: [stats.notyetassigned, statss.pending, stats.in_progress, stats.done],  // Dữ liệu cho biểu đồ
                data: Object.values(stats),
                backgroundColor: ['#8884d8', '#ff6f61', '#ffeb3b', '#4caf50'],  // Màu nền riêng cho từng phần
                borderColor: ['#ffffff'],  // Đường viền màu trắng cho từng phần
                borderWidth: 1,
            }
        ]
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',  // Vị trí của chú thích
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.label + ': ' + context.raw;
                    }
                }
            }
        }
    };

    const columns = [
        { field: 'id', headerName: 'STT', width: 70 },
        { field: 'title', headerName: 'Tiêu đề', width: 130 },
        { field: 'status', headerName: 'Trạng thái', width: 130 },
        { field: 'assignee', headerName: 'Người được giao', width: 130 },
        { field: 'dueDate', headerName: 'Ngày hết hạn', width: 130 },
        { field: 'priority', headerName: 'Độ ưu tiên', width: 130 },
    ];


    const convertPriority = (priority) => {
        switch (priority) {
            case 'High':
                return 'Cao';
            case 'Medium':
                return 'Bình thường';
            case 'Low':
                return 'Thấp';
            default:
                return priority;  // Trả về giá trị gốc nếu không khớp
        }
    };
    const columnsAll = [
        { field: 'id', headerName: 'STT', width: 70 },
        { field: 'title', headerName: 'Tiêu đề', width: 300 },
        { field: 'status', headerName: 'Trạng thái', width: 300 },
        { field: 'assignee', headerName: 'Người được giao', width: 300 },
        { field: 'dueDate', headerName: 'Ngày hết hạn', width: 300 },
        { field: 'priority', headerName: 'Độ ưu tiên', width: 270 },
    ];
    const rowsAll = listIssue.map((listIssue, index) => ({
        id: index + 1,
        idIssue: listIssue.id,
        title: listIssue.title,
        status: convertStatus(listIssue.status), // Đảm bảo rằng convertStatus trả về một giá trị hợp lệ
        assignee: listIssue.assignee ? listIssue.assignee.fullname : "Chưa được giao",
        dueDate: listIssue.dueDate,
        priority: convertPriority(listIssue.priority)
    }));





    const rows = issues.map((issues, index) => ({
        id: index + 1,
        idIssue: issues.id,
        title: issues.title,
        status: convertStatus(issues.status), // Đảm bảo rằng convertStatus trả về một giá trị hợp lệ
        assignee: issues.assignee.fullname,
        dueDate: issues.dueDate,
        priority: convertPriority(issues.priority)
    }));

    const handleRowClick = (params) => {
        const clickedIssue = issues.find(issue => issue.id === params.row.idIssue);
        navigate(`/project/${id}/issue/${clickedIssue.id}`)
        setSelectedIssue(clickedIssue); // Cập nhật state với thông tin chi tiết của nhiệm vụ được chọn
    };



    return (

        <div className="container mx-auto p-4 space-y-8">


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Thống kê độ ưu tiên</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Bar data={barData} options={barOptions} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thống kê nhiệm vụ được phân công</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Pie data={pieData} options={pieOptions} />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thống kê vấn đề</CardTitle>
                </CardHeader>
                <CardContent>
                    <Bar data={barDataStatus} options={barOptions} />
                </CardContent>
            </Card>

            <Tabs defaultValue="your-tasks" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="your-tasks">Nhiệm vụ của bạn</TabsTrigger>
                    <TabsTrigger value="all-tasks">Tất cả nhiệm vụ</TabsTrigger>
                </TabsList>
                <TabsContent value="your-tasks">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách nhiệm vụ của bạn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                                pageSizeOptions={[5, 10]}
                                checkboxSelection
                                onRowClick={handleRowClick}
                                autoHeight
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="all-tasks">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách tất cả nhiệm vụ</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataGrid
                                rows={rowsAll}
                                columns={columnsAll}
                                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                                pageSizeOptions={[5, 10]}
                                checkboxSelection
                                onRowClick={handleRowClick}
                                autoHeight
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>


    );
};

export default GetIssuesCountByStatus;
