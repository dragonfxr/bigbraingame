import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const JoinSession = ({ onJoin }) => {
  const [playerName, setPlayerName] = useState('');
  const params = useParams();

  const handleJoinClick = async () => {
    if (playerName.trim()) {
      // Send the player's name to the backend
      const response = await fetch(`http://localhost:5005/play/join/${params.sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: playerName }),
      });

      if (response.ok) {
        onJoin(playerName);
      } else {
        // Handle error (e.g., show an error message)
        console.error('Error joining session:', response.statusText);
      }
    }
  };

  return (
    <div className="join-session">
      <Typography variant="h4">Join the Session</Typography>
      <TextField
        label="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <Button variant="contained" color="primary" onClick={handleJoinClick}>
        Join
      </Button>
    </div>
  );
};

export default JoinSession;
