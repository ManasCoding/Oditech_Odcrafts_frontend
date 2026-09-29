import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  avatar?: string;
  sellerStatus?: string;
  sellerSlug?: string;
}

export interface PendingAction {
  type: 'wishlist' | 'cart' | 'buy_now';
  productId: string;
  quantity?: number;
  returnUrl: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  pendingAction: PendingAction | null;
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  setUser: (user: User) => void;
  setPendingAction: (action: PendingAction | null) => void;
  clearPendingAction: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      pendingAction: null,
      setAuth: (user, token, refreshToken) =>
        set({
          user,
          token,
          refreshToken: refreshToken || null,
          isAuthenticated: true,
        }),
      setUser: (user) => set({ user }),
      setPendingAction: (pendingAction) => set({ pendingAction }),
      clearPendingAction: () => set({ pendingAction: null }),
      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          pendingAction: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
