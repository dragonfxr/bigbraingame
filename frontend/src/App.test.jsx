import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders button with default title', () => {
    render(<App />);
    // expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    // expect(screen.getByText(/click me!/i)).toBeInTheDocument();
    // screen.getByRole('');
    // screen.debug();
    // screen.logTestingPlaygroundURL();
  });
})
