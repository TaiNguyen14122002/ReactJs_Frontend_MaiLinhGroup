import { deleteProject } from '@/Redux/Project/Action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { CalendarIcon, ClockIcon, RefreshCw, Search, TagIcon, Trash2, UserIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const ProjectDeleted = () => {
  const [listProjectDeleted, setListProjectDeleted] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
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

  const handleRestore = async (projectId) => {
    console.log("projectId", projectId);
    try {
      if (!token) {
        console.log("Phiên đăng nhập đã hết hạn");
        return; // Dừng nếu không có token
      }
  
      const response = await axios.put(`http://localhost:1000/api/projects/${projectId}/update-action-deleted?action=0`, 
        {},  // Không cần gửi body dữ liệu ở đây
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("done", response.data); // In dữ liệu phản hồi từ server nếu cần
      setListProjectDeleted((prevList) =>
      prevList.filter((project) => project.id !== projectId)
    );
  
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình thực hiện dữ liệu", error.response ? error.response.data : error.message);
    }
  };
  

  const handleDelete = (projectId) => {
    dispatch(deleteProject({ projectId }));
    toast.success(
      "Bạn đã xoá dự án thành công"
    )
    setListProjectDeleted((prevList) =>
      prevList.filter((project) => project.id !== projectId)
    );
  };

  const filteredProjects = listProjectDeleted.filter(project =>
    (project.name && project.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (project.category && project.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (project.owner && project.owner.fullname && project.owner.fullname.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (

    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <main className="flex-grow flex items-stretch p-4 sm:p-6 lg:p-8">
        <Card className="w-full">
          <CardHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
            <CardTitle className="text-2xl font-bold text-white">Kế hoạch đã xoá</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên kế hoạch"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên kế hoạch</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Ngày kết thúc</TableHead>
                    <TableHead>Chủ sỡ hữu</TableHead>
                    <TableHead>Thể loại </TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => {
                    return (
                      <TableRow key={project.id} className="hover:bg-muted/50 transition-colors">
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
                            <Button onClick={() => handleRestore(project.id)} variant="outline" size="sm">
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Khôi phục
                            </Button>
                            <Button onClick={() => handleDelete(project.id)} variant="destructive" size="sm">
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
