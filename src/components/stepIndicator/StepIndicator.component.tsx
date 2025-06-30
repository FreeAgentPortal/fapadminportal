import React from 'react';
import styles from './StepIndicator.module.scss';

export interface Step {
  key: string;
  label: string;
  description: string;
  isComplete: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => {
  return (
    <div className={styles.stepsContainer}>
      {steps.map((step) => (
        <div key={step.key} className={`${styles.stepItem} ${step.isComplete ? styles.completed : ''}`}>
          <div className={styles.stepCircle} title={step.description}>
            {step.isComplete ? '✔' : '!'}
          </div>
          <div className={styles.stepLabel}>{step.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
