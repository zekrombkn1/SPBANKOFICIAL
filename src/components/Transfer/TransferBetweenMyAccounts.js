import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TransferBetweenMyAccounts.css';
import { useNavigate } from 'react-router-dom';
import { getAccountBalance, updateAccountBalance } from '../Utils/firestoreUtils';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';

const Transfer = ({ to }) => {
    const userInfo = useGetUserInfo();
    const userID = userInfo ? userInfo.userID : null;
    const [originAccount, setOriginAccount] = useState('');
    const [destinationAccount, setDestinationAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [balances, setBalances] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                if (userID) {
                    const checkingBalance = await getAccountBalance(userID, 'checking');
                    const savingsBalance = await getAccountBalance(userID, 'savings');
                    const creditBalance = await getAccountBalance(userID, 'credit');

                    setBalances({
                        checking: checkingBalance,
                        savings: savingsBalance,
                        credit: creditBalance
                    });
                }
            } catch (error) {
                console.error('Error fetching account balances:', error);
            }
        };

        fetchBalances();
    }, [userID]);

    const handleTransfer = async (e) => {
        e.preventDefault();

        if (originAccount === '' || destinationAccount === '') {
            setError('Please select both origin and destination accounts.');
            return;
        }

        if (originAccount === 'credit') {
            setError('You cannot transfer funds from a credit account.');
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) {
            setError('Amount must be a number.');
            return;
        }

        if (balances[originAccount] < numericAmount) {
            setError('Insufficient funds in the origin account.');
            return;
        }

        try {
            console.log(`Attempting transfer: ${numericAmount} from ${originAccount} to ${destinationAccount}`);
            await updateAccountBalance(userID, originAccount, balances[originAccount] - numericAmount);
            await updateAccountBalance(userID, destinationAccount, balances[destinationAccount] + numericAmount);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error during transfer:', error);
            setError('An error occurred during the transfer. Please try again later.');
        }
    };

    const availableAccounts = ['checking', 'savings', 'credit'];

    return (
        <div className="transfer">
            <h1>Transfer Between My Accounts</h1>
            <div className="form-container">
                <form onSubmit={handleTransfer}>
                    <div className="form-group">
                        <label>Origin Account:</label>
                        <select
                            value={originAccount}
                            onChange={(e) => setOriginAccount(e.target.value)}
                            required
                        >
                            <option value="">Select an account</option>
                            {availableAccounts.filter(acc => acc !== 'credit').map(acc => (
                                <option key={acc} value={acc}>
                                    {acc.charAt(0).toUpperCase() + acc.slice(1)} Account
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Destination Account:</label>
                        <select
                            value={destinationAccount}
                            onChange={(e) => setDestinationAccount(e.target.value)}
                            required
                            disabled={!originAccount}
                        >
                            <option value="">Select an account</option>
                            {availableAccounts.filter(acc => acc !== originAccount).map(acc => (
                                <option key={acc} value={acc}>
                                    {acc.charAt(0).toUpperCase() + acc.slice(1)} Account
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Amount: <span className="hint">(Max 500.000)</span></label>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            pattern="\d*"
                            placeholder="Enter amount"
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Transfer</button>
                </form>
            </div>
        </div>
    );
};

Transfer.propTypes = {
    to: PropTypes.string.isRequired,
};

export default Transfer;
