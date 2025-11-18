import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Layout {
  mobileSideBarOpen: boolean;
  setMobileSideBarOpen: (open: boolean) => void;
  controlLayoutOpen: boolean;
  toggleControlLayout: () => void;
  controlLayoutCollapsed: boolean;
  toggleControlLayoutCollapsed: () => void;
  sidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  // Active navigation key (e.g., 'home.home', 'management.users')
  activeNavigationKey: string;
  setActiveNavigationKey: (key: string) => void;
}

export const useLayoutStore = create<Layout>()(
  persist(
    (set) => ({
      mobileSideBarOpen: false,
      setMobileSideBarOpen: (open: boolean) => set({ mobileSideBarOpen: open }),
      controlLayoutOpen: false,
      toggleControlLayout: () =>
        set((state: Layout) => ({
          controlLayoutOpen: !state.controlLayoutOpen,
        })),
      controlLayoutCollapsed: false,
      toggleControlLayoutCollapsed: () =>
        set((state: Layout) => ({
          controlLayoutCollapsed: !state.controlLayoutCollapsed,
        })),
      sidebarCollapsed: false,
      toggleSidebarCollapsed: () =>
        set((state: Layout) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),
      activeNavigationKey: 'home.home',
      setActiveNavigationKey: (key: string) => set({ activeNavigationKey: key }),
    }),
    {
      name: 'layout-storage',
      storage: createJSONStorage(() => localStorage),
      // Don't persist activeNavigationKey - it should always be derived from URL
      partialize: (state) => ({
        mobileSideBarOpen: state.mobileSideBarOpen,
        controlLayoutOpen: state.controlLayoutOpen,
        controlLayoutCollapsed: state.controlLayoutCollapsed,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
