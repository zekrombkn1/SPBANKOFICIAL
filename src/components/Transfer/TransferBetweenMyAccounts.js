import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transferFunds } from '../Utils/firestoreUtils';

const TransferBetweenMyAccounts = () => {
    const [originAccount, setOriginAccount] = useState('');
    const [destinationAccount, setDestinationAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = [];

        if (originAccount === '' || destinationAccount === '') {
            validationErrors.push('Please select both origin and destination accounts');
        }

        if (isNaN(amount) || amount === '') {
            validationErrors.push('Amount must be a number');
        }

        if (originAccount === 'credit') {
            validationErrors.push('You cannot transfer funds from a credit account');
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await transferFunds('userID', 'userID', parseFloat(amount));
            navigate('/dashboard');
        } catch (error) {
            setErrors(['An error occurred during the transfer. Please try again later.']);
        }
    };

    return (
        <div className="transfer">
            <h1>Transfer Between My Accounts</h1>
            <div className="form-container">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="originAccount">Origin Account:</label>
                        <select
                            id="originAccount"
                            value={originAccount}
                            onChange={(e) => setOriginAccount(e.target.value)}
                            required
                        >
                            <option value="">Select an account</option>
                            <option value="checking">Checking Account</option>
                            <option value="savings">Savings Account</option>
                            <option value="credit">Credit Account</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="destinationAccount">Destination Account:</label>
                        <select
                            id="destinationAccount"
                            value={destinationAccount}
                            onChange={(e) => setDestinationAccount(e.target.value)}
                            required
                        >
                            <option value="">Select an account</option>
                            <option value="checking">Checking Account</option>
                            <option value="savings">Savings Account</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">
                            Amount:
                            <span className="hint">(Max 500.000)</span>
                        </label>
                        <input
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            required
                            type="text"
                        />
                    </div>
                    {errors.length > 0 && (
                        <div data-testid="error-messages">
                            {errors.map((error, index) => (
                                <p key={index} className="error">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                    <button type="submit">Transfer</button>
                </form>
            </div>
        </div>
    );
};

export default TransferBetweenMyAccounts;
