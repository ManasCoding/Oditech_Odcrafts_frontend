import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { useCartStore } from '@/stores/cartStore';

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem: addCartItem, fetchCart } = useCartStore();

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/wishlist');
      setItems(res.data?.data?.wishlist?.items || []);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (itemId: string) => {
    try {
      await api.delete(`/wishlist/items/${itemId}`);
      setItems(items.filter((i) => i._id !== itemId));
      toast.info('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (item: any) => {
    try {
      await addCartItem(item.productId, 1);
      await api.delete(`/wishlist/items/${item._id}`);
      setItems(items.filter((i) => i._id !== item._id));
      await fetchCart();
      toast.success('Moved item to basket!');
    } catch {
      toast.error('Could not move item to cart');
    }
  };

  return (
    <>
      <Helmet>
        <title>Saved Treasures (Wishlist) — ODCRAFTS</title>
      </Helmet>

      <div className="min-h-screen bg-ivory py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mb-2">
            Saved Treasures
          </h1>
          <p className="text-xs text-warm-gray mb-8">
            Creations you’ve bookmarked from Odisha's women artisans
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white border border-warm-gray/15 p-4 h-72" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-warm-gray/15 p-8 shadow-xs">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ivory text-primary mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-charcoal">Your wishlist is empty</h2>
              <p className="text-sm text-warm-gray mt-2 max-w-sm mx-auto">
                Save handlooms, Pattachitra scrolls, and jewelry you admire while exploring the craft catalog.
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-primary-light transition-all"
              >
                Browse Odisha Crafts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="group relative flex flex-col rounded-xl bg-white border border-warm-gray/15 overflow-hidden shadow-xs hover:shadow-lg transition-all"
                >
                  <Link
                    to={`/product/${item.productSlug}`}
                    className="aspect-4/5 w-full overflow-hidden bg-ivory-dark"
                  >
                    <img
                      src={
                        item.productImage ||
                        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={item.productName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="p-4 flex flex-1 flex-col justify-between">
                    <div>
                      <Link to={`/product/${item.productSlug}`}>
                        <h3 className="font-serif text-sm font-bold text-charcoal hover:text-primary transition-colors line-clamp-1">
                          {item.productName}
                        </h3>
                      </Link>
                      <p className="mt-1 text-sm font-bold text-charcoal">
                        ₹{item.sellingPrice?.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-warm-gray/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary text-[11px] font-bold text-white hover:bg-primary-light transition-colors"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Move to Basket</span>
                      </button>

                      <button
                        onClick={() => handleRemove(item._id)}
                        className="p-2 text-warm-gray hover:text-error transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
