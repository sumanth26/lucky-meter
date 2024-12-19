import React, { useState } from 'react';

const CoinFlip = ({ onResult }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [userChoice, setUserChoice] = useState(null);

  const flip = (userGuess) => {
    setUserChoice(userGuess ? 'Heads' : 'Tails');
    setIsFlipping(true);
    const result = Math.random() < 0.5;
    
    setTimeout(() => {
      setIsFlipping(false);
      setResult(result);
      setShowResult(true);
      setTimeout(() => {
        onResult(userGuess === result);
      }, 2000);
    }, 3000);
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-4">Coin Flip Challenge</h3>
      
      <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-yellow-400 
        flex items-center justify-center text-4xl
        ${isFlipping ? 'animate-[spin_0.5s_linear_infinite]' : ''}`}>
        {!isFlipping && (result !== null ? (result ? 'H' : 'T') : '?')}
      </div>

      {showResult && (
        <div className={`text-xl font-bold mb-4 ${result === (userChoice === 'Heads') ? 'text-green-500' : 'text-red-500'}`}>
          <p>You chose: {userChoice}</p>
          <p>Result: {result ? 'Heads' : 'Tails'}</p>
          <p className="text-2xl mt-2">
            {result === (userChoice === 'Heads') ? '🎉 You Won!' : '😔 You Lost!'}
          </p>
        </div>
      )}

      {!isFlipping && !showResult && (
        <div className="space-x-4">
          <button
            onClick={() => flip(true)}
            className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg"
          >
            Heads
          </button>
          <button
            onClick={() => flip(false)}
            className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg"
          >
            Tails
          </button>
        </div>
      )}
    </div>
  );
};

export default CoinFlip; 