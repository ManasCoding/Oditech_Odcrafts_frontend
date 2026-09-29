import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Share2,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { ProductCard } from '@/components/product/ProductCard';
import { useScrollAnimation, useScrollAnimationGroup } from '@/utils/useScrollAnimation';

// ─── Star Rating Input ───
function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= (hover || value)
                ? 'fill-secondary text-secondary'
                : 'text-warm-gray/30'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-xs font-semibold text-charcoal">
          {value === 1 && 'Poor'}
          {value === 2 && 'Fair'}
          {value === 3 && 'Good'}
          {value === 4 && 'Very Good'}
          {value === 5 && 'Excellent'}
        </span>
      )}
    </div>
  );
}

// ─── Rating Distribution Bar ───
function RatingDistribution({
  reviews,
  averageRating,
}: {
  reviews: any[];
  averageRating: number;
}) {
  const counts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );
  const total = reviews.length;

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
      {/* Average */}
      <div className="text-center shrink-0">
        <div className="text-4xl font-bold text-charcoal">
          {averageRating > 0 ? averageRating.toFixed(1) : '—'}
        </div>
        <div className="flex items-center justify-center mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(averageRating)
                  ? 'fill-secondary text-secondary'
                  : 'text-warm-gray/30'
              }`}
            />
          ))}
        </div>
        <p className="mt-1 text-xs text-warm-gray">{total} review{total !== 1 ? 's' : ''}</p>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 space-y-1.5 w-full">
        {[5, 4, 3, 2, 1].map((star, idx) => {
          const count = counts[idx];
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-right font-medium text-charcoal">{star}</span>
              <Star className="h-3 w-3 fill-secondary text-secondary shrink-0" />
              <div className="flex-1 h-2 rounded-full bg-warm-gray/15 overflow-hidden">
                <div
                  className="h-full rounded-full bg-secondary transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-5 text-right text-warm-gray">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { addItem: addCartItem, fetchCart } = useCartStore();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Scroll animation refs
  const detailsRef = useScrollAnimation();
  const reviewsRef = useScrollAnimation();
  const relatedRef = useScrollAnimationGroup();

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        const p = res.data?.data?.product;
        setProduct(p);

        // Fetch related products & reviews in parallel
        const [relatedRes, reviewsRes] = await Promise.all([
          api.get('/products/related', {
            params: {
              productId: p._id,
              categoryId: p.categoryId?._id || p.categoryId,
              craftId: p.craftId?._id || p.craftId,
            },
          }),
          api.get(`/reviews/product/${p._id}`),
        ]);

        setRelatedProducts(relatedRes.data?.data?.products || []);
        setReviews(reviewsRes.data?.data?.reviews || []);

        // Check if item is wishlisted for authenticated user
        if (isAuthenticated) {
          try {
            const checkRes = await api.get(`/wishlist/check/${p._id}`);
            setIsWishlisted(checkRes.data?.data?.inWishlist || false);
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [slug, isAuthenticated]);

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate(
        `/login?redirect=${encodeURIComponent(`/product/${product.slug}`)}&action=wishlist&productId=${product._id}`
      );
      return;
    }

    try {
      await api.post('/wishlist/items', { productId: product._id });
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist!');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate(
        `/login?redirect=${encodeURIComponent(`/product/${product.slug}`)}&action=cart&productId=${product._id}`
      );
      return;
    }

    try {
      setIsAddingToCart(true);
      await addCartItem(product._id, quantity);
      await fetchCart();
      toast.success(`Added ${quantity} item(s) to your basket!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate(
        `/login?redirect=${encodeURIComponent(`/product/${product.slug}`)}&action=buy_now&productId=${product._id}`
      );
      return;
    }

    try {
      await addCartItem(product._id, quantity);
      await fetchCart();
      navigate('/checkout');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not proceed to checkout');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      setIsSubmittingReview(true);
      // The API requires an orderId — we send without it and let API return a friendly error
      // if they haven't purchased. In the future we can pre-check orders.
      await api.post('/reviews', {
        productId: product._id,
        rating: reviewRating,
        title: reviewTitle.trim() || undefined,
        comment: reviewComment.trim(),
      });
      toast.success('Thank you for your review!');

      // Refresh reviews
      const reviewsRes = await api.get(`/reviews/product/${product._id}`);
      setReviews(reviewsRes.data?.data?.reviews || []);

      // Reset form
      setReviewRating(0);
      setReviewTitle('');
      setReviewComment('');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Could not submit review';
      toast.error(msg);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="aspect-square bg-warm-gray/10 rounded-2xl animate-pulse" />
          <div className="space-y-6">
            <div className="h-8 bg-warm-gray/15 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-warm-gray/15 rounded w-1/3 animate-pulse" />
            <div className="h-24 bg-warm-gray/10 rounded w-full animate-pulse" />
            <div className="h-12 bg-warm-gray/15 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-3xl font-bold text-primary">Craft Not Found</h2>
        <p className="mt-2 text-charcoal-light">This creation might have been archived or is temporarily unavailable.</p>
        <Link to="/shop" className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold text-white">
          Explore the Collection
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80' }];

  const currentImage = images[selectedImageIndex]?.url || images[0].url;
  const seller = product.sellerId;
  const sellerUser = seller?.userId;
  const inStock = product.stockQuantity > 0;

  const tabs = [
    { key: 'description' as const, label: 'Description' },
    { key: 'specs' as const, label: 'Specifications' },
    { key: 'reviews' as const, label: `Reviews (${reviews.length})` },
  ];

  return (
    <>
      <Helmet>
        <title>{`${product.name} — ODCRAFTS`}</title>
        <meta name="description" content={product.shortDescription || product.description?.slice(0, 160)} />
      </Helmet>

      <div className="min-h-screen bg-ivory pb-20 md:pb-12">
        <div className="container mx-auto px-4 py-6 md:py-10">
          {/* Breadcrumb Navigation */}
          <nav className="mb-4 md:mb-6 flex items-center gap-1.5 text-[11px] sm:text-xs text-warm-gray overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link to="/" className="hover:text-primary shrink-0">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-primary shrink-0">Shop</Link>
            <span>/</span>
            {product.categoryId && (
              <>
                <Link to={`/shop?category=${product.categoryId._id}`} className="hover:text-primary shrink-0">
                  {product.categoryId.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-charcoal truncate max-w-[150px] sm:max-w-[200px]">{product.name}</span>
          </nav>

          {/* Main Product Layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Gallery Section — smaller */}
            <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-3">
              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[420px] md:max-h-[480px] shrink-0 scrollbar-hide">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-square w-14 sm:w-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-primary shadow-xs'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.alt || product.name} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-white border border-warm-gray/15 shadow-sm max-h-[580px]">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-all duration-300"
                />

                <button
                  onClick={handleWishlist}
                  aria-label="Wishlist"
                  className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-md backdrop-blur-xs hover:bg-white hover:scale-110 active:scale-95 transition-all"
                >
                  <Heart
                    className={`h-4.5 w-4.5 ${
                      isWishlisted ? 'fill-error text-error' : 'text-charcoal hover:text-error'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Product Meta & Actions Section */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Craft & District Tag */}
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-secondary-dark uppercase tracking-wider">
                <span>{product.craftId?.name || 'Odisha Heritage'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {product.district || seller?.district || 'Odisha'}
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-2 font-serif text-xl sm:text-2xl md:text-3xl font-bold text-charcoal leading-tight">
                {product.name}
              </h1>

              {/* Rating & SKU */}
              <div className="mt-3 flex items-center justify-between border-b border-warm-gray/10 pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-secondary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                          i < Math.floor(product.rating || 5)
                            ? 'fill-secondary text-secondary'
                            : 'text-warm-gray/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-charcoal">{product.rating?.toFixed(1) || '5.0'}</span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs text-primary hover:underline"
                  >
                    ({reviews.length} reviews)
                  </button>
                </div>
                <span className="text-[10px] sm:text-[11px] text-warm-gray font-mono hidden sm:inline">SKU: {product.sku}</span>
              </div>

              {/* Price Block */}
              <div className="mt-4 flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-charcoal">
                  ₹{product.sellingPrice?.toLocaleString('en-IN')}
                </span>
                {product.basePrice && product.basePrice > product.sellingPrice && (
                  <>
                    <span className="text-sm sm:text-base text-warm-gray line-through">
                      ₹{product.basePrice?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-semibold text-accent px-2 py-0.5 rounded-full bg-accent/10">
                      Save ₹{(product.basePrice - product.sellingPrice).toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-[10px] sm:text-[11px] text-warm-gray">
                Inclusive of all taxes · 100% fair remuneration directly to the artisan
              </p>

              {/* Short Description */}
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-charcoal-light leading-relaxed line-clamp-3 sm:line-clamp-none">
                {product.shortDescription || product.description?.slice(0, 200)}
              </p>

              {/* Artisan Profile Card */}
              {seller && (
                <div className="mt-5 sm:mt-6 rounded-xl border border-secondary/20 bg-secondary-light/20 p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        seller.photo ||
                        sellerUser?.avatar ||
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80'
                      }
                      alt={sellerUser?.name || 'Artisan'}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border border-secondary/40"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] sm:text-xs font-bold text-secondary-dark uppercase tracking-wider">
                          Master Artisan
                        </span>
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-accent shrink-0" />
                      </div>
                      <Link
                        to={`/artisan/${seller.slug}`}
                        className="font-serif font-bold text-sm sm:text-base text-charcoal hover:text-primary transition-colors truncate block"
                      >
                        {sellerUser?.name || 'Artisan Partner'}
                      </Link>
                      <p className="text-[10px] sm:text-[11px] text-warm-gray truncate">
                        {seller.yearsOfExperience || '20+'} years · {seller.district}, Odisha
                      </p>
                    </div>
                  </div>
                  {seller.artisanStory && (
                    <p className="mt-2 text-[11px] sm:text-xs text-charcoal italic border-t border-secondary/15 pt-2 line-clamp-2">
                      "{seller.artisanStory}"
                    </p>
                  )}
                </div>
              )}

              {/* Purchase Controls */}
              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                {inStock ? (
                  <>
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Quantity Picker */}
                      <div className="flex items-center rounded-lg border border-warm-gray/30 bg-white">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-2 text-sm font-semibold text-charcoal hover:bg-ivory transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-charcoal">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                          className="px-3 py-2 text-sm font-semibold text-charcoal hover:bg-ivory transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-[11px] text-warm-gray hidden sm:inline">
                        Only {product.stockQuantity} handcrafted units remaining
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                      <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-primary py-3 px-4 sm:px-6 text-xs sm:text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-xs"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Add to Basket</span>
                      </button>

                      <button
                        onClick={handleBuyNow}
                        className="flex-1 rounded-xl bg-primary py-3 px-4 sm:px-6 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-primary-light transition-all"
                      >
                        Buy Now
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl bg-warm-gray/10 p-4 text-center">
                    <p className="text-sm font-semibold text-charcoal">Temporarily Sold Out</p>
                    <p className="mt-1 text-xs text-warm-gray">
                      Handcrafted creations take time to make. Save to your wishlist to be notified upon restock.
                    </p>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3 border-t border-warm-gray/15 pt-5 sm:pt-6 text-center text-[10px] sm:text-[11px] text-charcoal-light">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-dark" />
                  <span className="font-semibold text-charcoal">100% Authentic</span>
                  <span className="hidden sm:inline">Handmade in Odisha</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-dark" />
                  <span className="font-semibold text-charcoal">Pan-India Delivery</span>
                  <span className="hidden sm:inline">Direct from village</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-dark" />
                  <span className="font-semibold text-charcoal">Fair Remuneration</span>
                  <span className="hidden sm:inline">Empowering women</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Tabbed Section: Description / Specs / Reviews ─── */}
          <div ref={detailsRef} className="mt-10 sm:mt-14 md:mt-16 scroll-fade-up">
            {/* Tab Navigation */}
            <div className="flex border-b border-warm-gray/15 gap-0 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? 'text-primary'
                      : 'text-warm-gray hover:text-charcoal'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="rounded-b-2xl bg-white border border-t-0 border-warm-gray/15 p-5 sm:p-8 md:p-10 shadow-xs">
              {/* Description Tab */}
              {activeTab === 'description' && (
                <div className="max-w-3xl space-y-4">
                  <h3 className="font-bold text-charcoal uppercase tracking-wider text-xs">
                    The Making Process
                  </h3>
                  <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Specifications Tab */}
              {activeTab === 'specs' && (
                <div className="max-w-lg">
                  <h3 className="font-bold text-charcoal uppercase tracking-wider text-xs mb-4">
                    Specifications
                  </h3>
                  <dl className="divide-y divide-warm-gray/10 text-xs sm:text-sm">
                    {product.materials && product.materials.length > 0 && (
                      <div className="py-3 flex justify-between gap-4">
                        <dt className="text-warm-gray shrink-0">Materials Used</dt>
                        <dd className="font-medium text-charcoal text-right">{product.materials.join(', ')}</dd>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="py-3 flex justify-between gap-4">
                        <dt className="text-warm-gray">Dimensions</dt>
                        <dd className="font-medium text-charcoal">{product.dimensions}</dd>
                      </div>
                    )}
                    {product.weight && (
                      <div className="py-3 flex justify-between gap-4">
                        <dt className="text-warm-gray">Weight</dt>
                        <dd className="font-medium text-charcoal">{product.weight}</dd>
                      </div>
                    )}
                    {product.color && (
                      <div className="py-3 flex justify-between gap-4">
                        <dt className="text-warm-gray">Colors</dt>
                        <dd className="font-medium text-charcoal">{product.color}</dd>
                      </div>
                    )}
                    <div className="py-3 flex justify-between gap-4">
                      <dt className="text-warm-gray">Craft Origin</dt>
                      <dd className="font-medium text-charcoal">{product.craftId?.origin || 'Odisha, India'}</dd>
                    </div>
                    <div className="py-3 flex justify-between gap-4">
                      <dt className="text-warm-gray">SKU</dt>
                      <dd className="font-medium text-charcoal font-mono">{product.sku}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  {/* Rating Distribution */}
                  <RatingDistribution
                    reviews={reviews}
                    averageRating={product.rating || 0}
                  />

                  {/* Write a Review Form */}
                  <div className="border-t border-warm-gray/15 pt-6">
                    <h4 className="font-serif text-lg font-bold text-charcoal mb-4">
                      Write a Review
                    </h4>
                    {isAuthenticated ? (
                      <form onSubmit={handleSubmitReview} className="space-y-4 max-w-lg">
                        <div>
                          <label className="block text-xs font-semibold text-charcoal mb-2">
                            Your Rating *
                          </label>
                          <StarRatingInput value={reviewRating} onChange={setReviewRating} />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-charcoal mb-1.5">
                            Review Title
                          </label>
                          <input
                            type="text"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            placeholder="Sum up your experience..."
                            className="w-full rounded-lg border border-warm-gray/25 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-warm-gray/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-charcoal mb-1.5">
                            Your Review *
                          </label>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={3}
                            placeholder="Tell others about your experience with this craft..."
                            className="w-full rounded-lg border border-warm-gray/25 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-warm-gray/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingReview}
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-light transition-colors disabled:opacity-50"
                        >
                          <Send className="h-3.5 w-3.5" />
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    ) : (
                      <div className="rounded-xl bg-ivory-dark/60 border border-warm-gray/15 p-5 text-center">
                        <p className="text-sm text-charcoal">
                          Sign in to share your experience with this craft.
                        </p>
                        <Link
                          to={`/login?redirect=${encodeURIComponent(`/product/${product.slug}`)}`}
                          className="mt-3 inline-block rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white"
                        >
                          Sign In to Review
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Existing Reviews */}
                  <div className="border-t border-warm-gray/15 pt-6 space-y-4">
                    <h4 className="font-serif text-base font-bold text-charcoal">
                      Customer Reviews
                    </h4>
                    {reviews.length === 0 ? (
                      <p className="text-sm text-warm-gray py-4">
                        No reviews yet for this craft. Be the first patron to share your experience!
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map((rev) => (
                          <div key={rev._id} className="rounded-xl border border-warm-gray/15 bg-ivory/50 p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="flex text-secondary shrink-0">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                                        i < rev.rating ? 'fill-secondary text-secondary' : 'text-warm-gray/30'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-bold text-charcoal truncate">{rev.title}</span>
                              </div>
                              <span className="text-[10px] text-warm-gray shrink-0">
                                {new Date(rev.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-2.5 text-xs text-charcoal-light leading-relaxed">{rev.comment}</p>
                            <div className="mt-3 pt-2.5 border-t border-warm-gray/10 flex items-center justify-between text-[10px] sm:text-[11px] text-warm-gray">
                              <span>{rev.userId?.name || 'Verified Buyer'}</span>
                              {rev.isVerifiedPurchase && (
                                <span className="text-accent flex items-center gap-0.5">
                                  <CheckCircle2 className="h-3 w-3" /> Verified Purchase
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Crafts */}
          {relatedProducts.length > 0 && (
            <div ref={relatedRef} className="mt-12 sm:mt-16">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mb-6 sm:mb-8">
                More from this Artisan & Craft
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {relatedProducts.slice(0, 4).map((p, idx) => (
                  <div key={p._id} className={`scroll-fade-up stagger-${idx + 1} h-full`}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
