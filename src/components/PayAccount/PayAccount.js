import React, { useState, useEffect } from 'react';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import { addPayment, getPayments, deductFromChecking } from '../Utils/firestoreUtils';

const PayAccount = () => {
    const userInfo = useGetUserInfo();
    const [paymentName, setPaymentName] = useState('');
    const [amount, setAmount] = useState('');
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const userPayments = await getPayments(userInfo.userID);
                const sortedPayments = userPayments.sort((a, b) => b.date - a.date);
                setPayments(sortedPayments);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };

        fetchPayments();
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!paymentName || !amount) {
            setError('Please fill in all fields');
            return;
        }

        if (isNaN(amount)) {
            setError('Amount must be a number');
            return;
        }

        try {
            await deductFromChecking(userInfo.userID, amount);
            await addPayment(userInfo.userID, paymentName, amount);
            const userPayments = await getPayments(userInfo.userID);
            setPayments(userPayments.sort((a, b) => b.date - a.date));
            setPaymentName('');
            setAmount('');
            setError('');
        } catch (error) {
            setError('An error occurred while processing your payment');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg p-3 mb-5 bg-white rounded">
                        <div className="card-header text-center mb-4">
                            <h2 className="card-title styled-title">Pagar cuenta</h2>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-group">
                                    <label className="form-label styled-label" htmlFor="paymentName">Nombre del Pago:</label>
                                    <input
                                        className="form-control"
                                        id="paymentName"
                                        value={paymentName}
                                        onChange={(e) => setPaymentName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label styled-label" htmlFor="amount">Cantidad:</label>
                                    <input
                                        className="form-control"
                                        id="amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                                <button className="btn btn-primary btn-block styled-button" type="submit">Pagar</button>
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
                                        {payment.name} : ${payment.amount} - <strong>{new Date(payment.date).toLocaleDateString()}</strong>
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
