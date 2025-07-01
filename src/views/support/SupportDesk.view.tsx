import React from 'react';
import styles from './SupportDesk.module.scss';
import OpenTickets from './OpenTickets.component';
import Groups from './Groups.component';

const SupportDesk = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        {/* A list of all open support tickets assigned to the user */}
        <p className={styles.groupCard__header}>Open Tickets assigned to you</p>
        <OpenTickets />
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.groups}>
          {/* A list of all groups the user is a part of */}
          <Groups />
        </div>
      </div>
    </div>
  );
};

export default SupportDesk;
