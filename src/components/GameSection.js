import React from 'react';

const GameSection = ({ title, description, emoji, onPlay, isActive, cooldown }) => {
  const checkCooldown = () => {
    if (!cooldown) return true;
    const cooldownTime = 10000; // 10 seconds
    return Date.now() - cooldown >= cooldownTime;
  };

  const canPlay = checkCooldown();

  return (
    <div className="bg-white/90 rounded-lg p-6 shadow-lg">
      <div className="text-4xl mb-4 text-center">{emoji}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <button
        onClick={onPlay}
        className={`
          w-full px-6 py-3 rounded-lg
          flex items-center justify-center gap-3
          transition-all duration-300 transform
          ${isActive ? 'scale-95' : 'hover:scale-105'}
          ${!canPlay 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-primary hover:bg-secondary text-white shadow-lg hover:shadow-xl'
          }
        `}
        disabled={!canPlay || isActive}
      >
        <span className="text-2xl">{emoji}</span>
        <span className="font-bold">
          {!canPlay ? 'Cooling Down...' : 'Play Now'}
        </span>
      </button>
      
      {!canPlay && (
        <div className="mt-2 text-center text-sm text-gray-500">
          Please wait a moment before playing again
        </div>
      )}
    </div>
  );
};

export default GameSection; 