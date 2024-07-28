import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PayAccount from '../PayAccount';
import { useGetUserInfo } from '../../../hooks/useGetUserInfo';
import { addPayment, getPayments, deductFromChecking } from '../../Utils/firestoreUtils';

jest.mock('../../../hooks/useGetUserInfo');
jest.mock('../../Utils/firestoreUtils');

describe('PayAccount Component', () => {
    test('shows error message when form is incomplete', async () => {
        useGetUserInfo.mockReturnValue({ userID: 'testUserId' });
        deductFromChecking.mockResolvedValue();
        addPayment.mockResolvedValue();
        getPayments.mockResolvedValue([]);

        await act(async () => {
            render(<PayAccount />);
        });

        const submitButton = screen.getByRole('button', { name: /pagar/i });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        const errorMessage = await screen.findByText(/please fill in all fields/i);
        expect(errorMessage).toBeInTheDocument();
    });

    test('shows error message when amount is not a number', async () => {
        useGetUserInfo.mockReturnValue({ userID: 'testUserId' });
        deductFromChecking.mockResolvedValue();
        addPayment.mockResolvedValue();
        getPayments.mockResolvedValue([]);

        await act(async () => {
            render(<PayAccount />);
        });

        const paymentNameInput = screen.getByLabelText(/nombre del pago/i);
        const amountInput = screen.getByLabelText(/cantidad/i);

        await act(async () => {
            fireEvent.change(paymentNameInput, { target: { value: 'Electricity' } });
            fireEvent.change(amountInput, { target: { value: 'abc' } });
        });

        const submitButton = screen.getByRole('button', { name: /pagar/i });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        const errorMessage = await screen.findByText(/amount must be a number/i);
        expect(errorMessage).toBeInTheDocument();
    });
});
