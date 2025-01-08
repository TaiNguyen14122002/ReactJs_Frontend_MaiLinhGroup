"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import axios from "axios"
import { LoadingPopup } from "./LoadingPopup"

// Dữ liệu mẫu cho nhiều dự án
const projectsData = {
  "project-a": {
    name: "Dự án A",
    averagePerformance: 80.0,
    meanSquaredError: "N/A",
    monthlyPerformance: {
      "2024-11": 80.0
    },
    teamMembersData: [
      {
        avgDaysToComplete: 12.0,
        avgFinish: 80.0,
        avgPriority: 2.0,
        fullname: "Nguyễn Văn Tài",
        predictedFinish: 80.0,
        teamMemberID: 152,
        totalSalary: 5600000.0
      }
    ]
  },
  "project-b": {
    name: "Dự án B",
    averagePerformance: 85.0,
    meanSquaredError: "N/A",
    monthlyPerformance: {
      "2024-11": 85.0,
      "2024-12": 87.0
    },
    teamMembersData: [
      {
        avgDaysToComplete: 10.0,
        avgFinish: 85.0,
        avgPriority: 2.5,
        fullname: "Trần Thị Bình",
        predictedFinish: 86.0,
        teamMemberID: 153,
        totalSalary: 6000000.0
      }
    ]
  }
}

