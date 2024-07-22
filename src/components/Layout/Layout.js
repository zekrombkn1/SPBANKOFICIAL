// src/components/Layout/Layout.js

import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './Layout.css'; // Create this CSS file to style the layout

const Layout = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const auth = localStorage.getItem("auth");
        if (!auth || !JSON.parse(auth).isAuth) {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogoff = () => {
        localStorage.removeItem("auth");
        navigate("/");
    };

    return (
        <div>
            <div className="navbar">
                <Link to="/dashboard">Home</Link>
                <div className="dropdown">
                    <button className="dropbtn">Open Account</button>
                    <div className="dropdown-content">
                        <Link to="/dashboard/open-credit-account">Open Credit Account</Link>
                        <Link to="/dashboard/open-savings-account">Open Savings Account</Link>
                    </div>
                </div>
                <div className="dropdown">
                    <button className="dropbtn">Transfer</button>
                    <div className="dropdown-content">
                        <Link to="/dashboard/transfer-my-accounts">Transfer Between My Accounts</Link>
                        <Link to="/dashboard/transfer-thirds">Transfer to Third Parties</Link>
                    </div>
                </div>
                <Link to="/dashboard/pay-account">Pagar</Link>
                <div className="navbar-right">
                    <button className="dropbtn" onClick={handleLogoff}>Logoff</button>
                </div>
            </div>
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
