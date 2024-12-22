
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { storage } from '../../../Firebase/FirebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { Building2, Calendar, Code, Edit, EyeIcon, EyeOffIcon, Mail, MapPin, Pencil, Phone, Upload } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

const Setting = () => {
    const { auth } = useSelector(store => store);
    const [brightness, setBrightness] = useState(100)
    const [zoom, setZoom] = useState(100)
    const [rotation, setRotation] = useState(0)
    const fileInputRef = useRef(null)
    const token = localStorage.getItem('jwt')
    const translations = {
        en: {
            overview: "Overview",
            settings: "Settings",
            logout: "Logout",
            personalInfo: "Personal Information",
            viewAndUpdate: "View and update your personal information.",
            skills: "Skills",
            introduction: "Introduction",
            accountSettings: "Account Settings",
            manageSettings: "Manage your account settings.",
            name: "Name",
            email: "Email",
            security: "Security",
            currentPassword: "Current Password",
            newPassword: "New Password",
            enableTwoFactor: "Enable Two-Factor Authentication",
            notifications: "Notifications",
            receiveEmailNotifications: "Receive email notifications",
            receivePushNotifications: "Receive push notifications",
            interface: "Interface",
            language: "Language",
            darkMode: "Dark Mode",
            saveChanges: "Save Changes",
        },
        vi: {
            overview: "Tổng quan",
            settings: "Cài đặt",
            logout: "Đăng xuất",
            personalInfo: "Thông tin cá nhân",
            viewAndUpdate: "Xem và cập nhật thông tin cá nhân của bạn.",
            skills: "Kỹ năng",
            introduction: "Giới thiệu",
            accountSettings: "Cài đặt tài khoản",
            manageSettings: "Quản lý cài đặt tài khoản của bạn.",
            name: "Tên",
            email: "Email",
            security: "Bảo mật",
            currentPassword: "Mật khẩu hiện tại",
            newPassword: "Mật khẩu mới",
            enableTwoFactor: "Bật xác thực hai yếu tố",
            notifications: "Thông báo",
            receiveEmailNotifications: "Nhận thông báo qua email",
            receivePushNotifications: "Nhận thông báo đẩy",
            interface: "Giao diện",
            language: "Ngôn ngữ",
            darkMode: "Chế độ tối",
            saveChanges: "Lưu thay đổi",
        },
    }

    const [activeTab, setActiveTab] = useState("overview")
    const [language, setLanguage] = useState("vi")
    const [selectedFile, setSelectedFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const [avaterUser, setAvaterUser] = useState([])

    const [user, setUser] = useState(auth.user);
    // const { theme, setTheme } = useTheme()
    const t = translations[language]

    useEffect(() => {
        document.documentElement.lang = language
    }, [language])

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFile(files);

        if (files.length === 0) {
            toast.error("Không có tệp nào được chọn. Vui lòng chọn ít nhất một tệp để tải lên.");
            return;
        }

        setIsUploading(true);
        const uploadPromises = []; // Mảng chứa các Promise upload

        files.forEach((file) => {
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Lưu lại ID của Toast
            const toastId = toast.info(`Đang tải lên tệp: ${file.name}`, { autoClose: false });

            const uploadPromise = new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress((prevProgress) => ({
                            ...prevProgress,
                            [file.name]: progress,
                        }));

                        toast.update(toastId, {
                            render: `Đang tải lên tệp: ${file.name} (${Math.round(progress)}%)`,

                            type: 'INFO',
                        });
                    },
                    (error) => {
                        console.error(`Error uploading file ${file.name}:`, error);
                        toast.update(toastId, {
                            render: `Có lỗi xảy ra khi tải lên tệp: ${file.name}`,
                            type: 'INFO',
                            autoClose: true,
                        });
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadURL) => {
                                console.log(`File ${file.name} available at`, downloadURL);
                                toast.update(toastId, {
                                    render: `Upload thành công tệp: ${file.name}!`,

                                    type: 'success',
                                    autoClose: true,
                                });

                                const token = localStorage.getItem('jwt');
                                const url = new URL(`https://springbootbackendpms2012202-production.up.railway.app/api/file-info/addOrUpdate`);
                                url.searchParams.append('fileName', downloadURL);

                                fetch(url, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                    },
                                })
                                    .then((response) => {
                                        if (!response.ok) {
                                            throw new Error('Failed to save file URL');
                                        }
                                        return response.json();
                                    })
                                    .then((data) => {
                                        console.log('TaiNguyen', data);
                                        setAvaterUser((prevFileInfo) => [...prevFileInfo, downloadURL]);
                                        resolve(); // Hoàn thành Promise
                                    })
                                    .catch((error) => {
                                        console.error('Error saving file URL:', error);
                                        reject(error);
                                    });
                            });
                    }
                );
            });

            uploadPromises.push(uploadPromise); // Thêm Promise vào mảng
        });

        // Đợi tất cả các tệp tải lên xong
        Promise.all(uploadPromises)
            .then(() => {
                setIsUploading(false);
                toast.success('Tất cả tệp đã được tải lên thành công!');
            })
            .catch((error) => {
                setIsUploading(false);
                console.error('Có lỗi khi tải lên một hoặc nhiều tệp:', error);
                toast.error('Có lỗi khi tải lên một hoặc nhiều tệp.');
            });
    };


    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }



    const fetchFileUser = async () => {
        try {
            if (!token) {
                console.log("Phiên đăng nhập đã hết hạn")
            }
            const response = await axios.get(`https://springbootbackendpms2012202-production.up.railway.app/api/file-info/user`, {
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
    }, []
        // [token, handleImageUpload]
    )

    const handleInputChange = (e) => {
        // const { name, value } = e.target;
        // setPersonalInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (!token) {
                console.log("Phiên đăng nhập đã hết hạn")
            }
            const requestBody = {
                fullname: fullname,
                email: email,
                address: address,
                phone: phone,
                company: company,
                programerPosition: programerPosition,
                selectedSkills: selectedSkills,
                introduce: introduce
            }

            const response = await axios.put(`https://springbootbackendpms2012202-production.up.railway.app/api/users/updateUser`,
                requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("Done")
            setUser(response.data);


        } catch (error) {
            console.log("Cõ lỗi xảy ra tỏng quá trình thực hiện dữ liệu", error)
        }
        console.log(introduce)
        setIsOpen(false);
    };

    const [fullname, setFullname] = useState(auth.user?.fullname || "");
    const [email, setEmail] = useState(auth.user?.email || "")
    const [address, setAddress] = useState(auth.user?.address || "")
    const [phone, setPhone] = useState(auth.user?.phone || "")
    const [company, setCompany] = useState(auth.user?.company || "")
    const [programerPosition, setProgramerPosition] = useState(auth.user?.programerposition || "")
    const [introduce, serIntroduce] = useState(auth.user?.introduce || "")
    const [selectedSkills, setSelectedSkills] = useState(auth.user?.selectedSkills || "")


    const handleInputFullName = (e) => {
        setFullname(e.target.value);
    };
    const handleInputEmail = (e) => {
        setEmail(e.target.value);
    };
    const handleInputAddress = (e) => {
        setAddress(e.target.value);
    };
    const handleInputPhone = (e) => {
        setPhone(e.target.value);
    };
    const handleInputCompany = (e) => {
        setCompany(e.target.value);
    };
    const handleInputProgramerPosition = (e) => {
        setProgramerPosition(e.target.value);
    };
    const handleInputIntroduce = (e) => {
        serIntroduce(e.target.value);
    };
    const handleInputSelectedSkills = (e) => {
        setSelectedSkills(e.target.value);
    };

    const [currentPassword, setCurrentPassword] = useState('');
    const [newpassword, setNewPassword] = useState('')

    const handleChangePassword = async () => {
        
        if (!token) {
            setMessage("Phiên đăng nhập đã hết hạn.");
            return;
        }

        try {
            const response = await axios.put(
                `https://springbootbackendpms2012202-production.up.railway.app/api/users/changePassword`,
                null, // Không có body
                {
                    headers: {
                        Authorization: `Bearer ${token}` // JWT token
                    },
                    params: {
                        currentPassword: currentPassword,
                        newPassword: newpassword
                    }
                }
            );

            // Hiển thị thông báo thành công
            toast.success(
                <div>
                    <h2>Thông báo thành công</h2>
                    <p>{response.data.message || "Đổi mật khẩu thành công."}</p>
                </div>, 
                {
                    position: "top-right", // Vị trí của toast
                    autoClose: 5000, // Thời gian tự đóng (ms)
                    hideProgressBar: false, // Hiển thị thanh tiến độ
                    closeOnClick: true, // Cho phép đóng khi click vào toast
                }
            );
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                // Lấy thông báo lỗi từ phản hồi của backend
                toast.error(
                    <div>
                        <h2>Thông báo</h2>
                        <p>{error.response.data.message}</p>
                    </div>, 
                    {
                        position: "top-right", // Vị trí của toast
                        autoClose: 5000, // Thời gian tự đóng (ms)
                        hideProgressBar: false, // Hiển thị thanh tiến độ
                        closeOnClick: true, // Cho phép đóng khi click vào toast
                    }
                );
                
            } else {
                console.log("Có lỗi xảy ra, vui lòng thử lại.");
            }
        }
    };

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword)
    }

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword)
    }


    return (
        <div className="flex h-screen bg-background text-foreground">
            <main className="flex-1 overflow-auto">
                <header className="bg-background p-6 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={avaterUser[0]?.fileName} alt="Nguyễn Văn A" />
                                <AvatarFallback>NA</AvatarFallback>
                            </Avatar>
                            <Label
                                htmlFor="image-upload"
                                className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full bg-green-500 cursor-pointer"
                            >
                                <Upload className="w-4 h-4" color='white' />
                            </Label>
                            <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold">{auth.user?.fullname}</h1>
                            <p className="text-xl text-muted-foreground">Full-stack Developer</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">


                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Chỉnh sửa
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
                                    <DialogDescription>
                                        Cập nhật thông tin cá nhân của bạn tại đây. Nhấn lưu khi hoàn tất.
                                    </DialogDescription>
                                </DialogHeader>
                                <form className="space-y-4">
                                    <div>
                                        <Label htmlFor="fullname">Họ và tên</Label>
                                        <Input
                                            id="fullname"
                                            name="fullname"
                                            value={fullname}
                                            onChange={handleInputFullName}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={email}
                                            onChange={handleInputEmail}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="address">Địa chỉ</Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={address}
                                            onChange={handleInputAddress}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Số điện thoại</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={phone}
                                            onChange={handleInputPhone}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="company">Công ty</Label>
                                        <Input
                                            id="company"
                                            name="company"
                                            value={company}
                                            onChange={handleInputCompany}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="programerposition">Vị trí</Label>
                                        <Input
                                            id="programerposition"
                                            name="programerposition"
                                            value={programerPosition}
                                            onChange={handleInputProgramerPosition}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="selectedSkills">Kỹ năng (phân cách bằng dấu phẩy)</Label>
                                        <Input
                                            id="selectedSkills"
                                            name="selectedSkills"
                                            value={selectedSkills}
                                            onChange={handleInputSelectedSkills}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="introduce">Giới thiệu</Label>
                                        <Textarea
                                            id="introduce"
                                            name="introduce"
                                            value={introduce}
                                            onChange={handleInputIntroduce}

                                        />
                                    </div>
                                </form>
                                <DialogFooter>
                                    <Button onClick={handleSave}>Lưu thay đổi</Button>
                                </DialogFooter>

                            </DialogContent>

                        </Dialog>



                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="vi">Tiếng Việt</SelectItem>
                            </SelectContent>
                        </Select>
                        {/* <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button> */}
                    </div>
                </header>

                <div className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t.personalInfo}</CardTitle>
                                    <CardDescription>{t.viewAndUpdate}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-5 h-5 text-muted-foreground" />
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-5 h-5 text-muted-foreground" />
                                            <span>{user.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-muted-foreground" />
                                            <span>{user.address}, Việt Nam</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-muted-foreground" />
                                            <span>{user.company}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-muted-foreground" />
                                            <span>Tham gia ngày {user.createdDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Code className="w-5 h-5 text-muted-foreground" />
                                            <span>{user.programerposition}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold">{t.skills}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {user.selectedSkills?.map((item, index) => {
                                                return <Badge key={index} variant="secondary">{item}</Badge>;
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold">{t.introduction}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {user.introduce}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Cài đặt tài khoản</CardTitle>
                                    <CardDescription>Quản lý cài đặt tài khoản</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">{t.personalInfo}</h3>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">{t.name}</Label>
                                            <Input id="name" defaultValue={user.fullname} value={user.fullname} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">{t.email}</Label>
                                            <Input id="email" defaultValue={user.email} value={user.email} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">{t.security}</h3>
                                        <div className="grid gap-2">
                                            <Label htmlFor="current-password">{t.currentPassword}</Label>
                                            <div className="relative">
                                                <Input
                                                    id="current-password"
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={toggleCurrentPasswordVisibility}
                                                    aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                                                >
                                                    {showCurrentPassword ? (
                                                        <EyeIcon className="h-4 w-4" />
                                                    ) : (
                                                        <EyeOffIcon className="h-4 w-4" />
                                                    )}
                                                </Button>

                                            </div>

                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="new-password">{t.newPassword}</Label>
                                            <div className="relative">
                                                <Input
                                                    id="new-password"
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={newpassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={toggleNewPasswordVisibility}
                                                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOffIcon className="h-4 w-4" />
                                                    ) : (
                                                        <EyeIcon className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="two-factor" />
                                            <Label htmlFor="two-factor">{t.enableTwoFactor}</Label>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">{t.notifications}</h3>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="email-notifications" />
                                            <Label htmlFor="email-notifications">{t.receiveEmailNotifications}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="push-notifications" />
                                            <Label htmlFor="push-notifications">{t.receivePushNotifications}</Label>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">{t.interface}</h3>
                                        <div className="grid gap-2">
                                            <Label htmlFor="language">{t.language}</Label>
                                            <Select value={language} onValueChange={setLanguage}>
                                                <SelectTrigger id="language">
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                                                    <SelectItem value="en">English</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {/* <div className="flex items-center space-x-2">
                      <Switch
                        id="dark-mode"
                        checked={theme === "dark"}
                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                      />
                      <Label htmlFor="dark-mode">{t.darkMode}</Label>
                    </div> */}
                                    </div>

                                    <Button onClick={handleChangePassword}>{t.saveChanges}</Button>
                                </CardContent>
                            </Card>
                        </TabsContent>


                    </Tabs>

                </div>
            </main>
        </div>
    )
}

export default Setting
