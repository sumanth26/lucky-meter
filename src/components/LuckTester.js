import React, { useState, useEffect } from 'react';
import GameModal from './GameModal';
import CoinFlip from './games/CoinFlip';
import DiceRoll from './games/DiceRoll';
import CardDraw from './games/CardDraw';

const games = {
  coinFlip: {
    title: 'Coin Flip',
    description: 'Test your luck with heads or tails!',
    emoji: '🪙',
    component: CoinFlip
  },
  diceRoll: {
    title: 'Dice Roll',
    description: 'Guess the lucky number!',
    emoji: '🎲',
    component: DiceRoll
  },
  cardDraw: {
    title: 'Card Draw',
    description: 'Pick the right suit!',
    emoji: '🃏',
    component: CardDraw
  }
};

const getLuckPun = (score) => {
  if (score === 100) return "You're so lucky, even leprechauns are taking notes! 🍀";
  if (score >= 80) return "The stars aren't just aligned, they're doing a conga line for you! ⭐";
  if (score >= 60) return "Lady Luck just sent you a friend request! 🎯";
  if (score >= 40) return "Your luck's warming up like a morning coffee! ☕";
  if (score >= 20) return "Hey, at least your bad luck is consistently impressive! 😅";
  return "Your luck's taking a vacation, but it left a postcard! 🏖️";
};

