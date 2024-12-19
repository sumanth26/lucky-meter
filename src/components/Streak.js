import React from 'react';

const Streak = ({ currentStreak, bestStreak }) => {
  return (
    <div className="bg-white/90 rounded-lg p-4 mb-4 flex justify-around">
      <div className="text-center">
        <p className="text-sm text-gray-600">Current Streak</p>
        <p className="text-2xl font-bold text-primary">🔥 {currentStreak}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">Best Streak</p>
        <p className="text-2xl font-bold text-secondary">⭐ {bestStreak}</p>
      </div>
    </div>
  );
};

export default Streak; 