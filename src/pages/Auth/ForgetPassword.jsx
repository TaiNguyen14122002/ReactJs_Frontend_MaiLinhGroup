import { Button } from '@/components/ui/button'
import axios from 'axios'
import { MailIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'


const ForgetPassword = ({toggleAuthMode}) => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')

    const checkEmailExists = async (email) => {
        // This is a mock function. In a real application, you would call your API here.
        try{
            const response = await axios.post(`https://springboot-backend-pms-20-12-2024.onrender.com/auth/forgotPassword`, null, {
                params: {email}
            });
            if(response.data){
                return true;
            }
            return false;

        }catch(error){
            console.log("Có lỗi xảy ra trong quá trình kiểm tra email:", error.message);
            throw new Error("Không thể kiểm tra email. Vui lòng thử lại sau.");
        }
      }

      const onSubmit = async (data) => {
        setIsSubmitting(true)
        setSubmitMessage('')
    
        try {
          const emailExists = await checkEmailExists(data.email)
          if (emailExists) {
            setSubmitMessage(`Thông báo đặt lại mật khẩu đã được gửi đến người dùng có gmail ${data.email}`)
            // Here you would typically call your API to send the reset email
          } else {
            setSubmitMessage('Địa chỉ email không tồn tại trong hệ thống.')
          }
        } catch (error) {
          setSubmitMessage('Địa chỉ email không tồn tại trong hệ thống.')
        } finally {
          setIsSubmitting(false)
        }
      }

    return (
        <div className="h-screen flex justify-center items-center px-5 lg:px-0">
            <div className="w-full max-w-md bg-white border shadow sm:rounded-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold text-blue-900">
                        Quên mật khẩu
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Nhập địa chỉ email của bạn để đặt lại mật khẩu
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="relative">
                        <input
                            className="w-full px-5 pr-12 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            type="email"
                            placeholder="Nhập địa chỉ email"
                            {...register('email', {
                                required: 'Email không được để trống',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Địa chỉ email không hợp lệ"
                                }
                            })}
                        />
                        <MailIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}

                    <Button
                        type="submit"
                        className="w-full py-3 font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors duration-300"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu đặt lại mật khẩu'}
                    </Button>
                </form>

                {submitMessage && (
                    <p className={`mt-4 text-sm text-center ${submitMessage.includes('đã được gửi') ? 'text-green-600' : 'text-red-600'}`}>
                        {submitMessage}
                    </p>
                )}

                <div className="mt-6 text-center">
                    <Link onClick={() => toggleAuthMode('login')} className="text-sm text-blue-600 hover:underline">
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword
