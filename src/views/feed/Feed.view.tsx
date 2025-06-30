import React from 'react';
import styles from './Feed.module.scss';

const Feed = () => {
  return <div className={styles.container}>
    <h1 className={styles.title}>Feed</h1>
    <p className={styles.description}>This is the feed section where you can see updates and posts.</p>
    {/* No content to display yet*/}
    <div className={styles.content}>
      <p>Content will be added here soon!</p>
    </div>
  </div>;
};

export default Feed;
