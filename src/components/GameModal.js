import React from 'react';

const GameModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 transform animate-float">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameModal; 