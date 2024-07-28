import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import TransferBetweenMyAccounts from '../TransferBetweenMyAccounts';
import { transferFunds } from '../../Utils/firestoreUtils';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('../../Utils/firestoreUtils', () => ({
    transferFunds: jest.fn(() => Promise.resolve()),
}));

describe('TransferBetweenMyAccounts Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    });

    test('shows error message when fields are empty', async () => {
        render(
            <BrowserRouter>
                <TransferBetweenMyAccounts />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /Transfer/i }));

        await waitFor(() => {
            expect(screen.getByTestId('error-messages')).toHaveTextContent('Please select both origin and destination accounts');
        });
    });

    test('shows error message when amount is not a number', async () => {
        render(
            <BrowserRouter>
                <TransferBetweenMyAccounts />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Enter amount/i), { target: { value: 'abc' } });
        fireEvent.click(screen.getByRole('button', { name: /Transfer/i }));

        await waitFor(() => {
            expect(screen.getByTestId('error-messages')).toHaveTextContent('Amount must be a number');
        });
    });

    test('shows error message when transferring from credit account', async () => {
        render(
            <BrowserRouter>
                <TransferBetweenMyAccounts />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Origin Account/i), { target: { value: 'credit' } });
        fireEvent.change(screen.getByLabelText(/Destination Account/i), { target: { value: 'savings' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter amount/i), { target: { value: '100' } });
        fireEvent.click(screen.getByRole('button', { name: /Transfer/i }));

        await waitFor(() => {
            expect(screen.getByTestId('error-messages')).toHaveTextContent('You cannot transfer funds from a credit account');
        });
    });

    test('successful transfer navigates to dashboard', async () => {
        transferFunds.mockResolvedValueOnce();

        render(
            <BrowserRouter>
                <TransferBetweenMyAccounts />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Origin Account/i), { target: { value: 'checking' } });
        fireEvent.change(screen.getByLabelText(/Destination Account/i), { target: { value: 'savings' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter amount/i), { target: { value: '500' } });
        fireEvent.click(screen.getByRole('button', { name: /Transfer/i }));

        await waitFor(() => {
            console.log('mockNavigate calls:', mockNavigate.mock.calls); // Añadir esta línea      
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });
});
