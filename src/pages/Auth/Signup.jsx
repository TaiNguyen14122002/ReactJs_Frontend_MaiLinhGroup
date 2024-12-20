import { Button } from '@/components/ui/button';
// import { LockIcon, MailIcon, EyeIcon, EyeOffIcon, UserIcon, User, Mail, MapPin, Phone, Briefcase, Code, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { register as registerAction } from '@/Redux/Auth/Action';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Briefcase, Code, LockIcon, Mail, MapPin, Phone, Upload, User } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';



const Signup = ({ toggleAuthMode }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false); // Biến điều khiển hiển thị mật khẩu
  const [notification, setNotification] = useState({ message: '', type: '' }); // Quản lý thông báo


  const [passwordError, setPasswordError] = useState('')


  const [fullname, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('')
  const [programerposition, setProgramerPosition] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([])
  const [introduce, setIntroduce] = useState('');

  const handleAddressChange = (value) => {
    setAddress(value);
  };


  const programmingPositions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Other"
  ]

  const skillOptions = [
    "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Node.js", "Python", "Java", "C#", "Ruby",
    "PHP", "Go", "Rust", "Swift", "Kotlin", "SQL", "MongoDB", "GraphQL", "Docker", "Kubernetes"
  ]

  const vietnameseProvinces = [
    "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "An Giang", "Bà Rịa - Vũng Tàu",
    "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
    "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình", "Hưng Yên",
    "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An",
    "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam",
    "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
    "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
  ]


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo dữ liệu từ form
    const formData = { fullname, email, password, address, phone, company, programerposition, selectedSkills, introduce };

    try {
      // Gửi yêu cầu đăng ký đến API
      console.log(formData);
      const response = await axios.post('http://localhost:1000/auth/signup', formData);

      // Kiểm tra phản hồi từ API
      if (response.data) {
        console.log("Register data:", response.data);
        setNotification({ message: 'Đăng ký thành công!', type: 'success' });

        // Chuyển hướng hoặc làm gì đó sau khi đăng ký thành công
        setTimeout(() => {
          toggleAuthMode(); // Tự động quay lại trang đăng nhập sau 5 giây
        }, 5000);
      }
    } catch (error) {
      // Kiểm tra lỗi từ Axios
      console.error("Error during registration:", error);

      // Kiểm tra lỗi từ phản hồi API nếu có
      if (error.response) {
        const errorData = error.response.data;

        if (errorData.error) {
          const errorMessage = errorData.error.message || 'Đăng ký không thành công, vui lòng thử lại';

          // Kiểm tra mã lỗi và cập nhật thông báo lỗi tương ứng
          if (errorData.error.code === 'ACCOUNT_ALREADY_EXISTS') {
            setError('email', { type: 'server', message: 'Tài khoản đã tồn tại' });
          } else if (errorData.error.code === 'PASSWORD_DOES_NOT_MATCH') {
            setError('password', { type: 'server', message: 'Mật khẩu không hợp lệ' });
          } else {
            setError('email', { type: 'server', message: errorMessage });
            setError('password', { type: 'server', message: errorMessage });
          }
        }
      } else {
        // Nếu không có phản hồi từ API, có thể là lỗi mạng
        setNotification({ message: 'Lỗi kết nối, vui lòng thử lại sau.', type: 'error' });
      }
    }
  };


  const handleCloseNotification = () => {
    setNotification({ message: '', type: '' });
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  console.log(selectedSkills)

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    return hasUpperCase && hasSpecialChar
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    if (newPassword && !validatePassword(newPassword)) {
      setPasswordError('Mật khẩu phải chứa ít nhất một chữ in hoa và một ký tự đặc biệt.')
    } else {
      setPasswordError('')
    }
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 10) {
      setPhone(value)
    }
  }



  return (

    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-cover bg-center" style={{
      backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
      backgroundBlendMode: 'overlay',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }}>
      <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-md shadow-xl">
        <div className="absolute top-4 left-4">
          <Link onClick={() => toggleAuthMode('login')} className="flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="mr-2" size={20} />
            <span>Quay lại đăng nhập</span>
          </Link>
        </div>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-blue-900 font-bold">Đăng ký tài khoản người dùng</CardTitle>
          <CardDescription className="text-lg">Người dùng nhập thông tin để tiến hành đăng ký tài khoản</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullname" className="text-base text-blue-900 font-medium w-32 text-left">Tên đầy đủ</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input id="fullname" name="fullname" value={fullname}
                      onChange={(e) => setFullName(e.target.value)} className="pl-10 h-12 text-lg" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-base text-blue-900 font-medium">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input id="email" name="email" type="email" value={email}
                      onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 text-lg" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="text-base text-blue-900 font-medium">Mật khẩu</Label>
                  <div className="relative mt-1">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      className="pl-10 h-12 text-lg"
                      required
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                </div>
                <div>
                  <Label htmlFor="address" className="text-base text-blue-900 font-medium">Tỉnh/Thành Phố</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <Select value={address} onValueChange={(value) => setAddress(value)} name="address">
                      <SelectTrigger className="pl-10 text-blue-900 h-12 text-lg">
                        <SelectValue className='text-blue-900' placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {vietnameseProvinces.map((province, index) => (
                          <SelectItem key={index} value={province}>{province}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone" className="text-base text-blue-900 font-medium">Số điện thoại</Label>
                  <div className="relative mt-1 flex">
                    <span className="inline-flex items-center px-3 h-12 text-lg text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                      +84
                    </span>
                    <Phone className="absolute left-16 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="pl-10 h-12 text-lg rounded-l-none"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      maxLength={10}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company" className="text-base text-blue-900 font-medium">Tên công ty</Label>
                  <div className="relative mt-1">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input id="company" name="company" value={company}
                      onChange={(e) => setCompany(e.target.value)} className="pl-10 h-12 text-lg" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="programingposition" className="text-base text-blue-900 font-medium">Vị trí lập trình</Label>
                  <div className="relative mt-1">
                    <Code className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <Select value={programerposition} onValueChange={(value) => setProgramerPosition(value)} name="programingposition">
                      <SelectTrigger className="pl-10 h-12 text-lg">
                        <SelectValue placeholder="Chọn vị trí lập trình" />
                      </SelectTrigger>
                      <SelectContent>
                        {programmingPositions.map((position, index) => (
                          <SelectItem key={index} value={position}>{position}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="avatar" className="text-base  text-blue-900 font-medium">Ảnh đại diện</Label>
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {avatar ? (
                        <img src={avatar} alt="Avatar preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-gray-400" size={40} />
                      )}
                    </div>
                    <label htmlFor="avatar-upload" className="cursor-pointer text-blue-900 bg-white text-primary hover:bg-primary hover:text-white transition-colors duration-200 py-2 px-4 rounded-md border border-primary flex items-center">
                      <Upload className="mr-2 text-blue-900" size={20} />
                      Chọn ảnh đại diện
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-base text-blue-900 font-medium">Khả năng lập trình</Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                {skillOptions.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={() => toggleSkill(skill)}
                    />
                    <label
                      htmlFor={skill}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="introduce" className="text-base text-blue-900 font-medium">Giới thiệu bản thân</Label>
              <Textarea id="introduce" name="introduce" value={introduce}
                onChange={(e) => setIntroduce(e.target.value)} placeholder="Nói về một số ưu, nhược điểm và thành tựu đã đạt được" className="mt-1 h-32 text-lg" />
            </div>
            <Button type="submit" className="w-full h-12 bg-blue-900  text-lg">
              Tạo tài khoản
            </Button>
          </form>
        </CardContent>

      </Card>

    </div>
  );
};

export default Signup;
