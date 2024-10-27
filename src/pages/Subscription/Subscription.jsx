import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; // Đảm bảo bạn đã cài đặt chart.js
import axios from "axios";

const Subscription = () => {
  const [chartData, setChartData] = useState(null);
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:1000/api/issues/priority-count/all-projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const priorities = response.data;

        // Khởi tạo biến đếm cho các cột
        const projectCounts = {
          Low: 0,
          Medium: 0,
          High: 0,
        };

        // Phân loại số lượng theo độ ưu tiên
        priorities.forEach(item => {
          const priority = item.priority; // priority
          const count = item.count; // count

          // Cập nhật đếm dựa trên độ ưu tiên
          if (priority === 'Low') {
            projectCounts.Low += count;
          } else if (priority === 'Medium') {
            projectCounts.Medium += count;
          } else if (priority === 'High') {
            projectCounts.High += count;
          } else {
            // Xử lý trường hợp priority là null hoặc không hợp lệ
            console.warn(`Priority is null or invalid: ${priority}`);
          }
        });

        console.log("Project Counts:", projectCounts); // Log để kiểm tra giá trị

        // Cập nhật dữ liệu biểu đồ
        setChartData({
          labels: ['Low', 'Medium', 'High'],
          datasets: [
            {
              label: 'Project Count',
              data: [projectCounts.Low, projectCounts.Medium, projectCounts.High],
              backgroundColor: [
                'rgba(52, 152, 219, 0.6)', // Low
                'rgba(231, 76, 60, 0.6)', // Medium
                'rgba(46, 204, 113, 0.6)', // High
              ],
              borderColor: [
                'rgba(52, 152, 219, 1)', // Low
                'rgba(231, 76, 60, 1)', // Medium
                'rgba(46, 204, 113, 1)', // High
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching project counts:', error);
      }
    };

    fetchData();
  }, [token]); // Thêm dependency array để tránh gọi liên tục

  return (
    <div>
      <h2>Project Counts by Priority</h2>
      {chartData ? ( // Kiểm tra dữ liệu biểu đồ trước khi hiển thị
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
              title: {
                display: true,
                text: 'Project Counts by Priority',
              },
            },
          }}
        />
      ) : (
        <p>Loading data...</p> // Thông báo đang tải dữ liệu
      )}
    </div>
  );
};

export default Subscription;
