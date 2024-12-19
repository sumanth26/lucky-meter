import React, { useState } from 'react';

const CardDraw = ({ onResult }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState(null);
  const [userGuess, setUserGuess] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const suits = {
    '♠️': 'Spades',
    '♣️': 'Clubs',
    '♥️': 'Hearts',
    '♦️': 'Diamonds'
  };

  const draw = (guess) => {
    setUserGuess(guess);
    setIsDrawing(true);
    const suitsList = Object.keys(suits);
    const result = suitsList[Math.floor(Math.random() * suitsList.length)];
    
    let count = 0;
    const drawInterval = setInterval(() => {
      setResult(suitsList[Math.floor(Math.random() * suitsList.length)]);
      count++;
      if (count > 10) {
        clearInterval(drawInterval);
        setIsDrawing(false);
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
      <h3 className="text-xl font-bold mb-4">Card Suit Draw</h3>
      
      <div className={`w-32 h-44 mx-auto mb-6 bg-white shadow-lg rounded-xl
        flex items-center justify-center text-6xl
        ${isDrawing ? 'animate-flip-in' : 'animate-float'}
        ${result === '♥️' || result === '♦️' ? 'text-red-500' : 'text-black'}`}>
        {result || '🃏'}
      </div>

      {showResult && (
        <div className={`text-xl font-bold mb-4 ${userGuess === result ? 'text-green-500' : 'text-red-500'}`}>
          <p>Your choice: {userGuess} ({suits[userGuess]})</p>
          <p>Result: {result} ({suits[result]})</p>
          <p className="text-2xl mt-2">
            {userGuess === result ? '🎉 You Won!' : '😔 You Lost!'}
          </p>
        </div>
      )}

      {!isDrawing && !showResult && (
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
          {Object.entries(suits).map(([suit, name]) => (
            <button
              key={suit}
              onClick={() => draw(suit)}
              className={`
                p-4 rounded-lg text-2xl
                transition-all duration-300 transform hover:scale-105
                ${(suit === '♥️' || suit === '♦️') 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-800 hover:bg-gray-900'} 
                text-white
              `}
            >
              {suit}
              <span className="block text-sm mt-1">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardDraw; 