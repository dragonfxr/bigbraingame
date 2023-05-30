import React from 'react';
import ErrorPopup from './ErrorPopup';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

function SignIn ({ onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();

  // click the register button, fetch data
  async function login () {
    if (!email || !password) {
      setErrorMessage('Email, password are required.');
      return;
    }
    const response = await fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      })
    });
    if (response.ok) {
      const data = await response.json();
      onSuccess(data.token);
      navigate('/dashboard');
    } else {
      setErrorMessage('Invalid email or password.');
    }
  }

  return (
    <>
    {errorMessage && (
  <ErrorPopup
    message={errorMessage}
    onClose={() => setErrorMessage('')}
  />
    )}

<Container maxWidth="sm">
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh"
  >
    <Box display="flex" alignItems="center">
      <Button onClick={() => navigate('/signup')} variant="contained" color="primary">
        Sign up
      </Button>
      <Box component="span" mx={1}>
        |
      </Box>
      <Button onClick={() => navigate('/signin')} variant="contained" color="primary">
        Sign in
      </Button>
    </Box>
    <Box mt={2}>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
    </Box>
    <Box mt={2}>
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
    </Box>
    <Box mt={2}>
      <Button onClick={login} variant="contained" color="secondary">
        Sign In
      </Button>
    </Box>
  </Box>
</Container>

  </>
  )
}

export default SignIn;
