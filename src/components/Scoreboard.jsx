import React from 'react';

const Scoreboard = ({ scores, gameMode, getPlayerName }) => {
    return (
        <div className="flex gap-5 my-5">
            <div className="text-center px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner min-w-[100px] transition-colors">
                <div className="font-bold text-gray-700 dark:text-gray-300">{getPlayerName('X')} (X)</div>
                <div className="text-3xl font-black text-blue-500">{scores[gameMode].X}</div>
            </div>
            <div className="text-center px-6 py-3 bg-gray-100 rounded-xl dark:bg-gray-800  shadow-inner  transition-colorsshadow-inner min-w-[100px]">
                <div className="font-bold text-gray-700 dark:text-gray-300">Draws</div>
                <div className="text-3xl font-black text-gray-500">{scores[gameMode].draws}</div>
            </div>
            <div className="text-center px-6 py-3 bg-gray-100 rounded-xl shadow-inner min-w-[100px] dark:bg-gray-800  transition-colors">
                <div className="font-bold text-gray-700 dark:text-gray-300">{getPlayerName('O')} (O)</div>
                <div className="text-3xl font-black text-red-500">{scores[gameMode].O}</div>
            </div>
        </div>
    );
};

export default Scoreboard;