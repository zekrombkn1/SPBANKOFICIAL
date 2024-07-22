import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const isAuth = JSON.parse(localStorage.getItem('auth'))?.isAuth;

    return isAuth ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default ProtectedRoute;
