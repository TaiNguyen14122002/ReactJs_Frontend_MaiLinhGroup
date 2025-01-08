import { useState } from 'react';
import { LockIcon, MailIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { login } from '@/Redux/Auth/Action';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function LoginForm({ toggleAuthMode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, token } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      userId: '',
      password: ''
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(login(data)); // Sử dụng await để chờ kết quả

      if (response.error) {
        const errorMessage = response.error.message || 'Đăng nhập không thành công, vui lòng thử lại!';

        // Kiểm tra mã lỗi
        if (response.error.code === 'USER_NOT_FOUND') {
          setError('email', { type: 'server', message: 'Tài khoản không tồn tại' });
        } else if (errorMessage === 'INVALID_PASSWORD') {
          setError('password', { type: 'server', message: 'Mật khẩu không chính xác' });
        } else {
          setError('password', { type: 'server', message: errorMessage });
        }
      } else {
        console.log('Login success', response);
        // dispatch(fetchProjects({}));
        // navigate('/Home');
        // Thực hiện các hành động khác sau khi đăng nhập thành công
      }
    } catch (error) {
      console.error('Login failed: ', error);
      setError('password', { type: 'server', message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  };

  const handleForgetPassword = () => {
    navigate('/forgetpassword')
    toast.success("Giao diện quên mật khảu chưa làm ")
  }



  return (

    <div className="h-screen flex justify-center px-5 lg:px-0">
      <div className="w-full bg-white border shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex-1  text-center hidden md:flex">

          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://cafef.vcmedia.vn/Images/Uploaded/Share/a2a1f5bd9a2fc528672acf6bfcb2301a/2013/01/27/Mai-Linh2/ho-so-mai-linh-group-ong-vua-om-yeu-cua-thi-truong-taxi.jpg)`,
            }}
          >
            {/* <h1 className=" mt-20 text-2xl xl:text-4xl font-extrabold text-blue-900">HỆ THỐNG QUẢN LÝ DỰ ÁN</h1> */}
          </div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="text-center">
              <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900">
                Đăng nhập tài khoản
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
                    type="text"
                    placeholder="Nhập tên tài khoản"
                    {...register('userId', { required: 'Tên đăng nhập không được để trống' })}
                  />
                  <MailIcon className="absolute inset-y-0 right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

                  {/* {errors.email && <p className="absolute mt-1 text-red-500 text-xs">{errors.email.message}</p>} */}
                  {errors.email && <p className="absolute mt-1 text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                <div className='relative'>
                  <input
                    className=" mt-3 w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    {...register('password', { required: 'Mật khảu không được để trống' })}
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeIcon className='text-gray-500' /> : <EyeOffIcon className='text-gray-500' />}
                  </div>
                  {errors.password && <p className="absolute mt-1 text-red-500 text-xs">{errors.password.message}</p>}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                    onClick={() => toggleAuthMode('forgetPassword')}
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                {/* {error && <p className="mt-2 text-red-500 text-xs">{error}</p>} */}

                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <span className="ml-3 text-white">Đăng nhập</span>
                </button>

                <div className="mt-6 text-xs text-gray-600 text-center">
                  Chưa có tài khoản?{' '}
                  <Button variant="ghost" onClick={() => toggleAuthMode('signup')}>
                    Đăng ký
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
