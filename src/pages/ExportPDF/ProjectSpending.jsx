import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { Download, InboxIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingPopup } from '../Performance/LoadingPopup'

const ProjectSpending = () => {
    const token = localStorage.getItem('jwt')
    const [projectspending, setProjectSpending] = useState([]);

    const[isOpen, setIsOpen] = useState(false)

    const navigate = useNavigate();

    const fetchProjectSpending = async () => {
        setIsOpen(true)
        try {
            if (!token) {
                console.log("Phiên đăng nhập đã kết thúc")
            }
            const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/projects/owner/statistical`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Chi tiêu dự án", response.data);
            setProjectSpending(response.data)
            setIsOpen(false)
        } catch (error) {
            console.log("Có lỗi xảy ra trong quá trình thực hiện dữ liệu", error)
        }
    }

    useEffect(() => {
        setIsOpen(true)
        fetchProjectSpending();
    }, [token])

    console.log("hihi", projectspending)

    const formatCurrency = (amount) => {
        if (amount === null) return 'Chưa có thông tin'
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Card className="flex-grow flex flex-col m-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Thống kê chi tiêu dự án làm chủ</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-auto">
                    <Table>
                        {/* <TableCaption>Chi tiêu trong dự án</TableCaption> */}
                        <TableHeader>

                            <TableRow>
                                <TableHead className="w-[250px]">Dự án</TableHead>
                                <TableHead>Số lượng thành viên</TableHead>
                                <TableHead>Số lượng nhiệm vụ</TableHead>
                                <TableHead>Số tiền tài trợ</TableHead>
                                <TableHead>Số tiền lợi nhuận</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Tải về</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projectspending.length > 0 ? (
                                projectspending.map((project, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{project.projectName}</TableCell>
                                        <TableCell>{project.teamMembers.length}</TableCell>
                                        <TableCell>{project.issues.length}</TableCell>
                                        <TableCell>{formatCurrency(project.fundingAmount)}</TableCell>
                                        <TableCell className={project.profitAmount && project.profitAmount < 0 ? "text-red-500" : "text-green-500"}>
                                            {formatCurrency(project.profitAmount)}
                                        </TableCell>
                                        <TableCell>{project.projectStatus === 'done' ? 'Hoàn thành' : 'Chưa hoàn thành'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => navigate("/project/PDF/Information/" + project.id)}>
                                                <Download className="h-4 w-4" />
                                                <span className="sr-only">Tải về thông tin dự án {project.projectName}</span>
                                            </Button>
                                        </TableCell>

                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-4">
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
                </CardContent>
                <LoadingPopup isOpen={isOpen}/>
            </Card>
        </div>
    )
}

export default ProjectSpending

