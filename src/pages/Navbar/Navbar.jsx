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

import { FaBuilding, FaChartBar, FaTrashRestore } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import { FaBars } from "react-icons/fa";


import ItemCard from "./ItemCard";
import axios from "axios";
import { AlertCircle, AlertTriangle, BarChart2, ChartNoAxesCombined, ChevronDown, CircleGauge, Clock, Home, Inbox, LogOut, Plus, PlusCircle, Settings, Trash2, TrendingUp, Users, Warehouse } from "lucide-react";
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
    const [dataPinned, setDataPinned] = useState([]);

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

    const fetProjectPinned = async () => {
        if (!token) {
            console.log("Phiên đăng nhập đã hết hạn")
        }
        try {
            const response = await axios.get(`http://localhost:1000/api/projects/pinned`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setDataPinned(response.data)
            console.log("Pinned", response.data)

        } catch (error) {
            console.log("Cõ lỗi trong quá trình tải dữ liệu", error)
        }
    }

    useEffect(() => {
        fetchDataAllProject();
        fetProjectPinned();
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
            <div className="flex flex-col h-full border-r bg-muted/40">
                <ScrollArea className="flex-1">
                    <div className="space-y-4 p-4">
                        <div className="space-y-2">
                            <Button onClick={() => handleButtonClick("/")} variant="secondary" className="w-full justify-start">
                                <CircleGauge className="mr-2 h-4 w-4" />
                                Bảng điều khiển
                            </Button>
                            <Button onClick={() => handleButtonClick("/countproject")} variant="ghost" className="w-full justify-start">
                                <BarChart2 className="mr-2 h-4 w-4" />
                                Thống kê
                            </Button>
                            {/* <Button onClick={() => handleButtonClick("/upgrade_plan")} variant="ghost" className="w-full justify-start">
                                <Users className="mr-2 h-4 w-4" />
                                Đã giao cho tôi
                            </Button> */}
                            {/* <Button variant="ghost" className="w-full justify-start">
                                <Settings className="mr-2 h-4 w-4" />
                                Cài đặt
                            </Button> */}
                        </div>
                        <Separator />
                        <div>
                            <h3 className="mb-2 text-sm font-medium">Chi nhánh</h3>
                            <div className="space-y-1">
                                <Button onClick={() => handleButtonClick("/Branch/Management")} variant="ghost" className="w-full justify-start font-normal">
                                    <Warehouse className="mr-2 h-4 w-4" />
                                    Quản lý chi nhánh

                                </Button>
                                <Button onClick={() => handleButtonClick("/project/expiring")} variant="ghost" className="w-full justify-start font-normal">
                                    
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Quản lý chi nhánh đã xoá
                                </Button>
                                {/* <Button onClick={() => handleButtonClick("/project/expired")} variant="ghost" className="w-full justify-start font-normal">
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Kế hoạch đã trễ
                                </Button> */}
                            </div>
                        </div>
                        <Separator />

                        <div>
                            <h3 className="mb-2 text-sm font-medium">Phòng ban</h3>
                            <div className="space-y-1">
                                <Button onClick={() => handleButtonClick("/issues/expiring")} variant="ghost" className="w-full justify-start font-normal">
                                    <FaBuilding className="mr-2 h-4 w-4" />
                                    Quản lý phòng ban
                                </Button>
                                <Button onClick={() => handleButtonClick("/issues/expired")} variant="ghost" className="w-full justify-start font-normal">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Quản lý phòng ban đã xoá
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="mb-2 text-sm font-medium">Đối tác</h3>
                            <div className="space-y-1">
                                <Button onClick={() => handleButtonClick("/project/statistical")} variant="ghost" className="w-full justify-start font-normal">
                                    <Users className="mr-2 h-4 w-4" />
                                    Quản lý đối tác
                                </Button>
                                <Button onClick={() => handleButtonClick("/project/members")} variant="ghost" className="w-full justify-start font-normal">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Quản lý đôi tác đã xoá
                                </Button>
                                {/* <Button onClick={() => handleButtonClick("/project/performance")} variant="ghost" className="w-full justify-start font-normal">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Đánh giá hiệu suất
                                </Button> */}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="mb-2 text-sm font-medium">Thông báo</h3>
                            <div className="space-y-1">
                                <Button onClick={() => handleButtonClick("/project/statistical")} variant="ghost" className="w-full justify-start font-normal">
                                    <Users className="mr-2 h-4 w-4" />
                                    Quản lý thông báo
                                </Button>
                                {/* <Button onClick={() => handleButtonClick("/project/members")} variant="ghost" className="w-full justify-start font-normal">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Quản lý đôi tác đã xoá
                                </Button> */}
                                {/* <Button onClick={() => handleButtonClick("/project/performance")} variant="ghost" className="w-full justify-start font-normal">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Đánh giá hiệu suất
                                </Button> */}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default Navbar;
