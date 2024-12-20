import { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import { Button } from '@/components/ui/button';
import "./Auth.css";
import ForgetPassword from './ForgetPassword';
import ResetPassword from './Resetpassword';

const Auth = () => {
    // const [isLogin, setIsLogin] = useState(true);

    // const toggleAuthMode = () => {
    //     setIsLogin(prev => !prev);
    // };

    // return (
    //     <div className='h-screen text-xs text-gray-600 text-center'>


    //         <div className=''>
    //             {isLogin ? (
    //                 <Login toggleAuthMode={toggleAuthMode} />
    //             ) : (
    //                 <Signup toggleAuthMode={toggleAuthMode} />
    //             )}
    //         </div>
    //     </div>


    // );
    const [authMode, setAuthMode] = useState('login');

    const toggleAuthMode = (mode) => {
        setAuthMode(mode);
    };

    return (
        <div className='h-screen text-xs text-gray-600 text-center'>
            <div>
                {authMode === 'login' && <Login toggleAuthMode={toggleAuthMode} />}
                {authMode === 'signup' && <Signup toggleAuthMode={toggleAuthMode} />}
                {authMode === 'forgetPassword' && <ForgetPassword toggleAuthMode={toggleAuthMode} />}
                {authMode === 'resetpassword' && <ResetPassword toggleAuthMode={toggleAuthMode} />}
            </div>
        </div>
    )
};

export default Auth;