export default function ProjectPerformanceDashboard() {
  const [selectedProject, setSelectedProject] = useState("project-a")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("fullname")
  const [sortOrder, setSortOrder] = useState("asc")
  const [project, setProject] = useState([]);
  const token = localStorage.getItem('jwt')
  const [performance, setPerformance] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const fetchProject = async () => {
    setIsLoading(true)
    try {
      if (!token) {
        console.log("Phiên đăng nhập đã hết hạn")
      }
      const response = await axios.get(`http://localhost:1000/api/projects/owner/action`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log("Dữ liệu tải lên: ", response.data);
      setProject(response.data);
      setIsLoading(false)

    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error)
    }
  }

  const handleProjectChange = (projectId) => {
    setIsLoading(true);
    fetchMembers(projectId);
  }

  const fetchMembers = async (projectId) => {
    setIsLoading(true);
    try {
      if (!token) {
        console.log("Phiên đăng nhập đã hết hạn");
        return;
      }
      const response = await axios.get(`http://localhost:1000/api/projects/${projectId}/detailsMembers/machinelearning`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Dữ liệu thành viên tải lên: ", response.data);
      setPerformance(response.data);
      setSelectedProject(projectId);
      setCurrentPage(1);
      setSearchTerm("");
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProject();
  }, [token])

  const itemsPerPage = 10



  // const handleProjectChange = (projectId) => {
  //   setIsLoading(true)
  //   setTimeout(() => {
  //     setSelectedProject(projectId)
  //     setCurrentPage(1)
  //     setSearchTerm("")
  //     setIsLoading(false)
  //   }, 1000) // Simulate loading delay
  // }

  const currentProject = projectsData[selectedProject]

  const filteredAndSortedMembers = useMemo(() => {
    const teamMembersData = Array.isArray(performance.teamMembersData)
      ? performance.teamMembersData
      : []; // Nếu không phải là mảng, sử dụng mảng rỗng làm giá trị mặc định

    return teamMembersData
      .filter(member =>
        member.fullname.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [performance.teamMembersData, searchTerm, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedMembers.length / itemsPerPage)
  const paginatedMembers = filteredAndSortedMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const performanceOverTime = useMemo(() => {
    if (!performance.monthlyPerformance || typeof performance.monthlyPerformance !== 'object') {
      return [];  // Trả về mảng rỗng nếu dữ liệu không hợp lệ
    }
    return Object.entries(performance.monthlyPerformance).map(([month, performance]) => ({
      month,
      performance
    }))
  }, [performance.monthlyPerformance])


  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const exportToPDF = () => {
    // Tạo một instance mới của jsPDF với font mặc định là "helvetica"
    const doc = new jsPDF();

    // Thêm font Unicode
    doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');

    // Tiêu đề
    doc.setFontSize(18);
    doc.text(`Thống kê hiệu suất - ${performance.name}`, 14, 22);

    // Hiệu suất trung bình
    doc.setFontSize(14);
    doc.text(`Hiệu suất trung bình: ${performance.averagePerformance.toFixed(2)}%`, 14, 32);
    // doc.text(`Mean Squared Error: ${performance.meanSquaredError}`, 14, 42);

    // Bảng thành viên
    doc.autoTable({
      head: [['Tên', 'ID', 'Hiệu suất TB', 'Dự đoán', 'Ngày TB', 'Ưu tiên TB', 'Lương']],
      body: performance.teamMembersData.map(member => [
        member.fullname,
        member.teamMemberID,
        `${member.avgFinish}%`,
        `${member.predictedFinish}%`,
        member.avgDaysToComplete,
        member.avgPriority,
        member.totalSalary.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
      ]),
      startY: 52,
      styles: { font: 'Roboto', fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 60 }
    });

    // Lưu file PDF
    doc.save(`thong-ke-hieu-suat-${performance.name}.pdf`);
  };



  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Thống kê hiệu suất dự án</CardTitle>
        <CardDescription>Hiệu suất làm việc của các thành viên trong dự án</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <Select 
            // onValueChange={(value) => fetchMembers(value)}
            onValueChange={handleProjectChange}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Chọn dự án" />
              </SelectTrigger>
              <SelectContent>
                {project.map((item) => (
                  <SelectItem key={item.id} value={item.id} >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Tìm kiếm thành viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={exportToPDF}>Xuất PDF</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Hiệu suất trung bình</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {performance?.averagePerformance != null
                    ? `${performance.averagePerformance.toFixed(2)}%`
                    : 'Chưa chọn dự án'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Hiệu suất theo thời gian</CardTitle>
                <CardDescription>Biểu đồ thể hiện hiệu suất trung bình của dự án theo tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={performanceOverTime}>
                    <XAxis
                      dataKey="month"
                      tickFormatter={(value) => `Tháng ${value.split('-')[1]}`}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Hiệu suất"]}
                      labelFormatter={(label) => `Tháng ${label.split('-')[1]}/${label.split('-')[0]}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="performance"
                      stroke="#8884d8"
                      name="Hiệu suất trung bình"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("fullname")} className="cursor-pointer">Tên {sortBy === "fullname" && (sortOrder === "asc" ? "↑" : "↓")}</TableHead>
                <TableHead>Mã thành viên</TableHead>
                {/* <TableHead onClick={() => handleSort("avgFinish")} className="cursor-pointer">Hiệu suất TB (%) {sortBy === "avgFinish" && (sortOrder === "asc" ? "↑" : "↓")}</TableHead> */}
                <TableHead>Số lượng nhiệm vụ</TableHead>
                <TableHead onClick={() => handleSort("predictedFinish")} className="cursor-pointer">Dự đoán (%) {sortBy === "predictedFinish" && (sortOrder === "asc" ? "↑" : "↓")}</TableHead>
                <TableHead onClick={() => handleSort("avgDaysToComplete")} className="cursor-pointer">Ngày TB {sortBy === "avgDaysToComplete" && (sortOrder === "asc" ? "↑" : "↓")}</TableHead>
                <TableHead>Ưu tiên TB</TableHead>
                <TableHead>Lương</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMembers.map((member) => (
                <TableRow key={member.teamMemberID}>
                  <TableCell>{member.fullname}</TableCell>
                  <TableCell>Thành viên {member.teamMemberID}</TableCell>
                  {/* <TableCell>{member.avgFinish}%</TableCell> */}
                  <TableCell>{member.numIssues}</TableCell>
                  <TableCell>{member.predictedFinish}%</TableCell>
                  <TableCell>{member.avgDaysToComplete}</TableCell>
                  <TableCell>{member.avgPriority}</TableCell>
                  <TableCell>{member.totalSalary.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center">
            <div>
              Trang {currentPage} / {totalPages}
            </div>
            <div className="space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paginatedMembers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fullname" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="avgFinish" fill="#8884d8" name="Hiệu suất TB (%)" />
                <Bar yAxisId="right" dataKey="avgDaysToComplete" fill="#82ca9d" name="Số ngày TB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
      <LoadingPopup isOpen={isLoading} />
    </Card>
  )
}

