import React, { useState, useEffect } from 'react';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import { addPayment, getPayments, deductFromChecking } from '../Utils/firestoreUtils';
import './PayAccount.css';

const PayAccount = () => {
    const userInfo = useGetUserInfo();
    const [amount, setAmount] = useState('');
    const [paymentName, setPaymentName] = useState('');
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            if (userInfo) {
                try {
                    const userPayments = await getPayments(userInfo.userID);
                    const sortedPayments = userPayments.sort((a, b) => b.date - a.date);
                    setPayments(sortedPayments);
                } catch (error) {
                    console.error('Error fetching payments:', error);
                }
            }
        };

        fetchPayments();
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !paymentName) {
            setError('Please fill in all fields');
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) {
            setError('Amount must be a number');
            return;
        }

        try {
            await deductFromChecking(userInfo.userID, numericAmount);
            await addPayment(userInfo.userID, paymentName, numericAmount);
            setError('');
            const userPayments = await getPayments(userInfo.userID);
            const sortedPayments = userPayments.sort((a, b) => b.date - a.date);
            setPayments(sortedPayments);
            setAmount('');
            setPaymentName('');
        } catch (error) {
            console.error('Error processing payment:', error);
            setError('An error occurred. Please try again.');
        }
    };

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg p-3 mb-5 bg-white rounded">
                        <div className="card-header text-center mb-4">
                            <h2 className="card-title styled-title">Pagar cuenta</h2>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label styled-label">Nombre del Pago:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={paymentName}
                                        onChange={(e) => setPaymentName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label styled-label">Cantidad:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block styled-button">Pagar</button>
                            </form>
                        </div>
                    </div>
                    <div className="card shadow-lg p-3 mb-5 bg-white rounded mt-4">
                        <div className="card-header text-center mb-4">
                            <h2 className="card-title styled-title">Historial de Pagos</h2>
                        </div>
                        <div className="card-body">
                            <ul className="list-group scrollable-list">
                                {payments.map((payment, index) => (
                                    <li key={index} className="list-group-item">
                                         {payment.name}: ${payment.amount} - <strong>{new Date(payment.date.seconds * 1000).toLocaleDateString()} </strong> 
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayAccount;
