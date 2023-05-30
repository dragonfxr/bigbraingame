import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import './global.css';

const HomePage = () => {
  const navigate = useNavigate();
  return <>
<div className="background-container">
  <div className="button-container">
  <Button
        onClick={() => navigate('/signup')}
        variant="contained"
        color="primary"
        size="large"
        style={{ fontSize: '1.5rem', padding: '12px 24px' }}
      >
        Sign up
      </Button>
</div>
<br />
<div className="button-container">
      <Button
        onClick={() => navigate('/signin')}
        variant="contained"
        color="primary"
        size="large"
        style={{ fontSize: '1.5rem', padding: '12px 24px' }}
      >
        Sign in
      </Button>
  </div>
</div>

    </>
}

export default HomePage;
