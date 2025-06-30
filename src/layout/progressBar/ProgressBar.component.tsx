// ProgressBar.tsx
import React from 'react';
import styles from './ProgressBar.module.scss';

const ProgressBar = ({ progress, visible }: { progress: number; visible: boolean }) => {
  return (
    <div className={styles.loaderContainer} data-visible={visible}>
      <div className={styles.loaderBar} style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
