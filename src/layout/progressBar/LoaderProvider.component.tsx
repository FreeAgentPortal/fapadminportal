'use client';

import React, { createContext, useState, useRef, useEffect } from 'react';
import ProgressBar from './ProgressBar.component';
import { LoaderContext } from './useLoader';
import { usePathname } from 'next/navigation';
import { onRouteChange } from './route-events';

const LoaderContextInternal = createContext<LoaderContext | null>(null);

type Props = {
  children: React.ReactNode;
};

export const LoaderProvider = ({ children }: Props) => {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const start = () => {
    setProgress(0);
    setActive(true);
    let curr = 0;
    timeoutRef.current = setInterval(() => {
      curr = Math.min(curr + Math.random() * 10, 95);
      setProgress(curr);
    }, 200);
  };

  const done = () => {
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    setProgress(100);
    setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 300);
  };

  useEffect(() => { 
    const cleanup = onRouteChange(start, done);
    return cleanup;
  }, []);

  return (
    <LoaderContextInternal.Provider value={{ start, done, setProgress }}>
      <ProgressBar progress={progress} visible={active} />
      {children}
    </LoaderContextInternal.Provider>
  );
};

export { LoaderContextInternal };
