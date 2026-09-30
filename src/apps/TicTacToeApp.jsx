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

const initialState = { board: Array(9).fill(null), turn: 'X' };

export default function TicTacToeApp() {
  const [state, setState] = useState(initialState);
  const result = winner(state.board);

  const play = (i) => {
    setState((prev) => {
      if (prev.board[i] || winner(prev.board)) return prev;
      const board = [...prev.board];
      board[i] = prev.turn;
      return { board, turn: prev.turn === 'X' ? 'O' : 'X' };
    });
  };

  const reset = () => setState(initialState);

  return (
    <div className="app-pad center">
      <p className="muted">
        {result === 'draw' ? "It's a draw" : result ? `${result} wins!` : `${state.turn}'s turn`}
      </p>
      <div className="ttt-grid">
        {state.board.map((v, i) => (
          <button key={i} className="ttt-cell" onClick={() => play(i)}>{v}</button>
        ))}
      </div>
      <button className="btn-ghost" onClick={reset}>Reset</button>
    </div>
  );
}
