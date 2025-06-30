'use client';
import { Button } from 'antd';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import styles from './Auth.module.scss';
import { useEffect, useState } from 'react';

const Auth = () => {
  const pathname = usePathname();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const origin = window.location.origin;
    const token = window.localStorage.getItem('token');

    setRedirectUrl(`${process.env.AUTH_URL}?redirect=${origin + pathname}`);
    setIsAuthenticated(!!token);
  }, [pathname]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <Image
              src="/images/logo.png"
              width={160}
              height={100}
              style={{
                objectFit: 'contain',
              }}
              alt="logo"
            />
            {process.env.SERVICE_NAME}
          </div>
        </div>
        <p className={styles.text}>
          <span>Welcome</span>
          <br />
          <span style={{ fontSize: '14px' }}>Please click the button below to authenticate and access the dashboard</span>
        </p>
        {redirectUrl && (
          <a href={redirectUrl} className={styles.buttonLink}>
            <Button className={styles.button} type="primary" size="large" loading={isAuthenticated} disabled={isAuthenticated}>
              Login
            </Button>
          </a>
        )}
      </div>
      <div className={styles.waveContainer}>
        <svg id="wave" viewBox="0 0 1440 490" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
              <stop stopColor="var(--color-black)" offset="0%"></stop>
              <stop stopColor="var(--color-metallic-blue-dark)" offset="100%"></stop>
            </linearGradient>
          </defs>
          <path
            fill="url(#sw-gradient-0)"
            d="M0,196L80,171.5C160,147,320,98,480,106.2C640,114,800,180,960,171.5C1120,163,1280,82,1440,57.2C1600,33,1760,65,1920,73.5C2080,82,2240,65,2400,65.3C2560,65,2720,82,2880,130.7C3040,180,3200,261,3360,318.5C3520,376,3680,408,3840,408.3C4000,408,4160,376,4320,351.2C4480,327,4640,310,4800,269.5C4960,229,5120,163,5280,187.8C5440,212,5600,327,5760,326.7C5920,327,6080,212,6240,138.8C6400,65,6560,33,6720,89.8C6880,147,7040,294,7200,359.3C7360,425,7520,408,7680,367.5C7840,327,8000,261,8160,269.5C8320,278,8480,359,8640,367.5C8800,376,8960,310,9120,236.8C9280,163,9440,82,9600,49C9760,16,9920,33,10080,106.2C10240,180,10400,310,10560,334.8C10720,359,10880,278,11040,228.7C11200,180,11360,163,11440,155.2L11520,147L11520,490L11440,490C11360,490,11200,490,11040,490C10880,490,10720,490,10560,490C10400,490,10240,490,10080,490C9920,490,9760,490,9600,490C9440,490,9280,490,9120,490C8960,490,8800,490,8640,490C8480,490,8320,490,8160,490C8000,490,7840,490,7680,490C7520,490,7360,490,7200,490C7040,490,6880,490,6720,490C6560,490,6400,490,6240,490C6080,490,5920,490,5760,490C5600,490,5440,490,5280,490C5120,490,4960,490,4800,490C4640,490,4480,490,4320,490C4160,490,4000,490,3840,490C3680,490,3520,490,3360,490C3200,490,3040,490,2880,490C2720,490,2560,490,2400,490C2240,490,2080,490,1920,490C1760,490,1600,490,1440,490C1280,490,1120,490,960,490C800,490,640,490,480,490C320,490,160,490,80,490L0,490Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Auth;

Auth.getInitialProps = async ({ req }: any) => {
  let fullUrl;
  if (req) {
    // Server side rendering
    fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  } else {
    // Client side rendering
    fullUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  }
  return { fullUrl: fullUrl };
};
