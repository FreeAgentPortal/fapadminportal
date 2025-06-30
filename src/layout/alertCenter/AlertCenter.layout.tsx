'use client';
import React, { useEffect, useState } from 'react';
import styles from './AlertCenter.module.scss';
import { useInterfaceStore } from '@/state/interface';
import { AlertMessage } from './AlertMessageType';

const AlertCenter = () => {
  const { alerts, removeAlert } = useInterfaceStore((state) => state);
  const [visibleAlerts, setVisibleAlerts] = useState(alerts);

  useEffect(() => {
    setVisibleAlerts(alerts);

    const timers = alerts.filter((alert) => alert.duration && alert.duration > 0).map((alert) => setTimeout(() => removeAlert(alert.id || ''), alert.duration));

    return () => timers.forEach(clearTimeout);
  }, [alerts, removeAlert]);

  const handleClose = (id: string) => {
    removeAlert(id);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠️';
      case 'error':
        return '⛔';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={styles.container}>
      {visibleAlerts.map((alert: AlertMessage) => (
        <div key={alert.id} className={`${styles.alert} ${styles[alert.type || 'info']}`}>
          <span className={styles.icon}>{getIcon(alert.type)}</span>
          <span className={styles.message}>{alert.message}</span>
          <button onClick={() => handleClose(alert.id || '')} className={styles.close} aria-label="Close alert">
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlertCenter;
