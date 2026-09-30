import { useEffect, useState } from 'react';

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const HUMAN = 'X';
const CPU = 'O';

function winner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.every(Boolean) ? 'draw' : null;
}

function pickCpuMove(board) {
  const empty = board.reduce((acc, v, i) => (v ? acc : [...acc, i]), []);

  const findWinningMove = (mark) => {
    for (const i of empty) {
      const copy = [...board];
      copy[i] = mark;
      if (winner(copy) === mark) return i;
    }
    return null;
  };

  return (
    findWinningMove(CPU) ??
    findWinningMove(HUMAN) ??
    (board[4] === null ? 4 : null) ??
    empty.find((i) => [0, 2, 6, 8].includes(i)) ??
    empty[0]
  );
}

const initialState = { board: Array(9).fill(null), turn: HUMAN };

export default function TicTacToeApp() {
  const [state, setState] = useState(initialState);
  const result = winner(state.board);

  const play = (i) => {
    if (state.turn !== HUMAN || result) return;
    setState((prev) => {
      if (prev.board[i] || winner(prev.board)) return prev;
      const board = [...prev.board];
      board[i] = HUMAN;
      return { board, turn: CPU };
    });
  };

  const reset = () => setState(initialState);

  useEffect(() => {
    if (state.turn !== CPU || result) return;
    const t = setTimeout(() => {
      setState((prev) => {
        if (winner(prev.board)) return prev;
        const move = pickCpuMove(prev.board);
        if (move === undefined || move === null) return prev;
        const board = [...prev.board];
        board[move] = CPU;
        return { board, turn: HUMAN };
      });
    }, 350);
    return () => clearTimeout(t);
  }, [state.turn, state.board, result]);

  const status =
    result === 'draw' ? "It's a draw" :
    result === HUMAN ? 'You win!' :
    result === CPU ? 'HediOS wins!' :
    state.turn === HUMAN ? 'Your turn (X)' : "HediOS is thinking…";

  return (
    <div className="app-pad center">
      <p className="muted">{status}</p>
      <div className="ttt-grid">
        {state.board.map((v, i) => (
          <button key={i} className="ttt-cell" onClick={() => play(i)}>{v}</button>
        ))}
      </div>
      <button className="btn-ghost" onClick={reset}>Reset</button>
    </div>
  );
}
