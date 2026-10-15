import React, { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';

const App = () => {
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedMode, setSelectedMode] = useState('human');
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode state

  const handleStartGame = (mode) => {
    setSelectedMode(mode);
    setCurrentView('game');
  };

  const handleGoHome = () => {
    setCurrentView('home');
  };

  return (
    // The wrapper that applies the 'dark' class
    <div className={isDarkMode ? 'dark' : ''}>
      {/* The main background that shifts colors */}
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative pt-10">
        
        {/* Dark Mode Toggle Button */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="absolute top-4 right-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow-md font-medium transition-colors"
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        {currentView === 'home' ? (
          <Home onSelectMode={handleStartGame} />
        ) : (
          <Game gameMode={selectedMode} goHome={handleGoHome} />
        )}
      </div>
    </div>
  );
};

export default App;