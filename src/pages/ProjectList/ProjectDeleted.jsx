import { deleteProject } from '@/Redux/Project/Action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { CalendarIcon, ClockIcon, RefreshCw, TagIcon, Trash2, UserIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const ProjectDeleted = () => {
  const [listProjectDeleted, setListProjectDeleted] = useState([])
  const token = localStorage.getItem('jwt')
  const dispatch = useDispatch();


  const fetchProjectDeleted = async () => {
    if (!token) {
      console.log("Người dùng không tồn tại");
    }
    try {
      const response = await axios.get(`http://localhost:1000/api/projects/Projectsdeleted`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      console.log("Dự án đã xoá", response.data);
      
      setListProjectDeleted(response.data);

    } catch (error) {
      console.log("Xẫy ra lỗi trong quá trình load dữ liệu")
    }
  }

  useEffect(() => {
    fetchProjectDeleted();
    return;
  }, [])

  const handleDelete = (projectId) => {
    dispatch(deleteProject({ projectId }));
    toast.success(
      "Bạn đã xoá dự án thành công"
    )
    fetchProjectDeleted();
};
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý kế hoạch đã xoá</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Danh sách kế hoạch đã xoá</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Tên kế hoạch</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Ngày kết thúc</TableHead>
                    <TableHead>Chủ sỡ hữu</TableHead>
                    <TableHead>Thể loại </TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {listProjectDeleted.map((project) => {
                    return (
                      <TableRow key={project.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{project.id}</TableCell>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {project.createdDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {project.endDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {project.owner.fullname}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <TagIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {project.category}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Khôi phục
                            </Button>
                            <Button onClick={() => handleDelete(project.id)}  variant="destructive" size="sm">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </Button>
                          </div>
                        </TableCell>



                      </TableRow>

                    )

                  })}
                </TableBody>

              </Table>

            </div>
          </CardContent>

        </Card>

      </main>

    </div>

  )
}

export default ProjectDeleted
