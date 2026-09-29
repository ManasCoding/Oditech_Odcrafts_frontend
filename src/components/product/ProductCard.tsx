import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { api } from '@/services/api';

export interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    sellingPrice: number;
    basePrice?: number;
    images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
    rating?: number;
    reviewCount?: number;
    district?: string;
    isHandmade?: boolean;
    isFeatured?: boolean;
    isBestseller?: boolean;
    isNewArrival?: boolean;
    craftId?: { name?: string; slug?: string };
    sellerId?: {
      slug?: string;
      district?: string;
      userId?: { name?: string; avatar?: string };
    };
  };
  initialWishlisted?: boolean;
}

export function ProductCard({ product, initialWishlisted = false }: ProductCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem: addCartItem, fetchCart } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80';

  const secondaryImage = product.images?.[1]?.url;

  const artisanName = product.sellerId?.userId?.name || 'Odisha Artisan';
  const craftName = product.craftId?.name || 'Handmade Craft';
  const district = product.district || product.sellerId?.district || 'Odisha';

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate(
        `/login?redirect=${encodeURIComponent(`/product/${product.slug}`)}&action=wishlist&productId=${product._id}`
      );
      return;
    }

    try {
      setIsWishlistLoading(true);
      if (isWishlisted) {
        // Need item id, or we delete by productId
        await api.post('/wishlist/items', { productId: product._id });
        setIsWishlisted(false);
        toast.info('Removed from wishlist');
      } else {
        await api.post('/wishlist/items', { productId: product._id });
        setIsWishlisted(true);
        toast.success('Saved to your wishlist!');
      }
    } catch {
      toast.error('Failed to update wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate(
        `/login?redirect=${encodeURIComponent(`/product/${product.slug}`)}&action=cart&productId=${product._id}`
      );
      return;
    }

    try {
      setIsCartLoading(true);
      await addCartItem(product._id, 1);
      await fetchCart();
      toast.success(`"${product.name}" added to your basket!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not add product to cart');
    } finally {
      setIsCartLoading(false);
    }
  };

  return (
    <div className="group relative flex flex-col h-full rounded-xl bg-white border border-warm-gray/15 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Product Image Container */}
      <Link to={`/product/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-ivory-dark/30 shrink-0">
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-105 ${
            secondaryImage ? 'group-hover:opacity-0' : ''
          }`}
        />
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-hover:scale-105"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isBestseller && (
            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wide bg-secondary-dark text-white uppercase shadow-xs">
              BESTSELLER
            </span>
          )}
          {product.isNewArrival && !product.isBestseller && (
            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wide bg-primary text-white uppercase shadow-xs">
              NEW
            </span>
          )}
          {product.isFeatured && (
            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wide bg-charcoal text-white uppercase shadow-xs">
              FEATURED
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          disabled={isWishlistLoading}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 hover:bg-white"
        >
          <Heart
            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
              isWishlisted ? 'fill-error text-error' : 'text-charcoal hover:text-error'
            }`}
          />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden md:flex opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            disabled={isCartLoading}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/95 text-xs font-semibold text-charcoal shadow-md backdrop-blur-xs hover:bg-primary hover:text-white transition-colors"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3 justify-between">
        <div>
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-secondary-dark font-medium tracking-wide uppercase gap-1">
            <span className="truncate max-w-[85px] sm:max-w-[120px]">{craftName}</span>
            <span className="text-warm-gray text-[10px] sm:text-[11px] shrink-0">{district}</span>
          </div>

          {/* Product Name with Fixed Height & Line Clamping */}
          <Link
            to={`/product/${product.slug}`}
            className="mt-1 sm:mt-1.5 block group-hover:text-primary transition-colors"
            title={product.name}
          >
            <h3 className="font-serif text-xs sm:text-sm font-semibold text-charcoal line-clamp-2 leading-[1.25rem] sm:leading-snug h-[2.5rem] sm:h-[2.75rem] overflow-hidden">
              {product.name}
            </h3>
          </Link>

          {/* Artisan Byline */}
          <p className="mt-1 text-[11px] sm:text-xs text-charcoal-light flex items-center gap-1 min-w-0">
            <span className="shrink-0">By</span>
            <span className="font-medium text-charcoal truncate">{artisanName}</span>
          </p>
        </div>

        {/* Price & Rating */}
        <div className="mt-2 pt-2 border-t border-warm-gray/10 flex items-center justify-between gap-1">
          <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-charcoal">
              ₹{product.sellingPrice?.toLocaleString('en-IN')}
            </span>
            {product.basePrice && product.basePrice > product.sellingPrice && (
              <span className="text-[10px] sm:text-xs text-warm-gray line-through">
                ₹{product.basePrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {product.rating ? (
            <div className="flex items-center gap-0.5 sm:gap-1 text-[11px] sm:text-xs font-medium text-charcoal shrink-0">
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-secondary text-secondary" />
              <span>{product.rating.toFixed(1)}</span>
              {product.reviewCount ? (
                <span className="text-warm-gray text-[9px] sm:text-[10px]">({product.reviewCount})</span>
              ) : null}
            </div>
          ) : (
            <span className="text-[9px] sm:text-[10px] text-accent font-medium flex items-center gap-0.5 shrink-0">
              <Sparkles className="h-2 w-2 sm:h-2.5 sm:w-2.5" /> Handcrafted
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
