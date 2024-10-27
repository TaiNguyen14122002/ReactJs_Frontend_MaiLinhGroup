import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Đăng ký các thành phần cần thiết


const CountProjectByUser = () => {
    const [chartData, setChartData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [errorMessage, setErrorMessage] = useState('');
    const token = localStorage.getItem('jwt');

    const fetchProjectCountByMonth = async (year) => {
        if (!token) {
            setErrorMessage("Vui lòng đăng nhập.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:1000/api/projects/countProjects`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { year: year },
            });

            const data = response.data;

            console.log('Dữ liệu từ API:', data);

            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];

            const ownedProjects = months.map(month => data[month.toLowerCase()]?.owned || 0);
            const participatedProjects = months.map(month => data[month.toLowerCase()]?.participated || 0);

            console.log('Số lượng dự án làm chủ:', ownedProjects);
            console.log('Số lượng dự án tham gia:', participatedProjects);

            setChartData({
                labels: months,
                datasets: [
                    {
                        label: 'Dự án làm chủ',
                        data: ownedProjects,
                        backgroundColor: '#3498db',
                        borderColor: '#2980b9',
                        borderWidth: 1,
                    },
                    {
                        label: 'Dự án tham gia',
                        data: participatedProjects,
                        backgroundColor: '#e74c3c',
                        borderColor: '#c0392b',
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error(error);
            setErrorMessage("Đã xảy ra lỗi khi tải dữ liệu.");
        }
    };

    useEffect(() => {
        fetchProjectCountByMonth(selectedYear);
    }, [selectedYear]);

    return (
        <div>
            <h2>Projects Created and Participated Per Month</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <label htmlFor="yearSelect">Chọn năm: </label>
            <select
                id="yearSelect"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
                {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>

            {chartData ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            ) : (
                !errorMessage && <p>Đang tải dữ liệu...</p>
            )}
        </div>
    );
};

export default CountProjectByUser;
