import React, { useState, useEffect } from 'react';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css'; // Import Dashboard CSS
import { accountExists, getAccountBalance, createAccount } from '../Utils/firestoreUtils'; // Import the utils

const Dashboard = () => {
    const userInfo = useGetUserInfo();
    const [balances, setBalances] = useState({ checking: null, savings: null, credit: null });
    const [accounts, setAccounts] = useState({ checking: false, savings: false, credit: false });
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userInfo) return;

        const fetchAccountData = async () => {
            try {
                const checkingExists = await accountExists(userInfo.userID, 'checking');
                if (!checkingExists) {
                    await createAccount(userInfo.userID, 'checking');
                }

                const savingsExists = await accountExists(userInfo.userID, 'savings');
                const creditExists = await accountExists(userInfo.userID, 'credit');

                setAccounts({
                    checking: true,
                    savings: savingsExists,
                    credit: creditExists
                });

                const checkingBalance = await getAccountBalance(userInfo.userID, 'checking');
                const savingsBalance = savingsExists ? await getAccountBalance(userInfo.userID, 'savings') : null;
                const creditBalance = creditExists ? await getAccountBalance(userInfo.userID, 'credit') : null;

                setBalances({
                    checking: checkingBalance,
                    savings: savingsBalance,
                    credit: creditBalance
                });
            } catch (error) {
                console.error('Error fetching account data:', error);
                setError('An error occurred while fetching account data.');
            }
        };

        fetchAccountData();
    }, [userInfo]);


    if (!userInfo) return null;

    return (
        <div className="dashboard">
            <div className="dashboard-content">
                <h1 className="my-4">Welcome, {userInfo.name}</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="account-balances">
                    {accounts.checking && balances.checking !== null && (
                        <div className="account">
                            <div className="account-card">
                                <h5 className="card-title">Checking Account Balance</h5>
                                <p className="card-text">${balances.checking}</p>
                            </div>
                        </div>
                    )}
                    {accounts.savings && balances.savings !== null && (
                        <div className="account">
                            <div className="account-card">
                                <h5 className="card-title">Savings Account Balance</h5>
                                <p className="card-text">${balances.savings}</p>
                            </div>
                        </div>
                    )}
                    {accounts.credit && balances.credit !== null && (
                        <div className="account">
                            <div className="account-card">
                                <h5 className="card-title">Credit Account Balance</h5>
                                <p className="card-text">${balances.credit}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
