import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import Timer from './Timer';
import RestartButton from './RestartButton';
import Status from './Status';
import { createBoard } from './utils';
import styles from './Game.module.css';

const ROWS = 8;
const COLS = 8;
const MINES = 10;

export default function KovalevaPolina() {
  const [board, setBoard] = useState(() => createBoard(ROWS, COLS, MINES));
  const [flagsLeft, setFlagsLeft] = useState(MINES);
  const [gameStatus, setGameStatus] = useState('idle'); // idle | playing | won | lost
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer;
    if (gameStatus === 'playing') {
      timer = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameStatus]);

  const restart = useCallback(() => {
    setBoard(createBoard(ROWS, COLS, MINES));
    setFlagsLeft(MINES);
    setGameStatus('idle');
    setTime(0);
  }, []);

  const handleReveal = useCallback((r, c) => {
    if (gameStatus === 'lost' || gameStatus === 'won') return;

    setBoard(prev => {
      const copy = prev.map(row => row.map(cell => ({ ...cell })));
      const cell = copy[r][c];
      if (cell.revealed || cell.flagged) return prev;

      if (gameStatus === 'idle') setGameStatus('playing');

      const revealRecursive = (i, j) => {
        const node = copy[i][j];
        if (node.revealed || node.flagged) return;
        node.revealed = true;
        if (node.count === 0 && !node.mine) {
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di, nj = j + dj;
              if (ni >= 0 && ni < ROWS && nj >= 0 && nj < COLS) revealRecursive(ni, nj);
            }
          }
        }
      };

      if (cell.mine) {
        for (let i = 0; i < ROWS; i++)
          for (let j = 0; j < COLS; j++)
            if (copy[i][j].mine) copy[i][j].revealed = true;
        setGameStatus('lost');
      } else {
        revealRecursive(r, c);
      }

      return copy;
    });
  }, [gameStatus]);

  const handleToggleFlag = useCallback((r, c) => {
    if (gameStatus === 'lost' || gameStatus === 'won') return;

    setBoard(prev => {
      const copy = prev.map(row => row.map(cell => ({ ...cell })));
      const cell = copy[r][c];
      if (cell.revealed) return prev;
      if (cell.flagged) {
        cell.flagged = false;
        setFlagsLeft(f => f + 1);
      } else if (flagsLeft > 0) {
        cell.flagged = true;
        setFlagsLeft(f => f - 1);
      }
      return copy;
    });

    if (gameStatus === 'idle') setGameStatus('playing');
  }, [flagsLeft, gameStatus]);

  useEffect(() => {
    const totalSafe = ROWS * COLS - MINES;
    const revealed = board.flat().filter(c => c.revealed && !c.mine).length;
    if (revealed === totalSafe && gameStatus !== 'lost') setGameStatus('won');
  }, [board, gameStatus]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Minesweeper — Kovaleva Polina</h2>
      <div className={styles.controls}>
        <RestartButton onClick={restart} status={gameStatus} />
        <Timer time={time} />
        <div className={styles.flags}>Флаги: <b>{flagsLeft}</b></div>
        <Status status={gameStatus} />
      </div>
      <Board board={board} onReveal={handleReveal} onToggleFlag={handleToggleFlag} />
    </div>
  );
}
