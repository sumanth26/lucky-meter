import React, { useState, useEffect } from 'react';
import ThemeSelector from './components/ThemeSelector';
import GameCard from './components/GameCard';
import Stats from './components/Stats';
import LuckTester from './components/LuckTester';
import Streak from './components/Streak';

function App() {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('gameStats');
    return saved ? JSON.parse(saved) : {
      gamesPlayed: 0,
      totalWins: 0,
      winRate: 0,
      currentStreak: 0,
      bestStreak: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('gameStats', JSON.stringify(stats));
  }, [stats]);

  const handleGameComplete = (won) => {
    // Update overall stats
    const newTotalWins = stats.totalWins + (won ? 1 : 0);
    const newGamesPlayed = stats.gamesPlayed + 1;
    
    // Calculate new streak values
    let newCurrentStreak = won ? stats.currentStreak + 1 : 0;
    let newBestStreak = stats.bestStreak;
    
    // Update best streak if current streak exceeds it
    if (newCurrentStreak > newBestStreak) {
      newBestStreak = newCurrentStreak;
    }

    setStats({
      gamesPlayed: newGamesPlayed,
      totalWins: newTotalWins,
      winRate: Math.round((newTotalWins / newGamesPlayed) * 100),
      currentStreak: newCurrentStreak,
      bestStreak: newBestStreak
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary p-4">
      <div className="max-w-4xl mx-auto">
        <ThemeSelector />

        <h1 className="text-4xl font-bold text-white text-center mb-8 animate-bounce-slow">
          Fortune Flux
        </h1>

        <Streak 
          currentStreak={stats.currentStreak} 
          bestStreak={stats.bestStreak}
        />

        <LuckTester 
          onGameComplete={handleGameComplete}
        />

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Practice Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GameCard gameType="coinFlip" onComplete={handleGameComplete} />
            <GameCard gameType="diceRoll" onComplete={handleGameComplete} />
            <GameCard gameType="cardDraw" onComplete={handleGameComplete} />
          </div>
        </div>

        <Stats stats={stats} />
        
        <footer className="mt-8 text-center text-white/80 text-sm">
          <p>Test your luck once per day!</p>
          <p>Practice games available anytime</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
