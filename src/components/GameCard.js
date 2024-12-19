import React, { useState } from 'react';
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

const GameCard = ({ gameType, onComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const game = games[gameType];

  return (
    <>
      <div 
        className="bg-white/90 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:scale-105"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="text-4xl mb-4 text-center">{game.emoji}</div>
        <h3 className="text-xl font-bold mb-2 text-center">{game.title}</h3>
        <p className="text-gray-600 text-sm text-center">{game.description}</p>
      </div>

      <GameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <game.component
          onResult={(won) => {
            onComplete(won);
            setIsModalOpen(false);
          }}
        />
      </GameModal>
    </>
  );
};

export default GameCard; 