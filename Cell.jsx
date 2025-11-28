import React from 'react';
import styles from './Cell.module.css';

export default function Cell({ row, col, cell, onReveal, onToggleFlag }) {
  const handleClick = () => onReveal(row, col);
  const handleContext = e => { e.preventDefault(); onToggleFlag(row, col); };

  let className = styles.cell;
  if (cell.revealed) className += ` ${styles.revealed}`;
  if (cell.flagged) className += ` ${styles.flagged}`;
  if (cell.mine && cell.revealed) className += ` ${styles.mine}`;

  return (
    <div className={className} onClick={handleClick} onContextMenu={handleContext}>
      {cell.revealed ? (cell.mine ? '💣' : (cell.count > 0 ? cell.count : '')) : (cell.flagged ? '🚩' : '')}
    </div>
  );
}
