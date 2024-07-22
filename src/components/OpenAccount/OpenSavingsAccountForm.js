import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import { accountExists, createAccount } from '../Utils/firestoreUtils';
import './OpenSavingsAccountForm.css';

const OpenSavingsAccountForm = () => {
    const navigate = useNavigate();
    const userInfo = useGetUserInfo();
    const [formData, setFormData] = useState({
        employmentStatus: '',
        incomeRange: '',
        birthday: null
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const checkAccountExists = async () => {
            try {
                if (userInfo) {
                    const exists = await accountExists(userInfo.userID, 'savings');
                    if (exists) {
                        setError('You already have a Savings Account.');
                    }
                }
            } catch (error) {
                console.error('Error checking account existence:', error);
                setError('An error occurred while checking account existence.');
            }
        };

        checkAccountExists();
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const age = new Date().getFullYear() - formData.birthday.getFullYear();
        if (age < 18) {
            setError('You must be at least 18 years old to open an account.');
            return;
        }

        try {
            if (userInfo) {
                const exists = await accountExists(userInfo.userID, 'savings');
                if (exists) {
                    setError('You already have a Savings Account.');
                    return;
                }

                await createAccount(userInfo.userID, 'savings', 20000); // Create savings account with initial balance
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error creating account:', error);
            setError('An error occurred while creating the account. Please try again later.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg p-3 mb-5 bg-white rounded">
                        <div className="card-header text-center mb-4">
                            <h2 className="card-title styled-title">Open Savings Account</h2>
                        </div>
                        <div className="card-body">
                            {error && (
                                <>
                                    <div className="alert alert-danger">{error}</div>
                                    <button 
                                        className="btn btn-primary btn-block styled-button" 
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        Volver a Home
                                    </button>
                                </>
                            )}
                            {!error && (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label className="form-label styled-label">Nombres:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="firstName"
                                                value={userInfo.name.split(' ')[0]}
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label className="form-label styled-label">Apellido Paterno:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="lastName"
                                                value={userInfo.name.split(' ')[1]}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label className="form-label styled-label">Situación Laboral:</label>
                                            <select
                                                className="form-control"
                                                name="employmentStatus"
                                                value={formData.employmentStatus}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Selecciona una opción</option>
                                                <option value="independiente">Independiente</option>
                                                <option value="dependiente">Dependiente</option>
                                            </select>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label className="form-label styled-label">Tramo de renta líquido:</label>
                                            <select
                                                className="form-control"
                                                name="incomeRange"
                                                value={formData.incomeRange}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Selecciona una opción</option>
                                                <option value="less_than_1000000">Menos de 1.000.000</option>
                                                <option value="between_1000000_2500000">Entre 1.000.000 y 2.500.000</option>
                                                <option value="more_than_2500000">Más de 2.500.000</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label styled-label">Birthday:</label>
                                        <DatePicker
                                            selected={formData.birthday}
                                            onChange={(date) => setFormData({ ...formData, birthday: date })}
                                            className="form-control"
                                            dateFormat="MM/dd/yyyy"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block styled-button">Submit</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenSavingsAccountForm;
