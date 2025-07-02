import { ReactNode } from 'react';
export interface ControlNavItem {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  hideIf?: boolean;
}
