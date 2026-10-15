import React from 'react';

const Home = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center mt-24 font-sans">
      <h1 className="text-5xl font-extrabold mb-2 text-gray-800 dark:text-white transition-colors">Tic Tac Toe</h1>
      <p className="text-xl text-gray-500  dark:text-gray-400 mb-10 transition-colors">Choose your game mode</p>
      
      <div className="flex gap-5">
        <button 
          onClick={() => onSelectMode('human')} 
          className="px-8 py-4 text-lg font-semibold bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 hover:scale-105 transition-all"
        >
          🧑‍🤝‍🧑 Player vs Player
        </button>
        <button 
          onClick={() => onSelectMode('ai')} 
          className="px-8 py-4 text-lg font-semibold bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 hover:scale-105 transition-all"
        >
          🤖 Player vs AI
        </button>
      </div>
    </div>
  );
};

export default Home;