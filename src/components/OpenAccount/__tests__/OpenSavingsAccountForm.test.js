import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OpenSavingsAccountForm from '../OpenSavingsAccountForm';
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

describe('OpenSavingsAccountForm Component', () => {
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

    test('renders OpenSavingsAccountForm component and handles form submission', async () => {
        render(<OpenSavingsAccountForm />);

        expect(screen.getByText(/open savings account/i)).toBeInTheDocument();

        const employmentStatusSelect = screen.getByLabelText(/situación laboral/i);
        fireEvent.change(employmentStatusSelect, { target: { value: 'independiente' } });

        const incomeRangeSelect = screen.getByLabelText(/tramo de renta líquido/i);
        fireEvent.change(incomeRangeSelect, { target: { value: 'between_1000000_2500000' } });

        const datePickerInput = screen.getByLabelText(/birthday/i);
        fireEvent.change(datePickerInput, { target: { value: '01/01/2000' } });

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => expect(accountExists).toHaveBeenCalledWith(mockUserInfo.userID, 'savings'));
        await waitFor(() => expect(createAccount).toHaveBeenCalledWith(mockUserInfo.userID, 'savings', 5000));
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    test('shows error if account already exists', async () => {
        accountExists.mockResolvedValue(true);

        render(<OpenSavingsAccountForm />);

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => expect(accountExists).toHaveBeenCalled());
        expect(screen.getByText(/you already have a savings account/i)).toBeInTheDocument();
    });

    test('shows error if user is under 18', async () => {
        render(<OpenSavingsAccountForm />);

        const employmentStatusSelect = screen.getByLabelText(/situación laboral/i);
        fireEvent.change(employmentStatusSelect, { target: { value: 'independiente' } });

        const incomeRangeSelect = screen.getByLabelText(/tramo de renta líquido/i);
        fireEvent.change(incomeRangeSelect, { target: { value: 'between_1000000_2500000' } });

        const datePickerInput = screen.getByLabelText(/birthday/i);
        fireEvent.change(datePickerInput, { target: { value: '01/01/2010' } });

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => expect(screen.queryByText(/you must be at least 18 years old/i)).toBeInTheDocument());
    });
});
