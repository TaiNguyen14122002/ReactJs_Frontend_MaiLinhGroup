import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from 'react';
import CreateProjectForm from '../Project/CreateProjectForm';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PersonIcon } from '@radix-ui/react-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/Redux/Auth/Action';
import { Layout } from 'antd';

import { FaChartBar, FaTrashRestore } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import { FaBars } from "react-icons/fa";


import ItemCard from "./ItemCard";
import axios from "axios";
import { AlertCircle, AlertTriangle, BarChart2, ChartNoAxesCombined, ChevronDown, Clock, Home, Inbox, LogOut, Plus, PlusCircle, Settings, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";




const { Sider } = Layout; // Lấy Sider từ Layout

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const { auth } = useSelector(store => store);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAllExpanded, setIsAllExpanded] = useState(false);
    const [visibleCount, setVisibleCount] = useState(5);
    const [errorMessage, setErrorMessage] = useState('');
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [openPinned, setOpenPinned] = useState(true)
    const [openAll, setOpenAll] = useState(true)

    const colors = [
        '#FF5733', // Màu 1
        '#33FF57', // Màu 2
        '#3357FF', // Màu 3
        '#FF33A8', // Màu 4
        '#FFC300', // Màu 5
        '#DAF7A6', // Màu 6
        '#FF6347', // Màu 7
        '#4682B4', // Màu 8
        '#FFD700', // Màu 9
        '#ADFF2F'  // Màu 10
    ];


    const token = localStorage.getItem('jwt');

    const [data, setData] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleButtonClick = (route) => {
        navigate(route);
        setActiveButton(route); // Cập nhật nút đang hoạt động
    };

    const toggleContent = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleAllContent = () => {
        setIsAllExpanded(!isAllExpanded);
    };

    const handleShowMore = () => {
        setVisibleCount((prevCount) => prevCount + 5);
    }

    const projectInformation = (projectId) => {
        navigate("/project/" + projectId);

    }


    const fetchDataAllProject = async () => {
        if (!token) {
            setErrorMessage("Vui lòng đăng nhập lại");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:1000/api/projects`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("tokentokentokentoken", response);
            setData(response.data);
        } catch (error) {

            console.error(error);
            setErrorMessage("Đã xẩy ra lỗi khi tải dữ liệu");

        }
    }

    useEffect(() => {
        fetchDataAllProject();

        console.log("TaiNguyen", data)
    }, [])

    const toggleNavbar = () => {
        setIsNavbarVisible(prev => !prev);
    };

    const Separator = ({ color = 'gray', thickness = '1px', style = {}, ...props }) => {
        return (
            <hr
                style={{
                    borderColor: color,
                    borderWidth: thickness,
                    ...style,
                }}
                {...props}
            />
        );
    };

    return (
        <div className="flex j">
            {/* <div className="flex h-14 items-center border-b px-4">
                <h2 className="text-lg font-semibold">Project Manager</h2>
            </div> */}
            <div className="flex flex-col h-full border-r bg-muted/40">
                <ScrollArea className="flex-1">
                    <div className="space-y-4 p-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Thêm dự án mới
                        </Button>
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Thêm kế hoạch mới</DialogTitle>
                                    <DialogDescription>
                                        Điền thông tin dự án mới của bạn vào đây, Nhấn lưu khi hoàn tất
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateProjectForm />
                            </DialogContent>
                        </Dialog>
                        <div className="space-y-2">
                            <Button onClick={() => handleButtonClick("/")} variant="secondary" className="w-full justify-start">
                                <Home className="mr-2 h-4 w-4" />
                                Trung tâm
                            </Button>
                            <Button onClick={() => handleButtonClick("/countproject")} variant="ghost" className="w-full justify-start">
                                <BarChart2 className="mr-2 h-4 w-4" />
                                Thống kê
                            </Button>
                            <Button onClick={() => handleButtonClick("/upgrade_plan")} variant="ghost" className="w-full justify-start">
                                <Users className="mr-2 h-4 w-4" />
                                Đã giao cho tôi
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <Settings className="mr-2 h-4 w-4" />
                                Cài đặt
                            </Button>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="mb-2 text-sm font-medium">Kế hoạch</h3>
                            <div className="space-y-1">
                                <Button onClick={() => handleButtonClick("/project/deleted")} variant="ghost" className="w-full justify-start font-normal">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Kế hoạch đã xoá

                                </Button>
                                <Button onClick={() => handleButtonClick("/project/expiring")} variant="ghost" className="w-full justify-start font-normal">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Kế hoạch sắp hết hạn
                                </Button>
                                <Button onClick={() => handleButtonClick("/project/expired")} variant="ghost" className="w-full justify-start font-normal">
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Kế hoạch đã trễ
                                </Button>
                            </div>
                        </div>
                        <Separator />

                        <div>
                            <h3 className="mb-2 text-sm font-medium">Tác vụ</h3>
                            <div className="space-y-1">
                                <Button variant="ghost" className="w-full justify-start font-normal">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Tác vụ sắp hết hạn
                                </Button>
                                <Button variant="ghost" className="w-full justify-start font-normal">
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Tác vụ đã trễ
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="mb-2 text-sm font-medium">Báo cáo</h3>
                            <div className="space-y-1">
                                <Button onClick={() => handleButtonClick("/project/statistical")} variant="ghost" className="w-full justify-start font-normal">
                                    <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                                    Chi tiêu dự án
                                </Button>
                                <Button onClick={() => handleButtonClick("/project/members")} variant="ghost" className="w-full justify-start font-normal">
                                    <BarChart2 className="mr-2 h-4 w-4" />
                                    Chi tiêu từng thành viên
                                </Button>
                            </div>
                        </div>

                        <div>
                            <div
                                onClick={toggleContent}
                                className="space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold tracking-tight">Dự án đã ghim</h3>
                                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isExpanded ? "rotate-180" : "")} />
                                    <span className="sr-only">Toggle pinned projects</span>
                                </div>


                            </div>
                            {isExpanded && (
                                <ScrollArea className="h-[200px]">
                                    <div className="space-y-2">
                                        {data.slice(0, visibleCount).map((item, index) => (
                                            <ItemCard
                                                key={item.id}
                                                onClick={() => projectInformation(item.id)}
                                                label={item.name.charAt(0)}
                                                color={colors[index % colors.length]}
                                                title={item.name}
                                            />
                                        ))}
                                    </div>

                                    {visibleCount < data.length && (
                                        <button
                                            onClick={handleShowMore}
                                            className="mt-4 text-blue-500 hover:underline"
                                        >
                                            Xem thêm
                                        </button>
                                    )}
                                </ScrollArea>
                            )}

                        </div>

                        <Separator />

                        <div>
                            <div
                                onClick={toggleAllContent}
                                className="space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold tracking-tight">Tất cả dự án</h3>
                                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isAllExpanded ? "rotate-180" : "")} />
                                    <span className="sr-only">Toggle pinned projects</span>
                                </div>


                            </div>
                            {isAllExpanded && (
                                <ScrollArea className="h-[300px]">
                                    <div className="space-y-2 pr-4">
                                        {data.slice(0, visibleCount).map((item, index) => (
                                            <ItemCard
                                                key={item.id}
                                                onClick={() => projectInformation(item.id)}
                                                label={item.name.charAt(0)}
                                                color={colors[index % colors.length]}
                                                title={item.name}
                                            />
                                        ))}

                                        {visibleCount < data.length && (
                                            <Button
                                                variant="link"
                                                className="w-full text-primary"
                                                onClick={handleShowMore}
                                            >
                                                Xem thêm
                                            </Button>
                                        )}
                                    </div>
                                </ScrollArea>
                            )}

                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* <div className="mt-auto p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start">
                            <Avatar className="mr-2 h-6 w-6">
                                <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            {auth.user?.fullname}
                            <ChevronDown className="ml-auto h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem className="hover:bg-zinc-800">Profile</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-zinc-800">Settings</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-zinc-800" onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div> */}

        </div>
    );
};

export default Navbar;
