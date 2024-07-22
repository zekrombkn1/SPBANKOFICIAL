// src/components/Home/Home.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'; // Ensure this file exists or remove if not needed

const Home = () => {
    const { name } = useGetUserInfo();
    const navigate = useNavigate();

    useEffect(() => {
        if (!name) {
            navigate("/login");
        }
    }, [name, navigate]);

    return (
        <div className="home-page">
            <h1>Welcome to SPBank</h1>
            <p>Navigate using the menu above.</p>
        </div>
    );
};

export default Home;
