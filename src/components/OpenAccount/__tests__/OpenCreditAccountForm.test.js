import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OpenCreditAccountForm from '../OpenCreditAccountForm';
import { useNavigate } from 'react-router-dom';
import { accountExists, createAccount } from '../../Utils/firestoreUtils';
import { useGetUserInfo } from '../../../hooks/useGetUserInfo';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

jest.mock('../../../hooks/useGetUserInfo', () => ({
    useGetUserInfo: jest.fn(),
}));

jest.mock('../../Utils/firestoreUtils', () => ({
    accountExists: jest.fn(),
    createAccount: jest.fn(),
}));

describe('OpenCreditAccountForm Component', () => {
    const mockNavigate = jest.fn();
    const mockUserInfo = {
        userID: '123',
        name: 'John Doe',
    };

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        useGetUserInfo.mockReturnValue(mockUserInfo);
        accountExists.mockResolvedValue(false);
        createAccount.mockResolvedValue();
    });

    test('renders OpenCreditAccountForm component and handles form submission', async () => {
        render(<OpenCreditAccountForm />);

        expect(screen.getByText(/open credit account/i)).toBeInTheDocument();

        const employmentStatusSelect = screen.getByLabelText(/situación laboral/i);
        fireEvent.change(employmentStatusSelect, { target: { value: 'independiente' } });

        const incomeRangeSelect = screen.getByLabelText(/tramo de renta líquido/i);
        fireEvent.change(incomeRangeSelect, { target: { value: 'between_1000000_2500000' } });

        const datePickerInput = screen.getByLabelText(/birthday/i);
        fireEvent.change(datePickerInput, { target: { value: '01/01/2000' } });

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => expect(accountExists).toHaveBeenCalledWith(mockUserInfo.userID, 'credit'));
        await waitFor(() => expect(createAccount).toHaveBeenCalledWith(mockUserInfo.userID, 'credit', 20000));
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    test('shows error if account already exists', async () => {
        accountExists.mockResolvedValue(true);

        render(<OpenCreditAccountForm />);

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => expect(accountExists).toHaveBeenCalled());
        expect(screen.getByText(/you already have a credit account/i)).toBeInTheDocument();
    });

    test('shows error if user is under 18', async () => {
        render(<OpenCreditAccountForm />);

        const employmentStatusSelect = screen.getByLabelText(/situación laboral/i);
        fireEvent.change(employmentStatusSelect, { target: { value: 'independiente' } });

        const incomeRangeSelect = screen.getByLabelText(/tramo de renta líquido/i);
        fireEvent.change(incomeRangeSelect, { target: { value: 'between_1000000_2500000' } });

        const datePickerInput = screen.getByLabelText(/birthday/i);
        fireEvent.change(datePickerInput, { target: { value: new Date('01/01/2010') } });

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => expect(screen.queryByText(/you must be at least 18 years old/i)).toBeInTheDocument());
    });
});
