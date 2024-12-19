import React, { useState } from 'react';

const DiceRoll = ({ onResult }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [userGuess, setUserGuess] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const diceNumbers = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  const roll = (guess) => {
    setUserGuess(guess);
    setIsRolling(true);
    const result = Math.floor(Math.random() * 6) + 1;
    
    let count = 0;
    const rollInterval = setInterval(() => {
      setResult(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 10) {
        clearInterval(rollInterval);
        setIsRolling(false);
        setResult(result);
        setShowResult(true);
        setTimeout(() => {
          onResult(guess === result);
        }, 2000);
      }
    }, 200);
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-4">Lucky Dice Roll</h3>
      
      <div className={`w-32 h-32 mx-auto mb-6 bg-white shadow-lg rounded-xl
        flex items-center justify-center text-6xl
        ${isRolling ? 'animate-bounce-slow' : 'animate-float'}`}>
        {result ? diceNumbers[result - 1] : '?'}
      </div>

      {showResult && (
        <div className={`text-xl font-bold mb-4 ${userGuess === result ? 'text-green-500' : 'text-red-500'}`}>
          <p>Your guess: {diceNumbers[userGuess - 1]}</p>
          <p>Result: {diceNumbers[result - 1]}</p>
          <p className="text-2xl mt-2">
            {userGuess === result ? '🎉 You Won!' : '😔 You Lost!'}
          </p>
        </div>
      )}

      {!isRolling && !showResult && (
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6].map((number) => (
            <button
              key={number}
              onClick={() => roll(number)}
              className="bg-primary hover:bg-secondary text-white p-4 rounded-lg
                transition-all duration-300 transform hover:scale-105"
            >
              {diceNumbers[number - 1]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiceRoll; 