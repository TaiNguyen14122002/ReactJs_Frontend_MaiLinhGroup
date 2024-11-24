import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';


const PDFMenberInformation = () => {

  const token = localStorage.getItem('jwt');
  const { projectId, issueId } = useParams();
  const [project, setProject] = useState([])
  const [selectedmemberId, setSelectedMemberId] = useState(issueId)
  const [searchTerm, setSearchTerm] = useState("")
  const contentRef = useRef(null);

  const selectedMember = project?.teamMembers?.find(member => member.id === Number(selectedmemberId))

  const filteredIssues = selectedMember ? selectedMember.issues.filter(issue =>
    issue.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleDownloadPDF = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
      })
      const imgData = canvas.toDataURL('image/jpeg', 1.0)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10

      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`${project?.name}_${selectedMember?.fullname}.pdf`)
    }
  }

  const fetchData = async () => {
    try {
      if (!token) {
        console.log("Phiên đăng nhập đã hết hạn");
      }
      const response = await axios.get(`http://localhost:1000/api/projects/${projectId}/detailsMembers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Dữ liệu tải được: ", response.data)
      setProject(response.data)
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error)
    }
  }

  console.log("issueId", selectedmemberId)
  console.log("selectMember", selectedMember)

  useEffect(() => {
    fetchData();
  }, [projectId, issueId])

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('vi-VN', options);
  };

  return (

    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[21cm] mx-auto p-10 shadow-lg" ref={contentRef}>
        {/* Header */}
        <header className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/pms-fe88f.appspot.com/o/files%2FBlack%20and%20White%20Auto%20Repair%20Logo%20(1).png?alt=media&token=5cbbc329-d36f-46e1-8526-53d6e2f11699"
                alt="Company Logo"
                className="w-12 h-12 object-contain"
              />
              <h1 className="text-3xl font-bold text-gray-900 opacity-25">Hệ thống quản lý dự án phần mềm</h1>
            </div>

          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">{project.name}</h1>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags?.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Ngày bắt đầu: {formatDate(project.createdDate)}</p>
              <p className="text-sm text-gray-600">Ngày kết thúc: {formatDate(project.endDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Trạng thái: {project.status === 'done' ? 'Hoàn thành' : 'Chưa hoàn thành'}
              </p>
              <p className="text-sm text-gray-600">Danh mục: {project.category}</p>
            </div>
          </div>
        </header>

        {/* Project Overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tổng quan dự án</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Số tiền đầu tư</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {/* {project.fundingAmount} VND */}
                  {Number(project.fundingAmount).toLocaleString()} VND
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lợi nhuận dự kiến</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {/* {project.profitAmount} VND */}
                  {Number(project.profitAmount).toLocaleString()} VND
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Members and Tasks */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nhiệm vụ và tổng lương thành viên {selectedMember?.fullname} </h2>

          <Card className="mb-6">
            <CardHeader>

            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhiệm vụ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Độ ưu tiên</TableHead>
                    <TableHead className="text-right">Lương (VND)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.title}</TableCell>
                      <TableCell>{member.status}</TableCell>
                      <TableCell>

                        {member.priority === 'High' ? 'Cao' : member.priority === 'Medium' ? 'Bình thường' : 'Thấp'}

                      </TableCell>

                      <TableCell className="text-right">{Number(member.salary).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}

                  {selectedMember && (
                    <TableRow>
                      <TableCell colSpan={3} className="font-semibold">Tổng lương</TableCell>
                      <TableCell className="text-right font-semibold">{selectedMember.totalSalaryIssue.toLocaleString()} VND</TableCell>
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </CardContent>
          </Card>
          <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
            <div className="transform">
              <h2 className="text-3xl font-bold text-gray-900">{project.name}</h2>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/pms-fe88f.appspot.com/o/files%2FBlack%20and%20White%20Auto%20Repair%20Logo%20(1).png?alt=media&token=5cbbc329-d36f-46e1-8526-53d6e2f11699"
                alt="TaiNguyen Logo"
                width={250}
                height={250}
                className="object-contain mx-auto"
              />
            </div>
          </div>



        </section>

        <footer className="text-center text-gray-500 text-sm mt-8">
          <p>Thống kê ngày {new Date().toLocaleDateString()} | {project.name}</p>
        </footer>


      </div>
      <div className="mt-4 max-w-[21cm] mx-auto p-10 shadow-lg">
        <Button onClick={handleDownloadPDF} style={{ width: '100%' }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Tải xuống PDF
        </Button>
      </div>

    </div>


  )
}

export default PDFMenberInformation
