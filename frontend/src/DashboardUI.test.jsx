import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Existence of Buttons', () => {
  // ... other test cases

  it('checks the color of the "Show Create Game" button', () => {
    render(<Router><Dashboard /></Router>);

    const showCreateGameButton = screen.getByRole('button', { name: /show create game/i });
    const buttonStyle = window.getComputedStyle(showCreateGameButton);
    expect(buttonStyle.backgroundColor).toBe('rgb(25, 118, 210)');
  });

  it('checks the color of the "Log Out" button', () => {
    render(<Router><Dashboard /></Router>);

    const logOutButton = screen.getByRole('button', { name: /log out/i });
    const buttonStyle = window.getComputedStyle(logOutButton);
    expect(buttonStyle.backgroundColor).toBe('rgb(211, 47, 47)');
  });
});
