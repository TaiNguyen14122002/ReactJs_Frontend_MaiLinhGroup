import { Button } from '@/components/ui/button';
import { LockIcon, MailIcon, EyeIcon, EyeOffIcon, UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { register as registerAction } from '@/Redux/Auth/Action';

const Signup = ({ toggleAuthMode }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false); // Biến điều khiển hiển thị mật khẩu
  const [notification, setNotification] = useState({ message: '', type: '' }); // Quản lý thông báo

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullname: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(registerAction(data));

      if (response.error) {
        const errorMessage = response.error.message || 'Đăng ký không thành công, vui lòng thử lại';

        if (response.error.code === 'ACCOUNT_ALREADY_EXISTS') {
          setError('email', { type: 'server', message: 'Tài khoản đã tồn tại' });
        } else if (response.error.code === 'PASSWORD_DOES_NOT_MATCH') {
          setError('password', { type: 'server', message: 'Mật khẩu không hợp lệ' });
        } else {
          setError('email', { type: 'server', message: errorMessage });
          setError('password', { type: 'server', message: errorMessage });
        }
      } else {
        console.log("Register data:", data);
        setNotification({ message: 'Đăng ký thành công!', type: 'success' });
        setTimeout(() => {
          toggleAuthMode(); // Tự động quay lại trang đăng nhập sau 5 giây
        }, 5000);
      }

    } catch (error) {

    }
    // dispatch(registerAction(data)); // Sửa hàm dispatch
    // console.log("Register data:", data)
  };

  const handleCloseNotification = () => {
    setNotification({ message: '', type: '' });
  };

  return (
    <div className="h-screen flex justify-center px-5 lg:px-0">
      <div className="w-full bg-white border shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex-1  text-center hidden md:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://assets.plan.io/images/blog/what-is-task-management.png)`
            }}
          >
          </div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="text-center">
              <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900">
                Đăng ký tài khoản
              </h1>
              <p className="text-[12px] text-gray-500">
                Xin vui lòng nhập đầy đủ thông tin
              </p>
            </div>
            <div className="w-full flex-1 mt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-xs flex flex-col gap-4">
                <div className="relative">
                  <input
                    className="w-full px-5 pr-12 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Nhập tên đăng ký ( email )"
                    {...register('email', { required: 'Tên đăng nhập không được để trống' })}
                  />
                  <MailIcon className="absolute inset-y-0 right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  {errors.email && <p className="absolute mt-1 text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                <div className="relative mt-2">
                  <input
                    className="w-full px-5 pr-12 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    placeholder="Nhập tên người dùng đầy đủ"
                    {...register('fullname', { required: 'Tên người dùng không được để trống' })}
                  />
                  <UserIcon className="absolute inset-y-0 right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  {errors.fullname && <p className="absolute mt-1 text-red-500 text-xs">{errors.fullname.message}</p>}
                </div>

                <div className="relative ">
                  <input
                    className="mt-3 w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    {...register('password', { required: 'Mật khẩu không được để trống' })}
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeIcon className="text-gray-500" /> : <EyeOffIcon className="text-gray-500" />}
                  </div>
                  {errors.password && <p className="absolute mt-1 text-red-500 text-xs">{errors.password.message}</p>}
                </div>

                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <span className="ml-3">Đăng ký</span>
                </button>

                <div className="mt-6 text-xs text-gray-600 text-center">
                  Đã có tài khoản?{' '}
                  <Button variant="ghost" onClick={toggleAuthMode}>
                    Đăng nhập
                  </Button>
                </div>
              </form>

              {notification.message && (
                <div className={`mt-4 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  {notification.message}
                  <button className="ml-4 text-black" onClick={handleCloseNotification}>
                    X
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
