
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { BarChart, ChevronDown, Download, Eye } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

    const [projectId, setProjectId] = useState('');
    const [issueMembers, setIssueMembers] = useState('')

    const navigate = useNavigate();

    const fetchProject = async () => {
        try {
            if (!token) {
                console.log("Phiên đăng nhập đã hết hạn");
            }
            const response = await axios.get(`http://localhost:1000/api/projects/owner/action`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Dữ liệu tải lên: ", response.data);
            setproject(response.data);
        } catch (error) {
            console.log("Có lỗi xẩy ra trong quá trình tải dữ liệu", error)
        }
    }

    const fetchMembers = async(projectId) => {
        try{
            if(!token){
                console.log("Phiên đăng nhập đã hết hạn");
            }
            const response = await axios.get(`http://localhost:1000/api/projects/${projectId}/detailsMembers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Dữ liệu thành viên tải lên: ", response.data);
            setMembers(response.data);
            setProjectId(projectId);
        }catch(error){
            console.log("Có lỗi xẩy ra trong quá trình tải dữ liệu", error)
        }
    }

    useEffect(() => {
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

    

    
    
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-2xl font-bold">Thống kê chi tiêu từng thành viên</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Danh sách thành viên</h2>
              <Select onValueChange={(value) => fetchMembers(value)}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Chọn dự án" />
                </SelectTrigger>
                <SelectContent>
                  {project.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto">
              <Table>
              <TableCaption>Danh sách thành viên trong dự án</TableCaption>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="font-bold">ID</TableHead>
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
                  {members.teamMembers?.map((member) => (
                    <TableRow key={member.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>{project?.id}</TableCell>
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
                        
                        onClick = {() => HandlerOnClick(member.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem thống kê
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
}

export default MemberInformation
