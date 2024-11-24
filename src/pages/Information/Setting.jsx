
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
import { Building2, Calendar, Code, Edit, Mail, MapPin, Phone, Upload } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

const Setting = () => {
    const { auth } = useSelector(store => store);
    const [brightness, setBrightness] = useState(100)
    const [zoom, setZoom] = useState(100)
    const [rotation, setRotation] = useState(0)
    const fileInputRef = useRef(null)
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
    // const { theme, setTheme } = useTheme()
    const t = translations[language]

    useEffect(() => {
        document.documentElement.lang = language
    }, [language])

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarSrc(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <main className="flex-1 overflow-auto">
                <header className="bg-background p-6 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                    <div className="relative">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="Nguyễn Văn A" />
                                    <AvatarFallback>NA</AvatarFallback>
                                </Avatar>
                                <Label
                                    htmlFor="image-upload"
                                    className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer"
                                >
                                    <Upload className="w-4 h-4" style={{ color: 'white' }} />
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
                                            <span>{auth.user?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-5 h-5 text-muted-foreground" />
                                            <span>{auth.user?.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-muted-foreground" />
                                            <span>{auth.user?.address}, Việt Nam</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-muted-foreground" />
                                            <span>{auth.user?.company}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-muted-foreground" />
                                            <span>Tham gia ngày {auth.user?.createdDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Code className="w-5 h-5 text-muted-foreground" />
                                            <span>{auth.user?.programerposition}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold">{t.skills}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {auth.user?.selectedSkills?.map((item, index) => {
                                                return <Badge key={index} variant="secondary">{item}</Badge>;
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold">{t.introduction}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {auth.user?.introduce}
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
                                            <Input id="name" defaultValue="Nguyễn Văn A" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">{t.email}</Label>
                                            <Input id="email" defaultValue="nguyenvana@example.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">{t.security}</h3>
                                        <div className="grid gap-2">
                                            <Label htmlFor="current-password">{t.currentPassword}</Label>
                                            <Input id="current-password" type="password" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="new-password">{t.newPassword}</Label>
                                            <Input id="new-password" type="password" />
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

                                    <Button>{t.saveChanges}</Button>
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
