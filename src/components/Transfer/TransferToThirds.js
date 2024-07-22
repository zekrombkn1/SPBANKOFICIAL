import React, { useState, useEffect } from 'react';
import './TransferToThirds.css';
import { useNavigate } from 'react-router-dom';
import { getAccountBalance, updateAccountBalance, findUserByRUT, getUserIDByRUT, accountExists } from '../Utils/firestoreUtils';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';

const TransferToThirds = () => {
    const userInfo = useGetUserInfo();
    const [recipientRUT, setRecipientRUT] = useState('');
    const [recipientID, setRecipientID] = useState('');
    const [recipientAccounts, setRecipientAccounts] = useState([]);
    const [originAccount, setOriginAccount] = useState('');
    const [destinationAccount, setDestinationAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [balances, setBalances] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                if (userInfo) {
                    const checkingBalance = await getAccountBalance(userInfo.userID, 'checking');
                    const savingsBalance = await getAccountBalance(userInfo.userID, 'savings');
                    const creditBalance = await getAccountBalance(userInfo.userID, 'credit');

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
    }, [userInfo]);

    const formatRUT = (rut) => {
        const rutNumber = rut.slice(0, -1);
        const rutVerifier = rut.slice(-1);
        const formattedRUT = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '-' + rutVerifier;
        return formattedRUT;
    };

    const handleRUTSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const formattedRUT = formatRUT(recipientRUT);
            const user = await findUserByRUT(formattedRUT);
            if (user) {
                const id = await getUserIDByRUT(formattedRUT);
                setRecipientID(id);

                const accounts = [];
                if (await accountExists(id, 'checking')) accounts.push('checking');
                if (await accountExists(id, 'savings')) accounts.push('savings');
                if (await accountExists(id, 'credit')) accounts.push('credit');

                setRecipientAccounts(accounts);
            } else {
                setError('RUT not found. Please check and try again.');
            }
        } catch (error) {
            console.error('Error finding user by RUT:', error);
            setError('An error occurred while finding the user. Please try again later.');
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();

        if (!recipientID || originAccount === '' || destinationAccount === '') {
            setError('Please complete all fields.');
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
            const newOriginBalance = balances[originAccount] - numericAmount;
            const recipientBalance = await getAccountBalance(recipientID, destinationAccount);
            const newRecipientBalance = recipientBalance + numericAmount;

            await updateAccountBalance(userInfo.userID, originAccount, newOriginBalance);
            await updateAccountBalance(recipientID, destinationAccount, newRecipientBalance);

            navigate('/dashboard');
        } catch (error) {
            console.error('Error during transfer:', error);
            setError('An error occurred during the transfer. Please try again later.');
        }
    };

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="transfer">
            <h1>Transfer to Third Parties</h1>
            <div className="form-container">
                <form onSubmit={handleRUTSubmit}>
                    <div className="form-group">
                        <label>Recipient RUT:</label>
                        <input
                            type="text"
                            value={recipientRUT}
                            onChange={(e) => setRecipientRUT(e.target.value)}
                            required
                        />
                        <button type="submit">Find User</button>
                    </div>
                </form>
                {recipientAccounts.length > 0 && (
                    <form onSubmit={handleTransfer}>
                        <div className="form-group">
                            <label>Origin Account:</label>
                            <select
                                value={originAccount}
                                onChange={(e) => setOriginAccount(e.target.value)}
                                required
                            >
                                <option value="">Select an account</option>
                                {['checking', 'savings'].map(acc => (
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
                            >
                                <option value="">Select an account</option>
                                {recipientAccounts.map(acc => (
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
                )}
            </div>
        </div>
    );
};

export default TransferToThirds;
