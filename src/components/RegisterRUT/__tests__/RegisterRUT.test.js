import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RegisterRUT from '../RegisterRUT';
import { setRUT } from '/Users/Pillich/Desktop/BancoSP/spbank/src/components/Utils/firestoreUtils';

jest.mock('/Users/Pillich/Desktop/BancoSP/spbank/src/components/Utils/firestoreUtils', () => ({
  setRUT: jest.fn(),
}));

describe('RegisterRUT Component', () => {
  test('renders RegisterRUT component and submits form', async () => {
    render(
      <Router>
        <RegisterRUT />
      </Router>
    );

    const input = screen.getByLabelText(/rut/i);
    fireEvent.change(input, { target: { value: '12345678' } }); // Proporcionar un RUT válido

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(setRUT).toHaveBeenCalled());
  });
});
