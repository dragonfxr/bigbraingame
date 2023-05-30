import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ time, onNext }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(time);

  useEffect(() => {
    if (secondsRemaining > 0) {
      const timer = setTimeout(() => {
        setSecondsRemaining(secondsRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      onNext();
    }
  }, [secondsRemaining, onNext]);

  return <div>Time remaining: {secondsRemaining} seconds</div>;
};

export default CountdownTimer;