const LuckTester = ({ onGameComplete }) => {
  const [testStatus, setTestStatus] = useState(() => {
    const saved = localStorage.getItem('dailyTestStatus');
    return saved ? JSON.parse(saved) : {
      completed: false,
      lastCompletedDate: null,
      gamesPlayed: {
        coinFlip: 0,
        diceRoll: 0,
        cardDraw: 0
      },
      wins: 0,
      totalGames: 0
    };
  });

  const [activeGame, setActiveGame] = useState(null);
  const [dailyLuckScore, setDailyLuckScore] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Check if it's a new day
    const today = new Date().toDateString();
    if (testStatus.lastCompletedDate !== today) {
      setTestStatus(prev => ({
        ...prev,
        completed: false,
        gamesPlayed: {
          coinFlip: 0,
          diceRoll: 0,
          cardDraw: 0
        },
        wins: 0,
        totalGames: 0
      }));
      setDailyLuckScore(null);
    }
  }, [testStatus.lastCompletedDate]);

  useEffect(() => {
    localStorage.setItem('dailyTestStatus', JSON.stringify(testStatus));
  }, [testStatus]);

  const calculateDailyLuck = () => {
    // Calculate win rate based on total games played so far
    const winRate = (testStatus.wins / testStatus.totalGames) * 100;
    
    // Check if all games have been played at least once
    const allGamesPlayed = Object.values(testStatus.gamesPlayed).every(count => count > 0);
    
    // Return 0 if not all games have been tried yet
    if (!allGamesPlayed) {
      return 0;
    }

    return Math.round(winRate);
  };

  const handleGameComplete = (gameType, won) => {
    if (testStatus.completed) return;

    const newStatus = {
      ...testStatus,
      gamesPlayed: {
        ...testStatus.gamesPlayed,
        [gameType]: testStatus.gamesPlayed[gameType] + 1
      },
      wins: testStatus.wins + (won ? 1 : 0),
      totalGames: testStatus.totalGames + 1
    };

    // Calculate current luck score even before completion
    const currentLuckScore = calculateDailyLuck();
    setDailyLuckScore(currentLuckScore);

    // Check if test is complete (5 games played and all games played at least once)
    if (newStatus.totalGames === 5) {
      const allGamesPlayed = Object.values(newStatus.gamesPlayed).every(count => count > 0);
      if (allGamesPlayed) {
        newStatus.completed = true;
        newStatus.lastCompletedDate = new Date().toDateString();
        const finalLuckScore = calculateDailyLuck();
        setDailyLuckScore(finalLuckScore);
      }
    }

    setTestStatus(newStatus);
    onGameComplete(won);
    setActiveGame(null);
  };

  const getRequiredGames = () => {
    const total = 5;
    const played = testStatus.totalGames;
    return total - played;
  };

  const LuckMeterCircle = ({ score }) => (
    <div className="relative w-48 h-48 mx-auto mb-4">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="70"
          cx="96"
          cy="96"
        />
        <circle
          className="text-primary transition-all duration-1000"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="70"
          cx="96"
          cy="96"
          strokeDasharray={`${score * 4.4} 440`}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-3xl font-bold">{score}%</span>
        <span className="block text-sm text-gray-500">Luck Score</span>
      </div>
    </div>
  );

  if (testStatus.completed) {
    if (isMinimized) {
      return (
        <div 
          className="bg-white/90 rounded-lg p-4 mb-6 cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setIsMinimized(false)}
        >
          <h3 className="text-lg font-bold mb-2">Your Luck Score Today</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-gray-200"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                  r="24"
                  cx="32"
                  cy="32"
                />
                <circle
                  className="text-primary transition-all duration-1000"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                  r="24"
                  cx="32"
                  cy="32"
                  strokeDasharray={`${dailyLuckScore * 1.5} 150`}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-sm font-bold">{dailyLuckScore}%</span>
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">
                {getLuckPun(dailyLuckScore)}
              </p>
            </div>
            
            <div className="text-gray-400 hover:text-gray-600">
              <span className="text-xs">Click to expand</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/90 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">Daily Luck Test Completed!</h3>
          <button 
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            Minimize ▼
          </button>
        </div>
        
        <p className="text-center text-gray-600">
          Come back tomorrow to test your luck again!
        </p>
        
        <LuckMeterCircle score={dailyLuckScore} />
        
        <div className="mt-4 text-center">
          <p className="font-bold">Today's Results:</p>
          <p>Games Won: {testStatus.wins} / 5</p>
          <p className="text-xl font-bold mt-2 text-primary">{getLuckPun(dailyLuckScore)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-center mb-4">Test Your Luck Today!</h3>
      <p className="text-center text-gray-600 mb-4">
        Play 5 games to discover your luck score for today.
        You must play each game at least once!
      </p>

      {testStatus.totalGames > 0 && (
        <div className="text-center mb-4">
          <p className="font-bold">Current Progress:</p>
          <p>Games Won: {testStatus.wins} / {testStatus.totalGames}</p>
          {dailyLuckScore !== null && (
            <p className="text-lg font-bold text-primary mt-2">
              Current Luck Score: {dailyLuckScore}%
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(games).map(([gameKey, game]) => (
          <div 
            key={gameKey}
            className={`
              p-4 rounded-lg text-center cursor-pointer
              transition-all duration-300 transform hover:scale-105
              ${testStatus.gamesPlayed[gameKey] > 0 ? 'bg-green-100' : 'bg-gray-50'}
              ${testStatus.totalGames >= 5 && testStatus.gamesPlayed[gameKey] === 0
                ? 'border-2 border-red-500' 
                : ''}
            `}
            onClick={() => {
              if (testStatus.totalGames < 5) {
                setActiveGame(gameKey);
              }
            }}
          >
            <div className="text-3xl mb-2">{game.emoji}</div>
            <p className="font-bold">{game.title}</p>
            <p className="text-sm text-gray-600">
              {testStatus.gamesPlayed[gameKey] === 0 ? 'Not played yet' :
               `Played ${testStatus.gamesPlayed[gameKey]} time${testStatus.gamesPlayed[gameKey] > 1 ? 's' : ''}`}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="text-lg font-bold mb-2">
          {getRequiredGames()} games remaining
        </div>
        {testStatus.totalGames >= 5 && !Object.values(testStatus.gamesPlayed).every(count => count > 0) && (
          <p className="text-red-500">
            You must play each game at least once to complete the test!
          </p>
        )}
      </div>

      {Object.entries(games).map(([gameKey, game]) => (
        <GameModal
          key={gameKey}
          isOpen={activeGame === gameKey}
          onClose={() => setActiveGame(null)}
        >
          <game.component
            onResult={(won) => handleGameComplete(gameKey, won)}
          />
        </GameModal>
      ))}
    </div>
  );
};

export default LuckTester; 