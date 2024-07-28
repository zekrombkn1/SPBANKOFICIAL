import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransferToThirds from '../TransferToThirds';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

beforeEach(() => {
  mockNavigate.mockClear();
  useNavigate.mockReturnValue(mockNavigate);
});

describe('TransferToThirds Component', () => {
  test('displays error message when RUT not found', async () => {
    const { getByLabelText, getByRole, getByText } = render(<TransferToThirds />);
    fireEvent.change(getByLabelText(/Recipient RUT/i), { target: { value: 'wrong-rut' } });
    fireEvent.click(getByRole('button', { name: /Find User/i }));

    await waitFor(() => {
      expect(getByText('RUT not found. Please check and try again.')).toBeInTheDocument();
    });
  });

  test('shows error message when fields are empty', async () => {
    const { getByLabelText, getByRole, getByText } = render(<TransferToThirds />);
    fireEvent.change(getByLabelText(/Recipient RUT/i), { target: { value: '12345678-9' } });
    fireEvent.click(getByRole('button', { name: /Find User/i }));

    await waitFor(() => {
      expect(getByRole('button', { name: /Transfer/i })).toBeInTheDocument();
    });

    fireEvent.click(getByRole('button', { name: /Transfer/i }));

    await waitFor(() => {
      expect(getByText('Please complete all fields.')).toBeInTheDocument();
    });
  });

  test('shows error message for insufficient funds', async () => {
    const { getByLabelText, getByRole, getByText } = render(<TransferToThirds />);
    fireEvent.change(getByLabelText(/Recipient RUT/i), { target: { value: '12345678-9' } });
    fireEvent.click(getByRole('button', { name: /Find User/i }));

    await waitFor(() => {
      expect(getByRole('button', { name: /Transfer/i })).toBeInTheDocument();
    });

    fireEvent.change(getByLabelText(/Amount/i), { target: { value: '200' } });
    fireEvent.click(getByRole('button', { name: /Transfer/i }));

    await waitFor(() => {
      expect(getByText('Insufficient funds in the origin account.')).toBeInTheDocument();
    });
  });

  test('successful transfer navigates to dashboard', async () => {
    const { getByLabelText, getByRole } = render(<TransferToThirds />);
    fireEvent.change(getByLabelText(/Recipient RUT/i), { target: { value: '12345678-9' } });
    fireEvent.click(getByRole('button', { name: /Find User/i }));

    await waitFor(() => {
      expect(getByRole('button', { name: /Transfer/i })).toBeInTheDocument();
    });

    fireEvent.change(getByLabelText(/Amount/i), { target: { value: '50' } });
    fireEvent.click(getByRole('button', { name: /Transfer/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('fetches balances on mount', async () => {
    const { getByText } = render(<TransferToThirds />);

    await waitFor(() => {
      expect(getByText('Transfer to Third Parties')).toBeInTheDocument();
    });

    // Assuming the component fetches balances on mount
    // Add your specific assertions here
  });
});
