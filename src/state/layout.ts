import { create } from 'zustand';

interface Layout {
  sideBarOpen: boolean;
  toggleSideBar: () => void;
  controlLayoutOpen: boolean;
  toggleControlLayout: () => void;
}

export const useLayoutStore = create<Layout>((set) => ({
  sideBarOpen: false,
  toggleSideBar: () =>
    set((state: Layout) => ({ sideBarOpen: !state.sideBarOpen })),
  controlLayoutOpen: false,
  toggleControlLayout: () =>
    set((state: Layout) => ({
      controlLayoutOpen: !state.controlLayoutOpen,
    })),
}));
