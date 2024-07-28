import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';  // Importa jest-dom aquí
import Login from '../Login';

test('renders Login component', () => {
  render(
    <Router>
      <Login />
    </Router>
  );
  const linkElement = screen.getByText(/Sign in with Google to Continue/i);
  expect(linkElement).toBeInTheDocument();
});
