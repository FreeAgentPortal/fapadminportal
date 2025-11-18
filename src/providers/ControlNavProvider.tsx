'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ControlNavItem {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  hideIf?: boolean;
  disabled?: boolean;
}

interface ControlNavContextType {
  controlNav: Array<ControlNavItem> | null;
  setControlNav: (nav: Array<ControlNavItem> | null) => void;
  hideControlLayout: boolean;
  setHideControlLayout: (hide: boolean) => void;
}

const ControlNavContext = createContext<ControlNavContextType | undefined>(undefined);

export const ControlNavProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [controlNav, setControlNavState] = useState<Array<ControlNavItem> | null>(null);
  const [hideControlLayout, setHideControlLayout] = useState(false);

  const setControlNav = (nav: Array<ControlNavItem> | null) => {
    setControlNavState(nav);
  };

  return (
    <ControlNavContext.Provider
      value={{
        controlNav,
        setControlNav,
        hideControlLayout,
        setHideControlLayout,
      }}
    >
      {children}
    </ControlNavContext.Provider>
  );
};

export const useControlNav = () => {
  const context = useContext(ControlNavContext);
  if (context === undefined) {
    throw new Error('useControlNav must be used within a ControlNavProvider');
  }
  return context;
};

/**
 * Hook to set control navigation for a specific page
 * Automatically cleans up when component unmounts
 */
export const useSetControlNav = (
  controlNav: Array<ControlNavItem> | null,
  hideControlLayout: boolean = false
) => {
  const { setControlNav, setHideControlLayout } = useControlNav();

  useEffect(() => {
    setControlNav(controlNav);
    setHideControlLayout(hideControlLayout);

    // Cleanup when component unmounts
    return () => {
      setControlNav(null);
      setHideControlLayout(false);
    };
  }, [controlNav, hideControlLayout, setControlNav, setHideControlLayout]);
};
