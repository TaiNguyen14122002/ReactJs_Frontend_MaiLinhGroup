import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ResetPassword = ({toggleAuthMode = 'resetpassword'}) => {
    const location = useLocation();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tokenFromUrl = urlParams.get('token');
        setToken(tokenFromUrl);
    }, [location]);

    const handleSubmit = async () => {
        if (!token) {
            setMessage('Token không hợp lệ');
            return;
        }

        // Gửi yêu cầu PUT đến backend
        const response = await fetch('/resetPassword?token=' + token + '&newPassword=' + newPassword, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage(data.message || 'Đặt lại mật khẩu thành công');
        } else {
            setMessage(data.message || 'Đã có lỗi xảy ra');
        }
    };

    return (
        <div>
            <h2>Đặt lại mật khẩu</h2>
            <div>
                <input 
                    type="password" 
                    placeholder="Mật khẩu mới" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                />
            </div>
            <div>
                <button onClick={handleSubmit}>Đặt lại mật khẩu</button>
            </div>
            <div>{message}</div>
        </div>
    );
};

export default ResetPassword;
