import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, isLoading, fetchCart, updateQuantity, removeItem } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const activeItems = items.filter((i) => !i.savedForLater);
  const subtotal = activeItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingEstimate = activeItems.length > 0 ? 50 : 0;
  const grandTotal = subtotal + shippingEstimate;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      <Helmet>
        <title>Shopping Basket — ODCRAFTS</title>
      </Helmet>

      <div className="min-h-screen bg-ivory py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mb-2">
            Shopping Basket
          </h1>
          <p className="text-xs text-warm-gray mb-8">
            {activeItems.length} handcrafted {activeItems.length === 1 ? 'item' : 'items'} in your basket
          </p>

          {activeItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-warm-gray/15 p-8 shadow-xs">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ivory text-primary mb-4">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-charcoal">Your basket is empty</h2>
              <p className="text-sm text-warm-gray mt-2 max-w-sm mx-auto">
                Explore handwoven Sambalpuri sarees, Pattachitra paintings, and sacred silver filigree handcrafted by Odisha’s women artisans.
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-primary-light transition-all"
              >
                Discover Odisha Crafts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Items List */}
              <div className="lg:col-span-8 space-y-4">
                {activeItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl bg-white p-4 border border-warm-gray/15 shadow-xs"
                  >
                    {/* Thumbnail */}
                    <Link
                      to={`/product/${item.productSlug}`}
                      className="aspect-square w-20 rounded-lg overflow-hidden bg-ivory-dark shrink-0"
                    >
                      <img
                        src={
                          item.productImage ||
                          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=200&q=80'
                        }
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-secondary-dark font-semibold uppercase tracking-wider">
                        By {item.sellerName || 'Odisha Artisan'}
                      </p>
                      <Link
                        to={`/product/${item.productSlug}`}
                        className="font-serif text-base font-semibold text-charcoal hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm font-bold text-charcoal mt-1">
                        ₹{item.unitPrice?.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Quantity Picker */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-lg border border-warm-gray/30 bg-white">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs font-semibold text-charcoal hover:bg-ivory"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs font-semibold text-charcoal hover:bg-ivory"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-1.5 text-warm-gray hover:text-error transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-4">
                <div className="rounded-2xl bg-white p-6 border border-warm-gray/15 shadow-xs space-y-4">
                  <h2 className="font-serif text-lg font-bold text-charcoal pb-3 border-b border-warm-gray/10">
                    Order Summary
                  </h2>

                  <div className="space-y-2 text-xs text-charcoal-light">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-charcoal">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Direct Village Shipping</span>
                      <span className="font-bold text-charcoal">₹{shippingEstimate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Artisan Remuneration</span>
                      <span className="text-accent font-semibold">100% Fair Guaranteed</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-warm-gray/10 flex justify-between text-base font-bold text-charcoal">
                    <span>Estimated Total</span>
                    <span className="text-primary">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 text-xs font-bold text-white shadow-md hover:bg-primary-light transition-all"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="pt-2 text-center flex items-center justify-center gap-1.5 text-[11px] text-warm-gray">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                    <span>Secure Encrypted Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
