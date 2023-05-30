import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import EditGame from './components/EditGame.jsx';
import React from 'react';

describe('Existence of Buttons in EditGame Page', () => {
  it('renders "Change Name" and "Add Question" buttons', () => {
    render(
      <Router>
        <EditGame token="dummy_token" />
      </Router>
    );

    expect(
      screen.getByRole('button', { name: /change name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add question/i })
    ).toBeInTheDocument();
  });
});
