export const winCombo = [
  [0, 1, 2], [0, 3, 6], [0, 4, 8],
  [1, 4, 7], [2, 5, 8], [2, 4, 6],
  [3, 4, 5], [6, 7, 8]
];

export const checkWinner = (squares) => {
  for (let i = 0; i < winCombo.length; i++) {
    const [a, b, c] = winCombo[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winnerLetter: squares[a], winningLine: [a, b, c] };
    }
  }
  return { winnerLetter: null, winningLine: [] };
};