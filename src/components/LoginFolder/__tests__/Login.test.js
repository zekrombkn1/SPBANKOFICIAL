// src/components/Login/__tests__/Login.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';

test('renders Login component and checks elements', () => {
    render(<Login />);
    
    // Check if the title is rendered
    const titleElement = screen.getByText(/SPBank/i);
    expect(titleElement).toBeInTheDocument();
    
    // Check if the login button is rendered
    const loginButton = screen.getByText(/Login with Google/i);
    expect(loginButton).toBeInTheDocument();
    
    // Check if the register button is rendered
    const registerButton = screen.getByText(/Register with Google/i);
    expect(registerButton).toBeInTheDocument();
    
    // Simulate a click event on the login button
    fireEvent.click(loginButton);
    
    // You can add more assertions here to check for expected behavior
});
