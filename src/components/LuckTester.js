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

const LuckTester = ({ onGameComplete, onReset }) => {
  const initialState = {
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

  const [testStatus, setTestStatus] = useState(() => {
    const saved = localStorage.getItem('dailyTestStatus');
    return saved ? JSON.parse(saved) : initialState;
  });

  const [activeGame, setActiveGame] = useState(null);
  const [dailyLuckScore, setDailyLuckScore] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

  const handleGameClick = (gameKey) => {
    // Don't allow more games if already completed 5
    if (testStatus.totalGames >= 5) return;

    // Calculate remaining games
    const remainingGames = 5 - testStatus.totalGames;
    
    // Count unplayed games
    const unplayedGames = Object.entries(testStatus.gamesPlayed)
      .filter(([_, count]) => count === 0)
      .length;

    // If remaining games equals number of unplayed games,
    // only allow playing unplayed games
    if (remainingGames === unplayedGames && testStatus.gamesPlayed[gameKey] > 0) {
      return; // Don't allow playing already played games
    }

    setActiveGame(gameKey);
  };

  const handleReset = () => {
    console.log('Reset button clicked');  // Debug log

    // First clear localStorage
    localStorage.clear();
    console.log('localStorage cleared');

    // Call parent reset handler before state updates
    if (onReset) {
      onReset();
      console.log('Parent reset called');
    }

    // Reset all states
    const resetState = {
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

    // Update all states synchronously
    setTestStatus(resetState);
    setDailyLuckScore(null);
    setIsMinimized(false);
    setActiveGame(null);
    setShowResetConfirm(false);
    console.log('States reset');

    // Force a hard refresh after a brief delay to ensure states are updated
    setTimeout(() => {
      console.log('Refreshing page...');
      window.location = window.location.href.split('#')[0];
    }, 100);
  };

  if (testStatus.completed) {
    if (isMinimized) {
      return (
        <div className="bg-white/90 rounded-lg p-4 mb-6 cursor-pointer hover:shadow-lg transition-all duration-300 relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Reset button clicked'); // Debug log
              setShowResetConfirm(true);
            }}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Reset Test"
          >
            🔄 Reset
          </button>
          
          <div onClick={() => setIsMinimized(false)}>
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
        </div>
      );
    }

    return (
      <div className="bg-white/90 rounded-lg p-6 mb-6 relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Reset button clicked'); // Debug log
            setShowResetConfirm(true);
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          title="Reset Test"
        >
          🔄 Reset
        </button>

        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">Daily Luck Test Completed!</h3>
          <button 
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-gray-600 p-1 mr-8"
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
    <>
      <div className="bg-white/90 rounded-lg p-6 mb-6 relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Reset button clicked'); // Debug log
            setShowResetConfirm(true);
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          title="Reset Test"
        >
          🔄 Reset
        </button>

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
          {Object.entries(games).map(([gameKey, game]) => {
            // Calculate if this game can be played
            const remainingGames = 5 - testStatus.totalGames;
            const unplayedGames = Object.entries(testStatus.gamesPlayed)
              .filter(([_, count]) => count === 0)
              .length;
            const canPlay = !(remainingGames === unplayedGames && testStatus.gamesPlayed[gameKey] > 0);

            return (
              <div 
                key={gameKey}
                className={`
                  p-4 rounded-lg text-center
                  transition-all duration-300 transform
                  ${testStatus.gamesPlayed[gameKey] > 0 ? 'bg-green-100' : 'bg-gray-50'}
                  ${testStatus.totalGames >= 5 && testStatus.gamesPlayed[gameKey] === 0
                    ? 'border-2 border-red-500' 
                    : ''}
                  ${testStatus.totalGames < 5 && canPlay 
                    ? 'cursor-pointer hover:scale-105' 
                    : 'opacity-50 cursor-not-allowed'}
                `}
                onClick={() => {
                  if (testStatus.totalGames < 5 && canPlay) {
                    handleGameClick(gameKey);
                  }
                }}
              >
                <div className="text-3xl mb-2">{game.emoji}</div>
                <p className="font-bold">{game.title}</p>
                <p className="text-sm text-gray-600">
                  {testStatus.gamesPlayed[gameKey] === 0 ? 'Not played yet' :
                   `Played ${testStatus.gamesPlayed[gameKey]} time${testStatus.gamesPlayed[gameKey] > 1 ? 's' : ''}`}
                </p>
                {!canPlay && testStatus.totalGames < 5 && (
                  <p className="text-xs text-red-500 mt-2">
                    Must play unplayed games first
                  </p>
                )}
              </div>
            );
          })}
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

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">Reset Daily Test?</h3>
            <p className="text-gray-600 mb-4">
              This will reset all progress for testing purposes. Are you sure?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Confirm reset clicked'); // Debug log
                  handleReset();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LuckTester; 