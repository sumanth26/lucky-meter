import React from 'react';

const Streak = ({ currentStreak, bestStreak }) => {
  return (
    <div className="bg-white/90 rounded-lg py-2 px-6 mb-6 shadow-lg">
      <div className="flex justify-center items-center gap-12">
        <div className="text-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="text-xs text-gray-600 uppercase tracking-wide">Current</span>
          </div>
          <div className="text-2xl font-bold text-primary animate-pulse-slow">
            {currentStreak || 0}
          </div>
        </div>
        
        <div className="h-8 w-px bg-gray-200"></div>
        
        <div className="text-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <span className="text-xs text-gray-600 uppercase tracking-wide">Best</span>
          </div>
          <div className="text-2xl font-bold text-secondary">
            {bestStreak || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Streak; 