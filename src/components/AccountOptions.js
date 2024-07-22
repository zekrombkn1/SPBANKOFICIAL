import React, { useState } from 'react';

const AccountOptions = () => {
    const [currentAccount, setCurrentAccount] = useState('checking');
    const [transferAmount, setTransferAmount] = useState('');
    const [recipient, setRecipient] = useState('');

    const handleTransfer = () => {
        // Implement transfer logic
    };

    const switchAccount = (account) => {
        setCurrentAccount(account);
    };

    const payDebt = () => {
        // Implement pay debt logic
    };

    const withdrawSavings = () => {
        // Implement withdraw savings logic
    };

    return (
        <div>
            <h1>Account Options</h1>
            <select onChange={(e) => switchAccount(e.target.value)}>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit">Credit</option>
            </select>
            <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Transfer Amount"
            />
            <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Recipient"
            />
            <button onClick={handleTransfer}>Transfer</button>
            <button onClick={payDebt}>Pay Debt</button>
            <button onClick={withdrawSavings}>Withdraw from Savings</button>
        </div>
    );
};

export default AccountOptions;
