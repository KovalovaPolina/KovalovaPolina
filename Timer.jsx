import React from 'react';
import styles from './Timer.module.css';

export default function Timer({ time }) {
  return <div className={styles.timer}>Час: <b>{time}s</b></div>;
}
