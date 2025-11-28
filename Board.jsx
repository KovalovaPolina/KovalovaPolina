import React from 'react';
import Cell from './Cell';
import styles from './Board.module.css';

export default function Board({ board, onReveal, onToggleFlag }) {
  const rows = board.length;
  const cols = board[0].length;

  return (
    <div className={styles.board} style={{ gridTemplateColumns: `repeat(${cols}, 34px)` }}>
      {board.map((row,r) => row.map((cell,c) =>
        <Cell key={`${r}-${c}`} row={r} col={c} cell={cell} onReveal={onReveal} onToggleFlag={onToggleFlag}/>
      ))}
    </div>
  );
}
