import React, { useState, useEffect } from 'react';

const LuckMeter = ({ score }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevScore, setPrevScore] = useState(score);
  const [currentPun, setCurrentPun] = useState('');

  const puns = {
    veryLow: [
      "Even your backup plans need backup plans! 🎲",
      "Your lucky number called - it's taking a vacation! 🏖️",
      "Time to borrow some luck from a rubber duck! 🦆",
      "Your fortune cookie just needs a hug! 🥠",
      "Even Murphy's Law is feeling sorry for you! 🤷‍♂️"
    ],
    low: [
      "Your luck is shy, but working on its confidence! 🌱",
      "High-fiving a black cat might help at this point! 🐱",
      "Your lucky star is just stuck in traffic! 🌟",
      "Your horseshoe needs new batteries! 🔋",
      "Your rabbit's foot is taking a coffee break! ☕"
    ],
    medium: [
      "Luck is like Wi-Fi - the connection is stable! 📶",
      "Not too hot, not too cold - just right! 🌡️",
      "Balanced like a zen master on a unicycle! 🎪",
      "Your luck is as steady as a cat's landing! 😺",
      "Playing it safer than a bubble-wrapped unicorn! 🦄"
    ],
    high: [
      "You're on a roll... and it's not even sushi! 🍣",
      "Lady Luck is definitely swiping right on you! ✨",
      "Your luck is doing victory laps! 🏃‍♂️",
      "Four-leaf clovers are asking for your autograph! 🍀",
      "Your lucky socks are working overtime! 🧦"
    ],
    veryHigh: [
      "You're so lucky, slot machines wave white flags! 🎰",
      "Leprechauns are asking YOU for advice! 🧙‍♂️",
      "Your luck has luck of its own! 🌈",
      "Fortune cookies write themselves for you! 🥠",
      "Even your bad luck is turning into good luck! ⭐"
    ]
  };

  useEffect(() => {
    if (prevScore !== score) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      setPrevScore(score);

      // Update pun when score changes
      const category = 
        score < 20 ? 'veryLow' :
        score < 40 ? 'low' :
        score < 60 ? 'medium' :
        score < 80 ? 'high' : 'veryHigh';
      
      const categoryPuns = puns[category];
      const randomPun = categoryPuns[Math.floor(Math.random() * categoryPuns.length)];
      setCurrentPun(randomPun);

      return () => clearTimeout(timer);
    }
  }, [score, prevScore]);

  const getLuckStatus = () => {
    if (score < 20) return { 
      text: 'Very Unlucky', 
      color: 'bg-luck-red', 
      textColor: 'text-luck-red', 
      emoji: '😢'
    };
    if (score < 40) return { 
      text: 'Unlucky', 
      color: 'bg-luck-red', 
      textColor: 'text-luck-red', 
      emoji: '😕'
    };
    if (score < 60) return { 
      text: 'Neutral', 
      color: 'bg-luck-yellow', 
      textColor: 'text-luck-yellow', 
      emoji: '😐'
    };
    if (score < 80) return { 
      text: 'Lucky', 
      color: 'bg-luck-green', 
      textColor: 'text-luck-green', 
      emoji: '😊'
    };
    return { 
      text: 'Very Lucky', 
      color: 'bg-luck-green', 
      textColor: 'text-luck-green', 
      emoji: '🍀'
    };
  };

  const status = getLuckStatus();

  return (
    <div className={`bg-white rounded-lg p-6 shadow-lg mb-8 ${isAnimating ? 'animate-pulse-slow' : ''}`}>
      <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
        Your Luck Meter
        <span className="text-3xl">{status.emoji}</span>
      </h2>
      
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${status.color} transition-all duration-1000 ease-in-out`}
          style={{ width: `${score}%` }}
        />
        <div className="absolute top-0 left-0 w-full h-full grid grid-cols-5 pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-r border-white/20 h-full" />
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <span className={`${status.textColor} font-bold text-xl`}>
          {status.text}: {score}%
        </span>
      </div>
      
      <div className="mt-2 text-sm text-gray-600 text-center italic">
        {currentPun}
      </div>
    </div>
  );
};

export default LuckMeter; 