import { create } from 'zustand';

interface UIState {
  isMobileNavOpen: boolean;
  isCartDrawerOpen: boolean;
  toggleMobileNav: () => void;
  toggleCartDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileNavOpen: false,
  isCartDrawerOpen: false,
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
}));
