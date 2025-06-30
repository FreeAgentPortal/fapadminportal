import { create } from 'zustand';

interface Layout {
  socket: any;
  isConnecting: boolean;
  watchingUsers: number;
  setSocket: (socket: any) => void;
  setIsConnecting: (isConnected: boolean) => void;
  setWatchingUsers: (users: number) => void;
}

export const useSocketStore = create<Layout>((set) => ({
  socket: null,
  isConnecting: false,
  watchingUsers: 0,
  setSocket: (socket: any) => {
    set({ socket });
  },
  setIsConnecting: (isConnecting: boolean) => {
    set({ isConnecting });
  },
  setWatchingUsers: (users: number) => {
    set({ watchingUsers: users });
  },
}));
