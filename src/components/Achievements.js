import React from 'react';

const achievementsList = {
  LUCKY_BEGINNER: { 
    name: 'Lucky Beginner', 
    icon: '🍀', 
    requirement: 'Win your first game',
    description: 'Your journey begins!'
  },
  STREAK_MASTER: { 
    name: 'Streak Master', 
    icon: '🔥', 
    requirement: 'Get a 5-win streak',
    description: 'You are on fire!'
  },
  FORTUNE_TELLER: { 
    name: 'Fortune Teller', 
    icon: '🔮', 
    requirement: 'Reach 90% luck',
    description: 'Master of destiny'
  }
};

const Achievements = ({ unlockedAchievements }) => {
  return (
    <div className="bg-white/90 rounded-lg p-6 mt-6">
      <h3 className="text-xl font-bold mb-4 text-center">Achievements</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(achievementsList).map(([key, achievement]) => (
          <div 
            key={key}
            className={`p-4 rounded-lg transition-all duration-300 ${
              unlockedAchievements[key] 
                ? 'bg-green-100 border-2 border-green-500' 
                : 'bg-gray-100 opacity-75'
            }`}
          >
            <div className="text-3xl mb-2 text-center">{achievement.icon}</div>
            <h4 className="font-bold text-center">{achievement.name}</h4>
            <p className="text-sm text-gray-600 text-center mt-1">{achievement.requirement}</p>
            {unlockedAchievements[key] && (
              <p className="text-sm text-green-600 font-semibold text-center mt-2">
                ✨ Unlocked! ✨
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements; 