import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import React from 'react';

describe('Dashboard Component Tests', () => {
  beforeEach(() => {
    render(
      <Router>
        <Dashboard token="dummy_token" />
      </Router>
    );
  });

  it('renders the header', () => {
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/List of Games/i)).toBeInTheDocument();
  });

  it('renders "Show Create Game" button and toggles new game form', () => {
    const showCreateGameButton = screen.getByRole('button', { name: /show create game/i });
    expect(showCreateGameButton).toBeInTheDocument();

    fireEvent.click(showCreateGameButton);
    expect(screen.getByText(/From here for new game!/i)).toBeInTheDocument();

    fireEvent.click(showCreateGameButton);
    expect(screen.queryByText(/From here for new game!/i)).not.toBeInTheDocument();
  });
});
