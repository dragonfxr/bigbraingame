import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function LogOut () {
  const navigate = useNavigate();

  async function removeToken () {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Remove the token from local storage and navigate to the sign-in page
      localStorage.removeItem('token');
      navigate('/signin');
    } else {
      console.error('Error logging out');
    }
  }

  return (
    <Button variant="contained" color="error" onClick={removeToken}>
    Log out
  </Button>
  )
}

export default LogOut;
