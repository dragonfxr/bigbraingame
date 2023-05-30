import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignIn from './components/SignIn';
import React from 'react';

describe('SignIn Component Tests', () => {
  const onSuccessMock = jest.fn();

  beforeEach(() => {
    render(
      <Router>
        <SignIn onSuccess={onSuccessMock} />
      </Router>
    );
  });

  it('renders the Sign In form and fields', () => {
    expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('updates the email and password fields', () => {
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test_password' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('test_password');
  });
});
