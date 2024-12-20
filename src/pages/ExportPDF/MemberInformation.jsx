
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { BarChart, ChevronDown, Download, Eye, InboxIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingPopup } from '../Performance/LoadingPopup'

const tasks = [
  {
    id: 2152,
    title: "TaiNguyen",
    completionRate: "20%",
    priority: "Cao",
    startDate: "22/11/2024",
    endDate: "29/11/2024",
    assignedTo: "NguyenVanTai",
    compensation: "400.000 ₫",
    paymentStatus: "Chưa thanh toán",
    expenses: [
      { id: 1, description: "Văn phòng phẩm", amount: "50.000 ₫", date: "23/11/2024" },
      { id: 2, description: "Đi lại", amount: "100.000 ₫", date: "24/11/2024" },
    ]
  },
  {
    id: 2153,
    title: "ueulfkbaqdf",
    completionRate: "100%",
    priority: "Thấp",
    startDate: "22/11/2024",
    endDate: "29/11/2024",
    assignedTo: "NguyenVanTai",
    compensation: "3.000.000 ₫",
    paymentStatus: "Chưa thanh toán",
    expenses: [
      { id: 3, description: "Thiết bị", amount: "500.000 ₫", date: "25/11/2024" },
      { id: 4, description: "Phần mềm", amount: "200.000 ₫", date: "26/11/2024" },
    ]
  }
]

const MemberInformation = () => {
  const [project, setproject] = useState([]);
  const [members, setMembers] = useState([]);
  const token = localStorage.getItem('jwt');

  const [isOpen, setIsOpen] = useState(false)

  const [projectId, setProjectId] = useState('');
  const [issueMembers, setIssueMembers] = useState('')

  const navigate = useNavigate();

  const fetchProject = async () => {
    setIsOpen(true)
    try {
      if (!token) {
        console.log("Phiên đăng nhập đã hết hạn");
      }
      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/owner/action`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Dữ liệu tải lên: ", response.data);
      setproject(response.data);
      setIsOpen(false)
    } catch (error) {
      console.log("Có lỗi xẩy ra trong quá trình tải dữ liệu", error)
    }
  }

  const fetchMembers = async (projectId) => {
    setIsOpen(true)
    try {
      if (!token) {
        console.log("Phiên đăng nhập đã hết hạn");
      }
      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/${projectId}/detailsMembers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Dữ liệu thành viên tải lên: ", response.data);
      setMembers(response.data);
      setProjectId(projectId);
      setIsOpen(false)
    } catch (error) {
      console.log("Có lỗi xẩy ra trong quá trình tải dữ liệu", error)
    }
  }

  useEffect(() => {
    setIsOpen(true)
    fetchProject();

  }, [token])

  const HandlerOnClick = (IssueId) => {
    navigate(`/members/PDF/project/${projectId}/issue/${IssueId}`);
    console.log("ID Dự án và ID nhiệm vụ:  ", projectId, IssueId)
  }



  const formatCurrency = (amount) => {
    if (amount === null) return 'Chưa có thông tin'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }


  const [searchTerm, setSearchTerm] = useState('')

  const filteredProjects = project.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )





  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-2xl text-white font-bold">Thống kê chi tiêu từng thành viên</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Danh sách thành viên</h2>
            <Select onValueChange={(value) => fetchMembers(value)}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Chọn dự án" />
              </SelectTrigger>
              <SelectContent>
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
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Danh sách thành viên trong dự án</TableCaption>
              <TableHeader>
                <TableRow className="bg-gray-100">

                  <TableHead className="font-bold cursor-pointer" >Tên thành viên</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">Số điện thoại</TableHead>
                  <TableHead className="font-bold">Tên công ty</TableHead>
                  <TableHead className="font-bold">Hình thức làm việc</TableHead>
                  <TableHead className="font-bold">Số lượng nhiệm vụ</TableHead>
                  <TableHead className="font-bold">Thực hưởng</TableHead>
                  <TableHead className="font-bold">Tải về</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.teamMembers?.length > 0 ? (
                  members.teamMembers?.map((member) => (
                    <TableRow key={member.id} className="hover:bg-gray-50 transition-colors">

                      <TableCell className="font-medium">{member.fullname}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>{member.company}</TableCell>
                      <TableCell>{member.programerposition}</TableCell>
                      <TableCell className="text-center">{member.issues.length}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 font-semibold">
                          {formatCurrency(member.totalSalaryIssue)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          //   onClick={() => navigate(`/project/PDF/Information/${project.id}`)}

                          onClick={() => HandlerOnClick(member.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem thống kê
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <InboxIcon className="h-8 w-8 mb-2" />
                        <p>Không có dữ liệu</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )
                }
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <LoadingPopup isOpen={isOpen} />
      </Card>
    </div>
  )
}

export default MemberInformation
