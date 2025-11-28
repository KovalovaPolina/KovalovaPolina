import React from 'react';
import styles from './Game.module.css';

export default function RestartButton({ onClick, status }) {
  const face = status==='lost'?'😵':status==='won'?'😎':'🙂';
  return <button className={styles.restart} onClick={onClick}>{face}</button>;
}
