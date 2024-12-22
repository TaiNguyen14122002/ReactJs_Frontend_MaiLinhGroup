import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, logout } from './Redux/Auth/Action';
import { fetchProjects } from './Redux/Project/Action';
import Home from './pages/Home/Home';
import Navbar from './pages/Navbar/Navbar';
import ProjectDetails from './pages/ProjectDetails/ProjectDetails';
import IssueDetails from './pages/IssueDetails/IssueDetails';
import Subscription from './pages/Subscription/Subscription';
import AcceptInvitation from './pages/Project/AcceptInvitation';
import CountProjectByUser from './pages/Chart/Issue/CountProjectByUser';
import GetIssuesCountByStatus from './pages/Chart/Issue/GetIssuesCountByStatus';
import { Button } from "@/components/ui/button";

import { Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';
import { FaBars, FaChartBar, FaHome } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import { SlMenu } from "react-icons/sl";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import BreadcrumbComponent from './pages/Navbar/BreadcrumbComponent';
import { Badge, BarChart2, Bell, Check, ChevronDown, ChevronLeft, LogOut, Menu, Plus, PlusCircle, Settings, User, Users, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { DialogHeader } from '@chakra-ui/react';
import { cn } from './lib/utils';
import Auth from './pages/Auth/Auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Input } from './components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';

import ProjectListExpiring from './pages/ProjectList/ProjectListExpiring';
import ProjectExpired from './pages/ProjectList/ProjectExpired';
import ProjectDeleted from './pages/ProjectList/ProjectDeleted';
import Calender from './pages/Calender/Calender';
import Setting from './pages/Information/Setting';
import ProjectSpending from './pages/ExportPDF/ProjectSpending';
import PDFExport from './pages/ExportPDF/PDFExport';
import MemberInformation from './pages/ExportPDF/MemberInformation';
import PDFMenberInformation from './pages/ExportPDF/PDFMenberInformation';
import IssueExpiring from './pages/IssueList/IssueExpiring';
import IssueExpired from './pages/IssueList/IssueExpired';
import ProjectPerformanceDashboard from './pages/Performance/ProjectPerformanceDashboard';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import { Checkbox } from './components/ui/checkbox';
import ForgetPassword from './pages/Auth/ForgetPassword';
import ResetPassword from './pages/Auth/Resetpassword';

function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [open, setOpen] = useState(false)
  const token = localStorage.getItem('jwt')

  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchProjects({}));
  }, [auth.jwt, token]);

  const toggleNavbar = () => {
    setIsNavbarVisible(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt')
    dispatch(logout());
  };

  const [notifications, setNotifications] = useState([])

  const unreadCount = notifications.notifications?.filter(n => !n.read).length

  const markAsRead = async (id) => {
    console.log("Thông báo", id);
    try {
      // Gửi yêu cầu PUT để đánh dấu thông báo là đã đọc
      const response = await axios.put(
        `https://springboot-backend-pms-20-12-2024.onrender.com/api/notification/${id}/read`,
        {}, // Gửi body trống (hoặc dữ liệu cần thiết)
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Đã đọc thông báo", response.data);

      // Lấy lại danh sách thông báo từ server
      const notificationsResponse = await axios.get('https://springboot-backend-pms-20-12-2024.onrender.com/api/notification/notificationanduser', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Cập nhật lại danh sách thông báo
      setNotifications(notificationsResponse.data);

    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình tải dữ liệu", error);
    }
  };



  const formatDate = (timestamp) => {
    if (!timestamp || isNaN(new Date(timestamp))) {
      console.error('Invalid timestamp:', timestamp);
      return ''; // Hoặc một giá trị mặc định nào đó
    }
    const timeZone = 'Asia/Ho_Chi_Minh';
    const date = new Date(timestamp);
    return formatInTimeZone(date, timeZone, 'yyyy-MM-dd HH:mm:ss');
  };


  const [activeTab, setActiveTab] = useState(null);
  const handleActiTab = (activitiTab) => {
    console.log("Lựa chọn", activitiTab)
    setActiveTab(activitiTab);

  }
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (route) => {
    navigate(route);
    setActiveButton(route); // Cập nhật nút đang hoạt động
  };

  const toggleNavbarVisibility = () => {
    setIsNavbarVisible(prevState => !prevState);
  };



  const fetchNotification = async () => {
    try {
      if (!token) {
        console.log("Phiên đăng nhập đã hết hạn")
      }
      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/notification/notificationanduser`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log("Dữ liệu thông báo", response.data)
      setNotifications(response.data)

    } catch (error) {
      console.log("Có lỗi xảy ra trong quá tình tải dữ liệu", error)
    }
  }

  useEffect(() => {
    fetchNotification()
  }, [token])

  const [avaterUser, setAvaterUser] = useState([])

  const fetchFileUser = async () => {
    try {
      if (!token) {
        console.log("Phiên đăng nhập đã hết hạn")
      }
      const response = await axios.get(`https://springboot-backend-pms-20-12-2024.onrender.com/api/file-info/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Avater", response.data)
      setAvaterUser(response.data)

    } catch (error) {
      console.log("Có lỗi xẩy ra trong quá trình thực hiện dữ liệu", error)
    }
  }

  useEffect(() => {
    fetchFileUser();
  }, [token])

  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const filteredNotifications = useMemo(() => {
    return showOnlyUnread
      ? notifications.notifications.filter(notification => !notification.read)
      : notifications.notifications;
  }, [notifications, showOnlyUnread]);

  const sortedNotifications = useMemo(() => {
    if (!Array.isArray(filteredNotifications)) {
      return []; // Trả về mảng rỗng nếu filteredNotifications không phải là mảng
    }
  
    return filteredNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [filteredNotifications]);
  

  return (
    <BrowserRouter>

      {
        auth.user ? (
          <div className="min-h-screen bg-background">
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <header className="flex h-16 items-center border-b px-4 lg:px-6" style={{ backgroundColor: '#1d86c0' }}>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 lg:hidden"
                onClick={toggleNavbarVisibility}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-lg font-semibold text-white">Project Manager</h1>
              <div className="ml-auto">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5 text-white" />
                      {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                      <span className="sr-only">Thông báo</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 max-h-[600px] overflow-y-auto">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Thông báo</h3>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="show-unread"
                            checked={showOnlyUnread}
                            onCheckedChange={(checked) => setShowOnlyUnread(checked)}
                          />
                          <label
                            htmlFor="show-unread"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Chỉ hiển thị chưa đọc
                          </label>
                        </div>
                      </div>
                      {sortedNotifications.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Không có thông báo.</p>
                      ) : (
                        sortedNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`flex items-start gap-4 p-2 rounded-md ${notification.read ? 'bg-background' : 'bg-muted'
                              }`}
                          >
                            <Bell className="mt-1 h-5 w-5" />
                            <div className="grid gap-1 flex-1">
                              <p className="text-sm">{notification.content}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(notification.timestamp)}
                              </p>
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="justify-start px-0 text-muted-foreground"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Đánh dấu đã đọc
                                </Button>
                              )}
                            </div>
                            {notification.read && <Check className="h-4 w-4 text-green-500" />}
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </header>

            <div className="flex flex-grow">
              <aside
                className={cn(
                  "fixed top-16 z-20 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform lg:static lg:translate-x-0",
                  !isNavbarVisible && "-translate-x-full"
                )}
              >
                <div className="flex flex-col h-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 lg:hidden"
                    onClick={() => setIsNavbarVisible(false)}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>

                  {/* Navbar component */}
                  <Navbar />

                  {/* John Doe section at the bottom */}
                  <div className="mt-auto p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start">
                          <Avatar className="mr-2 h-6 w-6">
                            <AvatarImage src={avaterUser[0]?.fileName} alt="Avatar" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          {auth.user?.fullname}
                          <ChevronDown className="ml-auto h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem className="hover:bg-zinc-800">
                          <Button variant="ghost" className="w-full justify-start" onClick={() => handleButtonClick("/user/information")}>
                            <User className="mr-2 h-4 w-4" />
                            Tổng quan
                          </Button>
                        </DropdownMenuItem>
                      
                        <DropdownMenuItem className="hover:bg-zinc-800" onClick={handleLogout}>
                          <Button variant="ghost" className="w-full justify-start text-red-500 mt-auto">
                            <LogOut className="mr-2 h-4 w-4" />
                            Đăng xuất
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </aside>

              <main className="flex-1 p-4 lg:p-6 overflow-y-auto pb-4">
                <div className="flex flex-col gap-4">
                  <BreadcrumbComponent />
                  {/* Project Cards */}
                  <div className=" md:grid-cols-2 lg:grid-cols-3 pb-10">

                    <Routes>
                      <Route path='/' element={<Home />} />
                      <Route path='/project/:id' element={<ProjectDetails />} />
                      <Route path='/project/:projectId/issue/:issueId' element={<IssueDetails />} />
                      <Route path='/upgrade_plan' element={<Subscription />} />
                      <Route path='/accept_invitation' element={<AcceptInvitation />} />
                      <Route path='/countproject' element={<CountProjectByUser />} />
                      <Route path='/project/status' element={<GetIssuesCountByStatus />} />
                      <Route path='/project/expiring' element={<ProjectListExpiring />} />
                      <Route path='/project/expired' element={<ProjectExpired />} />
                      <Route path='/project/deleted' element={<ProjectDeleted />} />
                      <Route path='/project/calender' element={<Calender />} />
                      <Route path='/user/information' element={<Setting />} />
                      <Route path='/project/statistical' element={<ProjectSpending />} />
                      <Route path='/project/PDF/Information/:projectId' element={<PDFExport />} />
                      <Route path='/project/members' element={<MemberInformation />} />
                      <Route path='/members/PDF/project/:projectId/issue/:issueId' element={<PDFMenberInformation />} />
                      <Route path='/issues/expiring' element={<IssueExpiring />} />
                      <Route path='/issues/expired' element={<IssueExpired />} />
                      <Route path='/project/performance' element={<ProjectPerformanceDashboard />} />
                      <Route path='/forgetpassword' element={<ForgetPassword />} />
                      <Route path="/resetPassword" element={<ResetPassword />} />
                    </Routes>
                  </div>
                </div>
              </main>
            </div>
          </div>
        ) : (
          <Auth />
        )
      }
    </BrowserRouter>

  );
}

export default App;
