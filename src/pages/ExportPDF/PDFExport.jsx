
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { Calendar, DollarSign, Download, Tag, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { usePDF } from 'react-to-pdf';

const pdfStyles = `
@media print {
  @page {
    margin: 1.5cm 1.5cm 2.5cm 1.5cm;
    size: A4;
  }

  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  * {
    box-sizing: border-box;
  }

  .pdf-container {
    padding: 20px;
    font-family: Arial, sans-serif;
    line-height: 1.5;
  }
  
  .pdf-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    color: rgba(0, 0, 0, 0.1);
    text-align: center;
    z-index: -1; /* Đảm bảo rằng watermark luôn ở phía dưới các phần tử khác */
}

  
  .pdf-header {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .pdf-content {
    margin-top: 20px;
    font-size: 12pt;
  }
  
  .pdf-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .pdf-table th, .pdf-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  .pdf-table th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  

  .pdf-badge {
    display: inline-block;
    padding: 0.1cm 0.2cm;
    border-radius: 0.1cm;
    font-size: 8pt;
    font-weight: bold;
  }

  .pdf-badge-high {
    background-color: #fee2e2 !important;
    color: #dc2626 !important;
  }

  .pdf-badge-low {
    background-color: #f3f4f6 !important;
    color: #374151 !important;
  }

  .pdf-badge-paid {
    background-color: #d1fae5 !important;
    color: #047857 !important;
  }

  .pdf-badge-unpaid {
    background-color: #fef3c7 !important;
    color: #92400e !important;
  }

  .pdf-summary-item {
    background-color: #f3f4f6 !important;
    padding: 0.3cm;
    border-radius: 0.2cm;
  }

  .pdf-footer {
    position: fixed;
    bottom: 1cm;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 8pt;
    color: #666;
    border-top: 1px solid #000;
    padding-top: 0.3cm;
    margin: 0 1.5cm;
  }
}
`
const imageBase64 = "https://firebasestorage.googleapis.com/v0/b/pms-fe88f.appspot.com/o/files%2FBlack%20and%20White%20Auto%20Repair%20Logo%20(1).png?alt=media&token=5cbbc329-d36f-46e1-8526-53d6e2f11699";

const PDFExport = () => {
    const token = localStorage.getItem('jwt');
    const { projectId } = useParams();
    const [PDFInformation, setPDFInformation] = useState([]);
    const [base64Image, setBase64Image] = useState(null);

    // Fetching project data
    const fetchPDFExport = async () => {
        try {
            const response = await axios.get(`http://localhost:1000/api/projects/${projectId}/Export/PDF`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPDFInformation(response.data);
        } catch (error) {
            console.log("Error fetching data", error);
        }
    };

    const toBase64 = async (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Điều này có thể giúp với CORS
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL());
            };
            img.onerror = reject;
            img.src = url;
        });
    };
    const loadImage = async () => {
        try {
            const base64 = await toBase64(imageBase64);
            setBase64Image(base64);  // Lưu base64 image vào state
            setLoading(false);
        } catch (error) {
            console.error('Error loading image', error);
        }
    };

    // Loading the image and converting it to base64
    useEffect(() => {
        fetchPDFExport();
        loadImage();
    }, [projectId]);

    console.log("hinh", imageBase64)

    const { toPDF, targetRef } = usePDF({
        filename: `${PDFInformation?.project?.name || 'report'}_report.pdf`,
        page: {
            format: 'A4',
            orientation: 'portrait',
            margin: 20
        },
        method: 'save',
        //     scale: 1,
        // resolution: 300,
        // canvas: {
        //     mimeType: 'image/jpeg',
        //     qualityRatio: 1
        // },
        // images: base64Image ? [base64Image] : [],
        // onRender: () => {
        //     // If using jsPDF, make sure to specify image type
        //     if (base64Image) {
        //         pdf.addImage(base64Image, 'PNG', 10, 10, 100, 100);
        //     }
        // }
    });

    // Format currency
    const formatCurrency = (amount) => {
        if (amount === null) return 'Chưa có thông tin';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };



    return (
        <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
            <style>{pdfStyles}</style>
            <div className="max-w-5xl mx-auto mb-8">


                <div ref={targetRef} className="space-y-8 text-gray-900 pdf-container">
                    <div className="pdf-watermark absolute inset-0 pointer-events-none z-0">
                        <img
                            src={imageBase64}
                            alt="Watermark Logo"
                            className="w-64 h-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-gray-300 opacity-30 whitespace-nowrap"
                        />
                        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-gray-300 opacity-30 whitespace-nowrap">
                            Hệ thống quản lý dự án © 2024 Tài Nguyễn
                        </p>
                    </div>
                    <Card>
                        <CardHeader>
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

                            <h1 className="text-4xl font-bold text-gray-800 mb-2">{PDFInformation.project?.name}</h1>
                            <p className="text-gray-600 mb-4">{PDFInformation.project?.description}</p>
                            <CardDescription>Chi tiết và số liệu chính</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Tag className="h-5 w-5 mr-2 text-blue-500" />
                                        <span className="font-medium">Thể loại:</span>
                                        <span className="ml-2">{PDFInformation.project?.category}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-5 w-5 mr-2 text-green-500" />
                                        <span className="font-medium">Chủ sở hữu:</span>
                                        <span className="ml-2">{PDFInformation.project?.owner?.fullname}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                                        <span className="font-medium">Thời gian hoạt động:</span>
                                        <span className="ml-2">{PDFInformation.project?.createdDate} đến {PDFInformation.project?.endDate}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <DollarSign className="h-5 w-5 mr-2 text-yellow-500" />
                                        <span className="font-medium">Tiền cấp cho dự án:</span>
                                        <span className="ml-2">{formatCurrency(PDFInformation.project?.fundingAmount)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                                        <span className="font-medium">Tiền lãi:</span>
                                        <span className="ml-2">{formatCurrency(PDFInformation.project?.profitAmount)}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Tags:</span>
                                        <div className="mt-1">
                                            {PDFInformation.project?.tags?.map(tag => (
                                                <Badge key={tag} variant="secondary" className="mr-1">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-600">{PDFInformation.description}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Nhiệm vụ và mức lương</CardTitle>
                            <CardDescription>Chi tiết các nhiệm vụ, mức lương và thực hưởng trong dự án</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên nhiệm vụ</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Độ ưu tiên</TableHead>
                                        <TableHead>Người được giao</TableHead>
                                        <TableHead>Lương thực hưởng</TableHead>
                                        <TableHead>Thanh toán</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {PDFInformation.issueWithSalaries?.map(({ issue, salaries }) => (
                                        <TableRow key={issue.id}>
                                            <TableCell className="font-medium">{issue.title}</TableCell>
                                            <TableCell>{issue.status}</TableCell>
                                            <TableCell>
                                                <Badge variant={issue.priority === 'High' ? "destructive" : issue.priority === 'Medium' ? "secondary" : "neutral"}>
                                                    {issue.priority === 'High' ? 'Cao' : issue.priority === 'Medium' ? 'Bình thường' : 'Thấp'}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>{issue.assignee?.fullname}</TableCell>
                                            <TableCell>
                                                {salaries.map(salary => (
                                                    <div key={salary.id}>
                                                        {salary.salary.toLocaleString()} {salary.currency}
                                                    </div>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                {salaries.map(salary => (
                                                    <Badge key={salary.id} variant={salary.paid ? "success" : "outline"}>
                                                        {salary.paid ? 'Paid' : 'Unpaid'}
                                                    </Badge>
                                                ))}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tóm tắt tài chính</CardTitle>
                            <CardDescription>Tổng quan về tài chính trong dự án</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-blue-700 mb-2">Tổng tài trợ</h3>
                                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(PDFInformation.project?.fundingAmount)}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-green-700 mb-2">Tổng lợi nhuận</h3>
                                    <p className="text-2xl font-bold text-green-900">{formatCurrency(PDFInformation.project?.profitAmount)}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-purple-700 mb-2">Tỷ suất lợi nhuận</h3>
                                    <p className="text-2xl font-bold text-purple-900">{((PDFInformation.project?.profitAmount / PDFInformation.project?.fundingAmount) * 100).toFixed(2)}%</p>
                                </div>
                            </div>
                        </CardContent>



                    </Card>

                    <footer className="text-center text-gray-500 text-sm mt-8">
                        <p>Thống kê ngày {new Date().toLocaleDateString()} | {PDFInformation.project?.name}</p>
                    </footer>
                </div>
                <div className="mt-4 mx-auto p-10 shadow-lg">
                    <Button onClick={() => toPDF()} style={{ width: '100%' }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Tải xuống PDF
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PDFExport

