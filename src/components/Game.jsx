import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { checkWinner } from '../utils/gameHelpers';
import Scoreboard from './Scoreboard';
import Board from './Board';

const Game = ({ gameMode, goHome }) => {
  // --- STATE ---
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [playerSymbol, setPlayerSymbol] = useState('X');
  
  const [scores, setScores] = useState({
    human: { X: 0, O: 0, draws: 0 },
    ai: { X: 0, O: 0, draws: 0 }
  });
  const [hasScored, setHasScored] = useState(false);

  // --- DERIVED VARIABLES ---
  const board = history[stepNumber];
  const isXNext = stepNumber % 2 === 0;
  
  const { winnerLetter, winningLine } = checkWinner(board);
  const isDraw = !winnerLetter && !board.includes(null);

  const aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
  const isAiTurn = gameMode === 'ai' && ((isXNext && aiSymbol === 'X') || (!isXNext && aiSymbol === 'O'));

  const getPlayerName = (symbol) => {
    if (gameMode === 'human') return symbol === 'X' ? 'Player 1' : 'Player 2';
    return symbol === playerSymbol ? 'Human' : 'AI';
  };

  // --- SCOREBOARD LOGIC ---
  useEffect(() => {
    if (!hasScored && (winnerLetter || isDraw)) {
      setScores(prev => {
        const newScores = { ...prev };
        if (winnerLetter === 'X') newScores[gameMode].X++;
        else if (winnerLetter === 'O') newScores[gameMode].O++;
        else newScores[gameMode].draws++;
        return newScores;
      });
      setHasScored(true);
    }
  }, [winnerLetter, isDraw, hasScored, gameMode]);

  // --- AI LOGIC ---
  useEffect(() => {
    if (isAiTurn && !winnerLetter && !isDraw) {
      const getBestMove = () => {
        const emptyIndices = board.map((c, i) => (c === null ? i : null)).filter(v => v !== null);
        const getRandomMove = () => emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

        if (difficulty === 'easy') return getRandomMove();

        if (difficulty === 'medium') {
          // Try to win
          for (let i of emptyIndices) {
            let boardCopy = [...board]; boardCopy[i] = aiSymbol;
            if (checkWinner(boardCopy).winnerLetter === aiSymbol) return i;
          }
          // Try to block
          for (let i of emptyIndices) {
            let boardCopy = [...board]; boardCopy[i] = playerSymbol;
            if (checkWinner(boardCopy).winnerLetter === playerSymbol) return i;
          }
          return getRandomMove();
        }

        // Hard: Minimax
        if (difficulty === 'hard') {
          const minimax = (newBoard, isMaximizing) => {
            const result = checkWinner(newBoard).winnerLetter;
            if (result === aiSymbol) return 10;
            if (result === playerSymbol) return -10;
            if (!newBoard.includes(null)) return 0;

            if (isMaximizing) {
              let bestScore = -Infinity;
              for (let i = 0; i < 9; i++) {
                if (newBoard[i] === null) {
                  newBoard[i] = aiSymbol;
                  bestScore = Math.max(minimax(newBoard, false), bestScore);
                  newBoard[i] = null;
                }
              }
              return bestScore;
            } else {
              let bestScore = Infinity;
              for (let i = 0; i < 9; i++) {
                if (newBoard[i] === null) {
                  newBoard[i] = playerSymbol;
                  bestScore = Math.min(minimax(newBoard, true), bestScore);
                  newBoard[i] = null;
                }
              }
              return bestScore;
            }
          };

          let bestScore = -Infinity; let move = -1;
          for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
              let boardCopy = [...board]; boardCopy[i] = aiSymbol;
              let score = minimax(boardCopy, false);
              if (score > bestScore) { bestScore = score; move = i; }
            }
          }
          return move;
        }
      };

      const timer = setTimeout(() => {
        const aiMove = getBestMove();
        const newHistory = history.slice(0, stepNumber + 1);
        const newBoard = [...newHistory[newHistory.length - 1]];
        newBoard[aiMove] = aiSymbol;
        setHistory([...newHistory, newBoard]);
        setStepNumber(newHistory.length);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isAiTurn, winnerLetter, isDraw, board, difficulty, aiSymbol, playerSymbol, history, stepNumber]);

  // --- GAMEPLAY HANDLERS ---
  const handleClick = (idx) => {
    if (board[idx] !== null || winnerLetter || isAiTurn) return;
    const newHistory = history.slice(0, stepNumber + 1);
    const newBoard = [...newHistory[newHistory.length - 1]];
    
    newBoard[idx] = isXNext ? "X" : "O";
    setHistory([...newHistory, newBoard]);
    setStepNumber(newHistory.length);
  }

  const handleUndo = () => {
    if (stepNumber > 0 && !winnerLetter && !isDraw) {
      let stepBack = (gameMode === 'ai' && stepNumber >= 2) ? 2 : 1;
      setStepNumber(stepNumber - stepBack);
    }
  }

  const resetGame = () => {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setHasScored(false);
  }

  return (
    <div className="flex flex-col items-center mt-8 font-sans w-full max-w-md mx-auto">
      {winnerLetter && <Confetti />}

      <button 
        onClick={goHome} 
        className="self-start ml-4 mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
      >
        ← Back to Home
      </button>

      {gameMode === 'ai' && (
        <div className="flex flex-col items-center my-4 gap-3 bg-gray-50 p-4 rounded-xl shadow-sm w-full">
          <div className="flex gap-2">
            <button onClick={() => { setDifficulty('easy'); resetGame(); }} className={`px-4 py-1 rounded-md font-medium transition-colors ${difficulty === 'easy' ? 'bg-green-400 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Easy</button>
            <button onClick={() => { setDifficulty('medium'); resetGame(); }} className={`px-4 py-1 rounded-md font-medium transition-colors ${difficulty === 'medium' ? 'bg-yellow-400 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Medium</button>
            <button onClick={() => { setDifficulty('hard'); resetGame(); }} className={`px-4 py-1 rounded-md font-medium transition-colors ${difficulty === 'hard' ? 'bg-red-400 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Hard</button>
          </div>
          <div className="flex gap-3 items-center mt-2">
            <span className="text-gray-600 font-medium">Play as:</span>
            <button onClick={() => { setPlayerSymbol('X'); resetGame(); }} className={`px-4 py-1 rounded-md font-medium transition-colors ${playerSymbol === 'X' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>X (First)</button>
            <button onClick={() => { setPlayerSymbol('O'); resetGame(); }} className={`px-4 py-1 rounded-md font-medium transition-colors ${playerSymbol === 'O' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>O (Second)</button>
          </div>
        </div>
      )}

      <Scoreboard scores={scores} gameMode={gameMode} getPlayerName={getPlayerName} />

      <h2 className="text-2xl font-bold text-gray-800 my-4 h-8">
        {winnerLetter ? `Winner: ${getPlayerName(winnerLetter)} 🎉` : isDraw ? "It's a Draw! 🤝" : `Next Player: ${getPlayerName(isXNext ? 'X' : 'O')}`}
      </h2>

      <Board board={board} winningLine={winningLine} handleClick={handleClick} isAiTurn={isAiTurn} winnerLetter={winnerLetter} />

      <div className="mt-8 flex gap-4 h-12">
        {stepNumber > 0 && !winnerLetter && !isDraw && (
          <button 
            onClick={handleUndo} 
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow transition-colors"
          >
            ↩ Undo
          </button>
        )}
        
        {(winnerLetter || isDraw || stepNumber > 0) && (
          <button 
            onClick={resetGame} 
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition-colors"
          >
            {winnerLetter || isDraw ? 'Play Again' : 'Restart'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Game;