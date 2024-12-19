import React, { useState, useEffect } from 'react';
import GameModal from './GameModal';
import CoinFlip from './games/CoinFlip';
import DiceRoll from './games/DiceRoll';
import CardDraw from './games/CardDraw';

const DailyLuckTest = ({ onGameComplete, onTestComplete }) => {
  const [testStatus, setTestStatus] = useState(() => {
    const saved = localStorage.getItem('dailyTestStatus');
    return saved ? JSON.parse(saved) : {
      completed: false,
      lastCompletedDate: null,
      gamesPlayed: {
        coinFlip: false,
        diceRoll: false,
        cardDraw: false
      },
      wins: 0,
      totalGames: 0
    };
  });

  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    // Check if it's a new day
    const today = new Date().toDateString();
    if (testStatus.lastCompletedDate !== today) {
      setTestStatus(prev => ({
        ...prev,
        completed: false,
        gamesPlayed: {
          coinFlip: false,
          diceRoll: false,
          cardDraw: false
        },
        wins: 0,
        totalGames: 0
      }));
    }
  }, [testStatus.lastCompletedDate]);

  useEffect(() => {
    localStorage.setItem('dailyTestStatus', JSON.stringify(testStatus));
  }, [testStatus]);

  const calculateDailyLuck = () => {
    const winRate = (testStatus.wins / 5) * 100;
    // Only calculate score if all games have been played at least once
    const allGamesPlayed = Object.values(testStatus.gamesPlayed).every(played => played);
    if (!allGamesPlayed) return 0;
    return Math.min(100, Math.round(winRate));
  };

  const handleGameComplete = (gameType, won) => {
    if (testStatus.completed) return;

    const newStatus = {
      ...testStatus,
      gamesPlayed: {
        ...testStatus.gamesPlayed,
        [gameType]: true
      },
      wins: testStatus.wins + (won ? 1 : 0),
      totalGames: testStatus.totalGames + 1
    };

    // Check if test is complete (5 games played and all games played at least once)
    if (newStatus.totalGames === 5) {
      const allGamesPlayed = Object.values(newStatus.gamesPlayed).every(played => played);
      if (allGamesPlayed) {
        newStatus.completed = true;
        newStatus.lastCompletedDate = new Date().toDateString();
        const finalLuckScore = calculateDailyLuck();
        onTestComplete(finalLuckScore);
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

  const games = {
    coinFlip: {
      title: 'Coin Flip',
      emoji: '🪙',
      component: CoinFlip
    },
    diceRoll: {
      title: 'Dice Roll',
      emoji: '🎲',
      component: DiceRoll
    },
    cardDraw: {
      title: 'Card Draw',
      emoji: '🃏',
      component: CardDraw
    }
  };

  if (testStatus.completed) {
    return (
      <div className="bg-white/90 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-center mb-4">Daily Luck Test Completed!</h3>
        <p className="text-center text-gray-600">
          Come back tomorrow to test your luck again!
        </p>
        <div className="mt-4 text-center">
          <p className="font-bold">Today's Results:</p>
          <p>Games Won: {testStatus.wins} / 5</p>
          <p>Luck Score: {calculateDailyLuck()}%</p>
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
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(games).map(([gameKey, game]) => (
          <div 
            key={gameKey}
            className={`
              p-4 rounded-lg text-center cursor-pointer
              transition-all duration-300 transform hover:scale-105
              ${testStatus.gamesPlayed[gameKey] ? 'bg-green-100' : 'bg-gray-50'}
              ${testStatus.totalGames >= 5 && !testStatus.gamesPlayed[gameKey] 
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
              {testStatus.gamesPlayed[gameKey] ? 'Played' : 'Not played yet'}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="text-lg font-bold mb-2">
          {getRequiredGames()} games remaining
        </div>
        {testStatus.totalGames >= 5 && !Object.values(testStatus.gamesPlayed).every(played => played) && (
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

export default DailyLuckTest; 