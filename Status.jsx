import React from 'react';
import styles from './Game.module.css';

export default function Status({ status }) {
  return <div className={styles.status}>
    {status==='playing'?'В процесі':status==='won'?'Перемога!':status==='lost'?'Поразка':'Готово'}
  </div>;
}
