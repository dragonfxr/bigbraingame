import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignUp from './components/Signup';
import React from 'react';

describe('SignUp Component Tests', () => {
  const onSuccessMock = jest.fn();

  beforeEach(() => {
    render(
      <Router>
        <SignUp onSuccess={onSuccessMock} />
      </Router>
    );
  });

  it('renders the Sign Up form and fields', () => {
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  });

  it('updates the email, password, and name fields', () => {
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const nameInput = screen.getByLabelText(/Name/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test_password' } });
    fireEvent.change(nameInput, { target: { value: 'Test Name' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('test_password');
    expect(nameInput.value).toBe('Test Name');
  });
});
