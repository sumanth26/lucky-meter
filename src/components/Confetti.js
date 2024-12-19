import React from 'react';
import ReactConfetti from 'react-confetti';

const Confetti = ({ active }) => {
  if (!active) return null;
  
  return (
    <ReactConfetti
      width={window.innerWidth}
      height={window.innerHeight}
      recycle={false}
      numberOfPieces={200}
      gravity={0.3}
    />
  );
};

export default Confetti; 