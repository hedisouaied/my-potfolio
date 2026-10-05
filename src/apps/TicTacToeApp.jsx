import { useEffect, useState } from 'react';
import { useLocale } from '../i18n/useLocale';
import { Reveal, RevealGroup } from '../motion/Reveal';

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

function winningCells(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return [a, b, c];
  }
  return [];
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
  const { t } = useLocale();
  const [state, setState] = useState(initialState);
  const result = winner(state.board);
  const lit = winningCells(state.board);

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
    result === 'draw' ? t('tictactoe.draw') :
    result === HUMAN ? t('tictactoe.youWin') :
    result === CPU ? t('tictactoe.cpuWins') :
    state.turn === HUMAN ? t('tictactoe.yourTurn') : t('tictactoe.thinking');

  return (
    <div className="app-pad center app-ttt">
      <Reveal variant="fade">
        <p className="ttt-status">{status}</p>
      </Reveal>
      <RevealGroup className="ttt-grid" stagger={45}>
        {state.board.map((v, i) => (
          <button
            key={i}
            className={`ttt-cell ${v === CPU ? 'o' : ''} ${lit.includes(i) ? 'win' : ''}`}
            onClick={() => play(i)}
            disabled={!!v || !!result}
            aria-label={
              v ? t('tictactoe.cell', { n: i + 1, value: v }) : t('tictactoe.cellEmpty', { n: i + 1 })
            }
          >
            {v}
          </button>
        ))}
      </RevealGroup>
      <Reveal variant="scale" delay={260}>
        <button className="btn-ghost" onClick={reset}>
          {t('tictactoe.reset')}
        </button>
      </Reveal>
    </div>
  );
}
