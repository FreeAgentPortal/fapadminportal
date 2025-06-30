'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Error.module.scss';

interface ErrorLayoutProps {
  code?: number;
  title?: string;
  description?: string;
  showHomeLink?: boolean;
  children?: React.ReactNode;
}

const Error: React.FC<ErrorLayoutProps> = ({
  code = 500,
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again later. If the problem persists, contact support.',
  showHomeLink = true,
  children,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.code}>{code}</h1>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        {children}
        {showHomeLink && (
          <Link href="/" className={styles.homeLink}>
            Return Home
          </Link>
        )}
      </div>
    </div>
  );
};

export default Error;
