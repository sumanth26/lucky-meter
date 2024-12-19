import React, { useState } from 'react';

const themes = {
  classic: {
    name: 'Classic',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#4f46e5'
    }
  },
  lucky: {
    name: 'Lucky',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#047857'
    }
  },
  fortune: {
    name: 'Fortune',
    colors: {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#B45309'
    }
  }
};

const ThemeSelector = ({ onThemeChange }) => {
  const [activeTheme, setActiveTheme] = useState('classic');

  const handleThemeChange = (themeName) => {
    const theme = themes[themeName];
    setActiveTheme(themeName);
    
    // Update CSS variables
    document.documentElement.style.setProperty('--color-primary', theme.colors.primary);
    document.documentElement.style.setProperty('--color-secondary', theme.colors.secondary);
    document.documentElement.style.setProperty('--color-accent', theme.colors.accent);
    
    onThemeChange?.(theme.colors);
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <h3 className="text-white mb-2">Select Theme</h3>
      <div className="flex gap-3">
        {Object.entries(themes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => handleThemeChange(key)}
            className={`
              w-10 h-10 rounded-full border-2 transition-all duration-300
              ${activeTheme === key ? 'border-white scale-110' : 'border-transparent scale-100'}
              hover:scale-110 hover:border-white/50
            `}
            style={{
              background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})`
            }}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector; 