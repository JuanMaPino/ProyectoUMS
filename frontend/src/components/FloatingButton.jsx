import React from 'react';
import { RiAddLine } from 'react-icons/ri';

const FloatingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-2 bg-gradient-to-bl from-indigo-200 to-indigo-500 hover:from-indigo-300 hover:to-indigo-700 text-white font-bold py-3 px-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
    >
      <RiAddLine size={24} />
    </button>
  );
};

export default FloatingButton;
