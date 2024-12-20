import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import IssueCard from './IssueCard';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import CreateIssueForm from './CreateIssueForm';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchIssues } from '@/Redux/Issue/Action';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { cn } from '@/lib/utils';

const IssueList = ({ title, status }) => {
    const dispatch = useDispatch();
    const { issue } = useSelector(store => store);
    const { id } = useParams();
    const navigate = useNavigate(); // Khởi tạo useNavigate

    useEffect(() => {
        dispatch(fetchIssues(id));
    }, [id, dispatch]);

    const handleRowClick = (itemId, projectId) => {
        navigate(`/project/${projectId}/issue/${itemId}`); // Chuyển hướng đến trang chi tiết của nhiệm vụ
    };

    const formatPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });

    return (
        <div className='w-full'>
            <Dialog >
                <Card className="w-full" >
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                    </CardHeader>

                    <CardContent className="px-2">
                        <Table className="min-w-full border-collapse">
                            <TableHead className={cn(
                                                status === "Chưa làm" && "bg-red-50",
                                                status === "Đang làm" && "bg-blue-50",
                                                status === "Hoàn thành" && "bg-green-50"
                                            )}>
                                <TableRow>
                                    <TableCell className="border px-4 py-2 text-left">STT</TableCell>
                                    <TableCell className="border px-4 py-2 text-left">Tiêu đề</TableCell>
                                    <TableCell className="border px-4 py-2 text-left">Mô tả</TableCell>
                                    <TableCell className="border px-4 py-2 text-left">Ngày hết hạn</TableCell>
                                    <TableCell className="border px-4 py-2 text-left">Ưu tiên</TableCell>
                                    <TableCell className="border px-4 py-2 text-left">Lương</TableCell>
                                    <TableCell className="border px-4 py-2 text-left">Nhiệm vụ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {issue.issues
                                    .filter(issue => issue.status === status)
                                    .map((item, index) => (
                                        <TableRow className={cn(
                                            status === "Chưa làm" && "bg-red-50",
                                            status === "Đang làm" && "bg-blue-50",
                                            status === "Hoàn thành" && "bg-green-50"
                                        )}
                                             key={item.id} onClick={() => handleRowClick(item.id, id)} style={{ cursor: 'pointer' }} >
                                            <TableCell className="border px-4 py-2">{index + 1}</TableCell>
                                            <TableCell className="border px-4 py-2">{item.title}</TableCell>
                                            <TableCell className="border px-4 py-2">{item.description}</TableCell>
                                            <TableCell className="border px-4 py-2">
                                                {new Date(item.dueDate).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell className="border px-4 py-2">{item.priority}</TableCell>
                                            <TableCell className="border px-4 py-2">{formatPrice.format(item.price)}</TableCell>
                                            <TableCell className="border px-4 py-2" onClick={(event) => event.stopPropagation()}>
                                                <IssueCard projectId={id} item={item} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </CardContent>

                    <CardFooter>
                        <DialogTrigger>
                            <Button variant="outline" className="w-full text-white flex items-center gap-2 bg-blue-500">
                                <PlusIcon color='white' />
                                Thêm tác vụ
                            </Button>
                        </DialogTrigger>
                    </CardFooter>
                </Card>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                    </DialogHeader>
                    <CreateIssueForm status={status} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default IssueList;
