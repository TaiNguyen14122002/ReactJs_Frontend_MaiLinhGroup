import { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import { Button } from '@/components/ui/button';
import "./Auth.css";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuthMode = () => {
        setIsLogin(prev => !prev);
    };

    return (
        <div className='h-screen text-xs text-gray-600 text-center'>


            <div className=''>
                {isLogin ? (
                    <Login toggleAuthMode={toggleAuthMode} />
                ) : (
                    <Signup toggleAuthMode={toggleAuthMode} />
                )}
            </div>
        </div>


    );
};

export default Auth;
