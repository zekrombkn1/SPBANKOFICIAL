import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useGetUserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const authData = localStorage.getItem('auth');
        if (authData) {
            try {
                const parsedAuthData = JSON.parse(authData);
                setUserInfo(parsedAuthData);
            } catch (error) {
                console.error('Error parsing auth data:', error);
                localStorage.removeItem('auth');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return userInfo;
};
