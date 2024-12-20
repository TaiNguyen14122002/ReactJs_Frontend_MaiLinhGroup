import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; // Đảm bảo bạn đã cài đặt chart.js
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoadingPopup } from "../Performance/LoadingPopup";

const Subscription = () => {

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem('jwt');
  // const tasks = [
  //   { id: 1, name: "Thiết kế giao diện người dùng", priority: "Cao", dueDate: "2023-12-15", status: "Đang thực hiện" },
  //   { id: 2, name: "Phát triển API backend", priority: "Trung bình", dueDate: "2023-12-20", status: "Chưa bắt đầu" },
  //   { id: 3, name: "Kiểm thử bảo mật", priority: "Cao", dueDate: "2023-12-18", status: "Đang thực hiện" },
  //   { id: 4, name: "Tối ưu hóa cơ sở dữ liệu", priority: "Thấp", dueDate: "2023-12-25", status: "Chưa bắt đầu" },
  //   { id: 5, name: "Viết tài liệu người dùng", priority: "Trung bình", dueDate: "2023-12-22", status: "Chưa bắt đầu" },
  // ]

  const [tasks, setTasks] = useState([]);

  const fetchIssueByUser = async () => {
    setIsOpen(true)
    try {
      const response = await axios.get(`http://localhost:1000/api/issues/users/issues`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Dữ liệu tác vụ", response.data);
      setTasks(response.data)
      setIsOpen(false)
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error)
    }
  }

  useEffect(() => {
    setIsOpen(true);
    fetchIssueByUser()
  }, [token])

  return (
    <main className="flex-1 p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Danh sách nhiệm vụ</h2>
        <Table>
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
            {tasks.map((task) => (
              <TableRow key={task.id} onClick={() => navigate(`/project/${task.projectId}/issue/${task.id}`)} style={{ cursor: 'pointer' }}>
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <Badge variant={task.priority === "Cao" ? "destructive" : task.priority === "Trung bình" ? "default" : "secondary"}>
                    {task.finish === null ? '0%' : `${task.finish}%`}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    style={{
                      backgroundColor: task.priority === "High" ? "red" :
                        task.priority === "Medium" ? "rgb(29, 134, 192)" : // Màu xanh da trời rgb(29, 134, 192) cho Medium
                          task.priority === "Low" ? "green" : "transparent",
                      color: "white", // Màu chữ trắng để dễ nhìn trên nền
                      padding: "5px 10px", // Padding để tạo khoảng cách giữa chữ và viền
                      borderRadius: "5px", // Bo góc cho badge
                    }}
                  >
                    {task.priority === "High" ? "Cao" :
                      task.priority === "Medium" ? "Bình thường" :
                        task.priority === "Low" ? "Thấp" : ""}
                  </Badge>
                </TableCell>


                <TableCell className="whitespace-nowrap">
                  <CalendarIcon className="inline mr-2 h-4 w-4" />
                  {format(new Date(task.startDate), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <CalendarIcon className="inline mr-2 h-4 w-4" />
                  {format(new Date(task.dueDate), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>{task.assignes?.fullname}</TableCell>
                <TableCell>
                  {task.userIssueSalaries[0]?.salary === null ? 'Không' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(task.userIssueSalaries[0]?.salary)}
                </TableCell>

                <TableCell>
                  <span
                    style={{
                      backgroundColor: task.userIssueSalaries[0]?.paid ? 'green' : 'red',
                      color: 'white',  // Màu chữ trắng để dễ đọc trên nền đỏ hoặc xanh
                      padding: '5px 10px', // Padding để tạo khoảng cách giữa chữ và viền
                      borderRadius: '5px', // Bo góc cho đẹp
                    }}
                  >
                    {task.userIssueSalaries[0]?.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <LoadingPopup isOpen={isOpen}/>
      </Card>
    </main>

  );
};

export default Subscription;
