import React from 'react';
import { GameDashboard } from './GameDashboard';
import styles from './styles.module.css';

const Game = () => {
  return (
    <div className={styles.gameContainer}>
      <GameDashboard />
    </div>
  );
};

export default Game;
