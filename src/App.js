import React, { useState, useEffect } from 'react';
import LuckMeter from './components/LuckMeter';
import MiniGames from './components/MiniGames';
import Streak from './components/Streak';
import Achievement from './components/Achievements';
import Stats from './components/Stats';
import ThemeSelector from './components/ThemeSelector';
import Confetti from './components/Confetti';

const DAILY_PREDICTIONS = [
  "Today is your lucky day! Take that chance you've been thinking about!",
  "Caution advised, but don't let that stop you from trying!",
  "The stars align in your favor - perfect for new beginnings!",
  "A surprise opportunity will present itself soon!",
  "Your persistence will pay off - keep going!"
];

function App() {
  const [luckScore, setLuckScore] = useState(() => {
    const saved = localStorage.getItem('luckScore');
    return saved ? parseInt(saved) : 50;
  });
  
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('gameStats');
    return saved ? JSON.parse(saved) : {
      gamesPlayed: 0,
      totalWins: 0,
      winRate: 0,
      bestLuck: 50,
    };
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    return saved ? JSON.parse(saved) : {
      current: 0,
      best: 0
    };
  });

  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : {
      LUCKY_BEGINNER: false,
      STREAK_MASTER: false,
      FORTUNE_TELLER: false,
    };
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [dailyPrediction, setDailyPrediction] = useState('');

  useEffect(() => {
    localStorage.setItem('luckScore', luckScore.toString());
    localStorage.setItem('gameStats', JSON.stringify(stats));
    localStorage.setItem('streak', JSON.stringify(streak));
    localStorage.setItem('achievements', JSON.stringify(achievements));
    
    // Check achievements
    if (stats.totalWins === 1 && !achievements.LUCKY_BEGINNER) {
      setAchievements(prev => ({ ...prev, LUCKY_BEGINNER: true }));
      setShowConfetti(true);
    }
    if (streak.current >= 5 && !achievements.STREAK_MASTER) {
      setAchievements(prev => ({ ...prev, STREAK_MASTER: true }));
      setShowConfetti(true);
    }
    if (luckScore >= 90 && !achievements.FORTUNE_TELLER) {
      setAchievements(prev => ({ ...prev, FORTUNE_TELLER: true }));
      setShowConfetti(true);
    }
  }, [luckScore, stats, streak, achievements]);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('lastPredictionDate');
    
    if (today !== savedDate) {
      const newPrediction = DAILY_PREDICTIONS[Math.floor(Math.random() * DAILY_PREDICTIONS.length)];
      setDailyPrediction(newPrediction);
      localStorage.setItem('lastPredictionDate', today);
      localStorage.setItem('dailyPrediction', newPrediction);
    } else {
      setDailyPrediction(localStorage.getItem('dailyPrediction'));
    }
  }, []);

  const updateLuckScore = (gameScore, won) => {
    // Update stats first with correct calculations
    const newTotalWins = stats.totalWins + (won ? 1 : 0);
    const newGamesPlayed = stats.gamesPlayed + 1;
    
    const newStats = {
      gamesPlayed: newGamesPlayed,
      totalWins: newTotalWins,
      // Calculate win rate using the new totals
      winRate: Math.round((newTotalWins / newGamesPlayed) * 100),
      bestLuck: Math.max(stats.bestLuck, luckScore)
    };
    setStats(newStats);

    // Update streak
    const newStreak = {
      current: won ? streak.current + 1 : 0,
      best: Math.max(streak.best, won ? streak.current + 1 : streak.best)
    };
    setStreak(newStreak);

    // Apply time bonus
    const timeOfDay = new Date().getHours();
    const timeBonus = timeOfDay >= 11 && timeOfDay <= 13 ? 2 : 
                     timeOfDay >= 0 && timeOfDay <= 4 ? 3 : 0;
    
    // Add a random factor for more excitement
    const randomFactor = Math.random() * 10 - 5;
    
    // Calculate new luck score with bonus
    const bonusMultiplier = won ? (newStreak.current > 2 ? 1.5 : 1) : 1;
    const adjustedGameScore = gameScore * bonusMultiplier;
    
    const newScore = Math.min(100, Math.max(0, 
      luckScore + adjustedGameScore + randomFactor + timeBonus
    ));
    
    setLuckScore(Math.round(newScore));

    if (won) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary p-4">
      <div className="max-w-4xl mx-auto">
        <ThemeSelector 
          onThemeChange={(colors) => {
            // Theme colors will be automatically applied by the ThemeSelector
            // You can add additional theme-related logic here if needed
          }} 
        />

        <h1 className="text-4xl font-bold text-white text-center mb-8 animate-bounce-slow">
          Fortune Flux
        </h1>
        
        <Streak currentStreak={streak.current} bestStreak={streak.best} />
        
        {dailyPrediction && (
          <div className="bg-white/90 rounded-lg p-4 mb-6 text-center shadow-lg">
            <h3 className="text-lg font-semibold text-primary mb-2">Today's Fortune</h3>
            <p className="text-gray-700">{dailyPrediction}</p>
          </div>
        )}
        
        <LuckMeter score={luckScore} />
        <MiniGames onGameComplete={updateLuckScore} />
        
        <div className="mt-8">
          <Achievement unlockedAchievements={achievements} />
        </div>

        <Stats stats={stats} />
        
        <footer className="mt-8 text-center text-white/80 text-sm">
          <p>Best played during lucky hours (11 AM - 1 PM)</p>
          <p>Night owl bonus available (12 AM - 4 AM)</p>
          <p>Your luck is recalculated and saved automatically</p>
        </footer>
      </div>

      <Confetti active={showConfetti} />
    </div>
  );
}

export default App;
