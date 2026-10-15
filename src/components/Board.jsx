import React from 'react';

const Board = ({ board, winningLine, handleClick, isAiTurn, winnerLetter }) => {
  return (
    <div className="grid grid-cols-3 gap-2 bg-gray-300 dark:bg-gray-700 p-2 rounded-xl shadow-lg mt-4 transition-colors">
      {board.map((cell, idx) => {
        const isWinningSquare = winningLine.includes(idx);
        const isDisabled = isAiTurn || winnerLetter || cell !== null;

        return (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            disabled={isDisabled}
            className={`w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-5xl font-bold rounded-lg transition-colors duration-200 
              ${isWinningSquare ? 'bg-green-400 text-white' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'} 
              ${!isDisabled ? 'hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer' : 'cursor-not-allowed'}
              ${cell === 'X' ? 'text-blue-500' : cell === 'O' ? 'text-red-500' : ''}
            `}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
};

export default Board;