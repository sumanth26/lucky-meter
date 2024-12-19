import { useEffect, useCallback } from 'react';

const sounds = {
  win: new Audio('/sounds/win.mp3'),
  lose: new Audio('/sounds/lose.mp3'),
  flip: new Audio('/sounds/flip.mp3'),
  roll: new Audio('/sounds/roll.mp3'),
  draw: new Audio('/sounds/draw.mp3'),
};

export const useGameSounds = () => {
  const playSound = useCallback((soundName) => {
    sounds[soundName].play().catch(console.error);
  }, []);

  return { playSound };
}; 