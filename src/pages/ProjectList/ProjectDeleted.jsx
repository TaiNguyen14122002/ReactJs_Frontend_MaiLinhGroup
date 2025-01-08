import { deleteProject } from '@/Redux/Project/Action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, ClockIcon, Edit, Eye, Plus, RefreshCw, Search, TagIcon, Trash2, UserIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LoadingPopup } from '../Performance/LoadingPopup'
import { Toast } from '@/components/ui/toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const ProjectDeleted = () => {

  const [sortKey, setSortKey] = useState('recId')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [activeFilter, setActiveFilter] = useState('all')

  const [branchData, setBranch] = useState([]);
  const token = localStorage.getItem('jwt')

  const [createdDateFilter, setCreatedDateFilter] = useState(null)
  const [updatedDateFilter, setUpdatedDateFilter] = useState(null)

  const [editingBranch, setEditingBranch] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [newBranch, setNewBranch] = useState({ branchName: '', isActive: true, province: '' })

  const handleEditClick = (branch) => {
    setEditingBranch(branch)
    setIsEditModalOpen(true)
  }

  const handleEditSave = async (updatedBranch) => {
    const updatedBranches = branchData.map(branch =>
      branch.branchId === updatedBranch.branchId ? updatedBranch : branch
    )
    // setBranch(updatedBranches)
    setIsEditModalOpen(false)
    console.log("taaf", editingBranch.isActive)

    try {
      const requestBody = {
        branchName: editingBranch.branchName,
        isActive: editingBranch.isActive
      }
      const response = await axios.put(
        `http://localhost:2000/api/branch/${editingBranch.branchId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Cập nhật chi nhánh thành công:", response.data);
    } catch (error) {
      console.error("Có lỗi xảy ra trong quá trình tải dữ liệu:", error.message);
      if (error.response) {
        // Server trả về mã lỗi cụ thể
        console.error("Chi tiết lỗi:", error.response.data);
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        console.error("Không nhận được phản hồi từ server:", error.request);
      } else {
        // Lỗi xảy ra trong quá trình thiết lập yêu cầu
        console.error("Lỗi trong quá trình thiết lập yêu cầu:", error.message);
      }
    }
  }

  const fetchBranch = async () => {
    try {

      const response = await axios.get(`http://localhost:2000/api/branch/show`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBranch(response.data);

    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error)
    }
  }

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  useEffect(() => {
    fetchBranch();
  }, [token, branchData, sortKey, sortOrder, searchTerm, selectedProvince, activeFilter, createdDateFilter, updatedDateFilter])

  const sortedAndFilteredData = useMemo(() => {
    return [...branchData]
      .sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      })
      .filter(branch =>
        (!searchTerm || branch.branchName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!selectedProvince || branch.branchName.toLowerCase().includes(selectedProvince.toLowerCase())) &&
        (activeFilter === 'all' || (activeFilter === 'True' && branch.isActive) || (activeFilter === 'False' && !branch.isActive)) &&
        (!updatedDateFilter || new Date(branch.updatedDate).getMonth() === updatedDateFilter.getMonth() && new Date(branch.updatedDate).getFullYear() === updatedDateFilter.getFullYear())
      );
  }, [branchData, sortKey, sortOrder, searchTerm, selectedProvince, activeFilter, createdDateFilter, updatedDateFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedAndFilteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedAndFilteredData, currentPage, searchTerm, selectedProvince])

  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage)

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const provinces = [
    "Hà Nội", "Hồ Chí Minh", "Hải Phòng", "Đà Nẵng", "Cần Thơ",
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
    "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
    "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
    "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
    "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
    "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
    "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
    "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
    "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
    "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang",
    "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
  ];




  const filteredProvinces = provinces.filter(province =>
    province.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddSave = () => {
    const currentDate = new Date().toISOString().split('T')[0]
    const newBranchWithId = {
      ...newBranch,
      branchId: (branches.length + 1).toString(),
      createdDate: currentDate,
      updatedDate: currentDate
    }
    setBranches([...branches, newBranchWithId])
    setIsAddModalOpen(false)
    setNewBranch({ branchName: '', isActive: true, province: '' })
  }

  const handleDeteled = () => {
    toast.success('Nút xoá chưa làm')
  }


  return (

    <div className="">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Danh sách chi nhánh</CardTitle>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Thêm chi nhánh mới
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc ID"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value); // Cập nhật giá trị tìm kiếm
                  if (e.target.value) {
                    setSelectedProvince(null); // Xóa giá trị tỉnh/thành phố khi người dùng nhập tìm kiếm
                  }
                }}
                className="w-full"
              />
            </div>
            <Select value={selectedProvince} onValueChange={(value) => {
              setSelectedProvince(value); // Cập nhật giá trị tỉnh/thành phố
              if (value) {
                setSearchTerm(''); // Xóa giá trị tìm kiếm khi người dùng chọn tỉnh/thành phố
              }
            }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Chọn tỉnh/thành phố" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="" disabled>
                  Chọn tỉnh/thành phố
                </SelectItem> */}
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={activeFilter}
              onValueChange={setActiveFilter}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái hoạt động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Lọc theo trạng thái</SelectItem>
                <SelectItem value="True">Đang hoạt động</SelectItem>
                <SelectItem value="False">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {updatedDateFilter ? format(updatedDateFilter, 'MM/yyyy') : 'Lọc theo thời gian cập nhật'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={updatedDateFilter}
                  onSelect={setUpdatedDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên chi nhánh</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Cập nhật lần cuối</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((branch) => (
                  <TableRow key={branch.branchId}>
                    <TableCell className="font-medium">{branch.branchName}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${branch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {branch.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(branch.createdDate)}</TableCell>
                    <TableCell>{formatDate(branch.updatedDate)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditClick(branch)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleDeteled}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị {paginatedData.length} trên tổng số {sortedAndFilteredData.length} chi nhánh
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>
              <p className="text-sm font-medium">
                Trang {currentPage} / {totalPages}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa chi nhánh</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi nhánh tại đây. Nhấn lưu khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          {editingBranch && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="branchName" className="text-right">
                  Tên chi nhánh
                </Label>
                <Input
                  id="branchName"
                  value={editingBranch.branchName}
                  onChange={(e) => setEditingBranch({ ...editingBranch, branchName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Trạng thái
                </Label>
                <Switch
                  id="isActive"
                  checked={editingBranch.isActive}
                  onCheckedChange={(checked) => setEditingBranch({ ...editingBranch, isActive: checked })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={() => handleEditSave(editingBranch)}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Branch Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Thêm chi nhánh mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin chi nhánh mới tại đây. Nhấn thêm mới khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newBranchName" className="text-right">
                Tên chi nhánh
              </Label>
              <Input
                id="newBranchName"
                value={newBranch.branchName}
                onChange={(e) => setNewBranch({ ...newBranch, branchName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newBranchProvince" className="text-right">
                Tỉnh/Thành phố
              </Label>
              <Select
                value={newBranch.province}
                onValueChange={(value) => setNewBranch({ ...newBranch, province: value })}
              >
                <SelectTrigger className="w-[180px] col-span-3">
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newBranchIsActive" className="text-right">
                Trạng thái
              </Label>
              <Switch
                id="newBranchIsActive"
                checked={newBranch.isActive}
                onCheckedChange={(checked) => setNewBranch({ ...newBranch, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddSave}>Thêm mới</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>


  )
}

export default ProjectDeleted
