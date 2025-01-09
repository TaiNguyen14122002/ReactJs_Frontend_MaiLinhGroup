import { deleteProject } from '@/Redux/Project/Action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { AlignJustify, Building2Icon, CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, ClockIcon, Edit, Eye, Filter, MapPinIcon, Plus, RefreshCw, Search, TagIcon, Trash2, UserIcon, X } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'

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
  const [detailsBranch, setDetailBranch] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const [newBranch, setNewBranch] = useState({ branchName: '', isActive: true, province: '' })

  const handleEditClick = (branch) => {
    setEditingBranch(branch)
    setIsEditModalOpen(true)
  }

  const handleDetailsClick = (branch) => {
    setDetailBranch(branch)
    setIsDetailsModalOpen(true)

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

  const formatDatee = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  const formatStatus = (isActive) => {
    return isActive ? "Hoạt động" : "Không hoạt động";
  }

  const extractAddress = (branchName) => {
    if (branchName) { // Kiểm tra nếu branchName không null hoặc undefined
      const words = branchName.trim().split(' '); // Loại bỏ khoảng trắng thừa trước khi tách
      if (words.length >= 2) {
        return words.slice(-2).join(' '); // Lấy 2 từ cuối cùng
      }
      return branchName; // Trường hợp không đủ 2 từ, trả về toàn bộ chuỗi
    }
    return ''; // Trường hợp branchName là null hoặc undefined, trả về chuỗi rỗng
  };


  const DetailItem = ({ icon, label, value }) => {
    return (
      <div className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        {icon}
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h3>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    );
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedProvince(null)
    setActiveFilter('all')
    setUpdatedDateFilter(null)
  }






  return (

    <div className="">
      <Card className="w-full shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-green-500 text-white rounded-t-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <CardTitle className="text-2xl text-white font-bold">Danh sách chi nhánh</CardTitle>
          <Button onClick={handleAddClick} className="bg-white text-blue-500 hover:bg-blue-100">
            <Plus className="mr-2 h-4 w-4" /> Thêm chi nhánh mới
          </Button>
        </div>
      </CardHeader>
        <CardContent className="pt-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc ID"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                if (e.target.value) setSelectedProvince(null)
              }}
              className="pl-10 w-full"
            />
          </div>
          <Select value={selectedProvince || ''} onValueChange={(value) => {
            setSelectedProvince(value)
            if (value) setSearchTerm('')
          }}>
            <SelectTrigger className="w-full md:w-[200px]">
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
          <Select
            value={activeFilter}
            onValueChange={setActiveFilter}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Trạng thái hoạt động" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="True">Đang hoạt động</SelectItem>
              <SelectItem value="False">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                {updatedDateFilter ? format(updatedDateFilter, 'MM/yyyy') : 'Lọc theo thời gian'}
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

          <Button variant="outline" onClick={clearAllFilters} className="w-full md:w-auto">
            <X className="mr-2 h-4 w-4" />
            Xóa bộ lọc
          </Button>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="font-semibold">Tên chi nhánh</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="font-semibold">Ngày tạo</TableHead>
                <TableHead className="font-semibold">Cập nhật lần cuối</TableHead>
                <TableHead className="text-right font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((branch) => (
                <TableRow key={branch.branchId} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{branch.branchName}</TableCell>
                  <TableCell>
                  <Badge
                  variant={branch?.isActive ? "success" : "error"}
                  className={`text-sm font-medium  ${branch?.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}
                >
                      {branch.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(branch.createdDate)}</TableCell>
                  <TableCell>{formatDate(branch.updatedDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(branch)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleDeteled}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDetailsClick(branch)}>
                        <AlignJustify className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
              Hiển thị {paginatedData.length} trên tổng số {sortedAndFilteredData.length} chi nhánh
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft cclassName="h-4 w-4 mr-2" />
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
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[650px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-0 overflow-hidden">
          <DialogHeader className="bg-gradient-to-r from-green-600 to-green-600 text-white p-6 -mx-6 -mt-6 mb-6">
            <DialogTitle className="text-2xl text-white font-bold">Chỉnh sửa chi nhánh</DialogTitle>
            <DialogDescription className="text-blue-100">
              Cập nhật thông tin chi nhánh tại đây. Nhấn lưu khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          {editingBranch && (
            <div className="grid gap-6 py-6 px-6">
              <div className="grid gap-2">
                <Label htmlFor="branchName" className="text-sm font-medium text-gray-700">
                  Tên chi nhánh
                </Label>
                <Input
                  id="branchName"
                  value={editingBranch.branchName}
                  onChange={(e) => setEditingBranch({ ...editingBranch, branchName: e.target.value })}
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                />
              </div>
              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Trạng thái
                  </Label>
                  <div className="text-sm text-gray-600">
                    {editingBranch.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </div>
                </div>
                <Switch
                  id="isActive"
                  checked={editingBranch.isActive}
                  onCheckedChange={(checked) => setEditingBranch({ ...editingBranch, isActive: checked })}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Trạng thái hiện tại:</span>
                <Badge
                  variant={editingBranch?.isActive ? "success" : "error"}
                  className={`text-sm font-medium px-3 py-1 ${editingBranch?.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}
                >
                  {editingBranch?.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </Badge>
              </div>

            </div>
          )}
          <DialogFooter className="sm:justify-between  p-4 rounded-b-lg">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="hover:bg-gray-200 transition-colors duration-300">
              Hủy
            </Button>
            <Button type="submit" onClick={() => handleEditSave(editingBranch)} className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Branch Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[650px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-0 overflow-hidden">
          <DialogHeader className="bg-gradient-to-r from-green-600 to-green-600 text-white p-6 -mx-6 -mt-6 mb-6">
            <DialogTitle className="text-2xl text-white font-bold">Thêm chi nhánh mới</DialogTitle>
            <DialogDescription className="text-blue-100">
              Nhập thông tin chi nhánh mới tại đây. Nhấn thêm mới khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 px-6">
            <div className="grid gap-2">
              <Label htmlFor="newBranchName" className="text-sm font-medium text-gray-700">
                Tên chi nhánh
              </Label>
              <Input
                id="newBranchName"
                value={newBranch.branchName}
                onChange={(e) => setNewBranch({ ...newBranch, branchName: e.target.value })}
                className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
                placeholder="Nhập tên chi nhánh"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newBranchProvince" className="text-sm font-medium text-gray-700">
                Tỉnh/Thành phố
              </Label>
              <Select
                value={newBranch.province}
                onValueChange={(value) => setNewBranch({ ...newBranch, province: value })}
              >
                <SelectTrigger id="newBranchProvince" className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300">
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
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="newBranchIsActive" className="text-sm font-medium text-gray-700">
                  Trạng thái
                </Label>
                <div className="text-sm text-gray-600">
                  {newBranch.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </div>
              </div>
              <Switch
                id="newBranchIsActive"
                checked={newBranch.isActive}
                onCheckedChange={(checked) => setNewBranch({ ...newBranch, isActive: checked })}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Trạng thái hiện tại:</span>
              <Badge
                variant={newBranch?.isActive ? "success" : "error"}
                className={`text-sm font-medium px-3 py-1 ${newBranch?.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
              >
                {newBranch?.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
              </Badge>
            </div>

          </div>

          <DialogFooter className="sm:justify-between p-4 rounded-b-lg">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="hover:bg-gray-200 transition-colors duration-300">
              Hủy
            </Button>
            <Button type="submit" onClick={handleAddSave} className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300">
              Thêm mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[650px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-0 overflow-hidden">
          <DialogHeader className="bg-gradient-to-r from-green-600 to-green-600 text-white p-6 -mx-6 -mt-6 mb-6">
            <DialogTitle className="text-3xl text-white font-bold text-center">Chi tiết chi nhánh</DialogTitle>
          </DialogHeader>
          {detailsBranch && (
            <div className="space-y-6 px-2">
              <DetailItem
                icon={<Building2Icon className="h-6 w-6 text-purple-500" />}
                label="Tên chi nhánh"
                value={detailsBranch.branchName}
              />
              <div className="flex items-center justify-center">
                <Badge
                  variant={detailsBranch.isActive ? "bg-green" : "destructive"}
                  className={`text-sm font-medium px-3 py-1 ${detailsBranch?.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}
                >
                  {detailsBranch.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </Badge>
              </div>
              <DetailItem
                icon={<MapPinIcon className="h-6 w-6 text-pink-500" />}
                label="Địa chỉ"
                value={extractAddress(detailsBranch.branchName)}
              />
              <DetailItem
                icon={<CalendarIcon className="h-6 w-6 text-blue-500" />}
                label="Ngày tạo"
                value={formatDate(detailsBranch.createdDate)}
              />
              <DetailItem
                icon={<ClockIcon className="h-6 w-6 text-green-500" />}
                label="Cập nhật lần cuối"
                value={formatDate(detailsBranch.updatedDate)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>


    </div>


  )
}

export default ProjectDeleted
