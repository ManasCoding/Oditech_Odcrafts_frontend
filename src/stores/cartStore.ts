import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/services/api';

export interface CartItem {
  _id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  sellerId: string;
  sellerName?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  stockQuantity: number;
  savedForLater?: boolean;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  itemCount: () => number;
  subtotal: () => number;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      itemCount: () => {
        return get().items.reduce((sum, item) => sum + (item.savedForLater ? 0 : item.quantity), 0);
      },

      subtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + (item.savedForLater ? 0 : item.unitPrice * item.quantity),
          0
        );
      },

      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const res = await api.get('/cart');
          if (res.data?.data?.cart?.items) {
            set({ items: res.data.data.cart.items });
          }
        } catch {
          // If not logged in, keep local items
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (productId: string, quantity = 1) => {
        const res = await api.post('/cart/items', { productId, quantity });
        if (res.data?.data?.cart?.items) {
          set({ items: res.data.data.cart.items });
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        const res = await api.patch(`/cart/items/${itemId}`, { quantity });
        if (res.data?.data?.cart?.items) {
          set({ items: res.data.data.cart.items });
        }
      },

      removeItem: async (itemId: string) => {
        const res = await api.delete(`/cart/items/${itemId}`);
        if (res.data?.data?.cart?.items) {
          set({ items: res.data.data.cart.items });
        }
      },

      clearCart: async () => {
        try {
          await api.delete('/cart');
        } catch {
          // ignore error
        }
        set({ items: [] });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
