import { useState } from 'react';

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function winner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.every(Boolean) ? 'draw' : null;
}

export default function TicTacToeApp() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const result = winner(board);

  const play = (i) => {
    if (board[i] || result) return;
    const next = [...board];
    next[i] = turn;
    setBoard(next);
    setTurn(turn === 'X' ? 'O' : 'X');
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
  };

  return (
    <div className="app-pad center">
      <p className="muted">
        {result === 'draw' ? "It's a draw" : result ? `${result} wins!` : `${turn}'s turn`}
      </p>
      <div className="ttt-grid">
        {board.map((v, i) => (
          <button key={i} className="ttt-cell" onClick={() => play(i)}>{v}</button>
        ))}
      </div>
      <button className="btn-ghost" onClick={reset}>Reset</button>
    </div>
  );
}
