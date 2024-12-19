import React, { useState } from 'react';
import GameSection from './GameSection';
import GameModal from './GameModal';
import CoinFlip from './games/CoinFlip';
import DiceRoll from './games/DiceRoll';
import CardDraw from './games/CardDraw';

const MiniGames = ({ onGameComplete }) => {
  const [cooldowns, setCooldowns] = useState({});
  const [activeGame, setActiveGame] = useState(null);
  const [modalGame, setModalGame] = useState(null);

  const startCooldown = (gameKey) => {
    setCooldowns(prev => ({ ...prev, [gameKey]: Date.now() }));
  };

  const checkCooldown = (gameKey) => {
    const lastPlayed = cooldowns[gameKey];
    if (!lastPlayed) return true;
    const cooldownTime = 10000; // 10 seconds cooldown
    return Date.now() - lastPlayed >= cooldownTime;
  };

  const closeModal = () => {
    setModalGame(null);
    setActiveGame(null);
  };

  const handleGameResult = (gameKey, won) => {
    const scores = {
      coinFlip: { win: 10, lose: -5 },
      diceRoll: { win: 15, lose: -8 },
      cardDraw: { win: 12, lose: -6 }
    };

    const gameScore = won ? scores[gameKey].win : scores[gameKey].lose;
    startCooldown(gameKey);
    closeModal();
    onGameComplete(gameScore, won); // Pass both score and win status
  };

  const games = {
    coinFlip: {
      title: 'Coin Toss',
      description: 'Test your luck with a simple coin flip. Choose heads or tails!',
      emoji: '🪙',
      play: () => {
        if (!checkCooldown('coinFlip')) {
          alert('Please wait a moment before trying again!');
          return;
        }
        setActiveGame('coinFlip');
        setModalGame('coinFlip');
      }
    },
    diceRoll: {
      title: 'Lucky Dice',
      description: 'Roll the dice and test your intuition. Predict the number correctly for a major luck boost!',
      emoji: '🎲',
      play: () => {
        if (!checkCooldown('diceRoll')) {
          alert('Please wait a moment before trying again!');
          return;
        }
        setActiveGame('diceRoll');
        setModalGame('diceRoll');
      }
    },
    cardDraw: {
      title: 'Card Draw',
      description: 'Draw a card and guess its suit. A classic test of fortune!',
      emoji: '🃏',
      play: () => {
        if (!checkCooldown('cardDraw')) {
          alert('Please wait a moment before trying again!');
          return;
        }
        setActiveGame('cardDraw');
        setModalGame('cardDraw');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white text-center mb-6">Mini Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(games).map(([key, game]) => (
          <GameSection
            key={key}
            title={game.title}
            description={game.description}
            emoji={game.emoji}
            onPlay={game.play}
            isActive={activeGame === key}
            cooldown={cooldowns[key]}
          />
        ))}
      </div>

      <GameModal 
        isOpen={modalGame === 'coinFlip'} 
        onClose={closeModal}
      >
        <CoinFlip 
          onResult={(won) => handleGameResult('coinFlip', won)} 
        />
      </GameModal>

      <GameModal 
        isOpen={modalGame === 'diceRoll'} 
        onClose={closeModal}
      >
        <DiceRoll 
          onResult={(won) => handleGameResult('diceRoll', won)} 
        />
      </GameModal>

      <GameModal 
        isOpen={modalGame === 'cardDraw'} 
        onClose={closeModal}
      >
        <CardDraw 
          onResult={(won) => handleGameResult('cardDraw', won)} 
        />
      </GameModal>
    </div>
  );
};

export default MiniGames; 