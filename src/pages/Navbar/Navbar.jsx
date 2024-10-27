import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useEffect, useRef, useState } from 'react'
import CreateProjectForm from '../Project/CreateProjectForm'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PersonIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/Redux/Auth/Action'



const Navbar = () => {

    const [visible, setVisible] = useState(false)
    const { auth } = useSelector(store => store)
    const navigate = useNavigate()

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout())
    }


    return (
        <div className='border-b py-4 px-5 flex items-center justify-between'>

            <div className='flex items-center gap-3'>

                <p onClick={() => navigate("/")} className='cursor-pointer'>
                    Quản lý dự án
                </p>

                <Dialog>

                    <DialogTrigger>
                        <Button variant="ghost">
                            Kế hoạch mới
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>

                        <CreateProjectForm />
                    </DialogContent>

                </Dialog>
                <Button onClick={() => navigate("/upgrade_plan")} variant="ghost">
                    Nhiệm vụ cho tôi
                </Button>

                <Button onClick={() => navigate("/countproject")} variant="ghost">
                    Thống kê
                </Button>

                <Button onClick={() => navigate("/project/status" )} variant="ghost">
                    Giới thiệu
                </Button>



            </div>

            <div className='flex gap-3 items-center'>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="outline" size="icon" className="rounded-full border-2 border-gray-500">
                            <PersonIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleLogout}>
                            Đự án đã xoá
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                            Thông tin cá nhân
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                            Đổi mật khẩu
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                            Đăng xuất
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <p>{auth.user?.fullname}</p>

            </div>

        </div>
    )
}

export default Navbar