import React from 'react';

const Stats = ({ stats }) => {
  return (
    <div className="bg-white/90 rounded-lg p-6 mt-6">
      <h3 className="text-xl font-bold mb-4 text-center">Your Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatItem 
          label="Games Played" 
          value={stats.gamesPlayed} 
          icon="🎮" 
        />
        <StatItem 
          label="Total Wins" 
          value={stats.totalWins} 
          icon="🏆" 
        />
        <StatItem 
          label="Win Rate" 
          value={`${stats.winRate || 0}%`} 
          icon="📈" 
        />
        <StatItem 
          label="Best Luck" 
          value={`${stats.bestLuck}%`} 
          icon="⭐" 
        />
      </div>
      {stats.gamesPlayed > 0 && (
        <div className="text-sm text-gray-500 text-center mt-4">
          You've won {stats.totalWins} out of {stats.gamesPlayed} games!
        </div>
      )}
    </div>
  );
};

const StatItem = ({ label, value, icon }) => (
  <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-lg font-bold text-primary">{value}</div>
  </div>
);

export default Stats; 