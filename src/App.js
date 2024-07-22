// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/LoginFolder/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Transfer from './components/Transfer/TransferBetweenMyAccounts';
import TransferToThirds from './components/Transfer/TransferToThirds';
import OpenCreditAccountForm from './components/OpenAccount/OpenCreditAccountForm';
import OpenSavingsAccountForm from './components/OpenAccount/OpenSavingsAccountForm';
import RegisterRUT from './components/RegisterRUT/RegisterRUT';
import PayAccount from './components/PayAccount/PayAccount'; // Import the PayAccount component
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute'; // Crea este componente
import './App.css'; // Import global CSS

const App = () => {
    return (
        <Router>
            <div className="app-background">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register-rut/:userID" element={<RegisterRUT />} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/dashboard/transfer-my-accounts" element={<Transfer to="my-accounts" />} />
                            <Route path="/dashboard/transfer-thirds" element={<TransferToThirds />} />
                            <Route path="/dashboard/open-credit-account" element={<OpenCreditAccountForm />} />
                            <Route path="/dashboard/open-savings-account" element={<OpenSavingsAccountForm />} />
                            <Route path="/dashboard/pay-account" element={<PayAccount />} /> {/* New PayAccount route */}
                        </Route>
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
