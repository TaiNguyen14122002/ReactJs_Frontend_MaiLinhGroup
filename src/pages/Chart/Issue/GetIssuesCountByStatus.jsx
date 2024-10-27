import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

import { useParams } from 'react-router-dom';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const GetIssuesCountByStatus = () => {
    const [stats, setStats] = useState(null);
    const [issues, setIssues] = useState([]);
    const token = localStorage.getItem('jwt');  // Lấy JWT từ localStorage
    const { projectId } = useParams();  // Lấy projectId từ URL
    console.log("Đang lấy thống kê cho projectId:", projectId);

    useEffect(() => {
        // Kiểm tra nếu không có token
        if (!token) {
            console.error("Không tìm thấy token");
            return;
        }

        // Gọi API với header đúng
        axios.get(`http://localhost:1000/api/issues/statistics/project/1003`, {
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

        axios.get(`http://localhost:1000/api/issues/GetIssueByProjectIdAndUserId`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { projectId: 1003 }

        })
            .then(response => {
                setIssues(response.data);
                console.log("Nhiem vu" + issues)
            })
            .catch(error => {
                console.error("Có lỗi khi lấy danh sách nhiệm vụ", error);

            })
    }, [projectId, token])

    if (!stats) {
        return <p>Đang tải...</p>;  // Hiển thị thông báo nếu dữ liệu chưa được tải xong
    }



    // Dữ liệu cho biểu đồ Bar
    const barData = {
        labels: ['Tổng số nhiệm vụ', 'Chưa làm', 'Đang làm', 'Hoàn thành'],
        datasets: [
            {
                label: 'Nhiệm vụ',
                data: [stats.total, stats.pending, stats.inProgress, stats.done],  // Dữ liệu cho biểu đồ
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

    // Dữ liệu cho biểu đồ Pie
    const pieData = {
        labels: ['Tổng số nhiệm vụ', 'Chưa làm', 'Đang làm', 'Hoàn thành'],
        datasets: [
            {
                label: 'Nhiệm vụ',
                data: [stats.total, stats.pending, stats.inProgress, stats.done],  // Dữ liệu cho biểu đồ
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

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '100%' }}>
                <h3 style={{ textAlign: 'center', marginTop: '10px', marginBottom: ' 25px', fontWeight: '600' }}>Thống kê vấn đề</h3>
                <div>
                    <div style={{ width: '70%', margin: 'auto' }}>

                        <Bar data={barData} options={barOptions} />
                        <h4 style={{ textAlign: 'center', marginTop: '10px', marginBottom: ' 25px', fontWeight: '600' }}>Hình 1: Thống kê nhiệm vụ được phân công theo biểu đồ thanh</h4>
                    </div>
                    <div style={{ width: '70%', margin: 'auto' }}>

                        <Pie data={pieData} options={pieOptions} />
                        <h4 style={{ textAlign: 'center', marginTop: '10px', marginBottom: ' 25px', fontWeight: '600' }}>Hình 2: Thống kê nhiệm vụ được phân công theo biểu đồ tròn</h4>
                    </div>
                </div>
            </div>

            <div style={{ width: '100%' }}>
            <h3 style={{ textAlign: 'center', marginTop: '10px', marginBottom: '25px', fontWeight: '600' }}>Danh sách các nhiệm vụ</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                            <th style={{ padding: '8px' }}>ID</th>
                            <th style={{ padding: '8px' }}>Tiêu đề</th>
                            <th style={{ padding: '8px' }}>Trạng thái</th>
                            <th style={{ padding: '8px' }}>Người được giao</th>
                            <th style={{ padding: '8px' }}>Hạn cuối</th>
                            <th style={{ padding: '8px' }}>Độ ưu tiên</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map(issue => (
                            <tr key={issue.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px' }}>{issue.id}</td>
                                <td style={{ padding: '8px' }}>{issue.title}</td>
                                <td style={{ padding: '8px' }}>{convertStatus(issue.status)}</td>
                                <td style={{ padding: '8px' }}>{issue.assignee.fullname}</td>
                                <td style={{ padding: '8px' }}>{issue.dueDate}</td>
                                <td style={{ padding: '8px' }}>{issue.priority}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default GetIssuesCountByStatus;
