import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';
import { api } from '@/services/api';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const selectedCategory = searchParams.get('category') || '';
  const selectedCraft = searchParams.get('craft') || '';
  const selectedDistrict = searchParams.get('district') || '';
  const selectedSort = searchParams.get('sort') || 'recommended';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const searchQuery = searchParams.get('q') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  // Data states
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [crafts, setCrafts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [drawerClosing, setDrawerClosing] = useState(false);

  // Search input state
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Scroll animation for product grid — re-observe whenever products change
  const gridRef = useRef<HTMLDivElement>(null);

  const observeGridItems = useCallback(() => {
    const container = gridRef.current;
    if (!container) return;
    // Small delay to ensure DOM has updated after React render
    const rafId = requestAnimationFrame(() => {
      const targets = container.querySelectorAll('.scroll-fade-up');
      if (!targets.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
      );

      targets.forEach((el) => observer.observe(el));
    });
    return rafId;
  }, []);

  // Odisha Districts list
  const districts = [
    'Bargarh',
    'Puri',
    'Cuttack',
    'Dhenkanal',
    'Sambalpur',
    'Mayurbhanj',
    'Ganjam',
    'Sonepur',
    'Koraput',
  ];

  // Load categories & crafts once
  useEffect(() => {
    async function loadMeta() {
      try {
        const [catRes, craftRes] = await Promise.all([
          api.get('/categories'),
          api.get('/crafts'),
        ]);
        setCategories(catRes.data?.data?.categories || []);
        setCrafts(craftRes.data?.data?.crafts || []);
      } catch (err) {
        console.error('Error fetching metadata:', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch products whenever searchParams change
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const params: Record<string, string> = {};
        if (selectedCategory) params.category = selectedCategory;
        if (selectedCraft) params.craft = selectedCraft;
        if (selectedDistrict) params.district = selectedDistrict;
        if (selectedSort) params.sort = selectedSort;
        if (minPriceParam) params.minPrice = minPriceParam;
        if (maxPriceParam) params.maxPrice = maxPriceParam;
        if (searchQuery) params.q = searchQuery;
        params.page = String(currentPage);
        params.limit = '12';

        const res = await api.get('/products', { params });
        setProducts(res.data?.data?.products || []);
        setPagination(res.data?.data?.pagination || null);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [
    selectedCategory,
    selectedCraft,
    selectedDistrict,
    selectedSort,
    minPriceParam,
    maxPriceParam,
    searchQuery,
    currentPage,
  ]);

  // Re-run scroll observer after products are rendered into the grid
  useEffect(() => {
    if (!isLoading && products.length > 0) {
      const rafId = observeGridItems();
      return () => {
        if (rafId !== undefined) cancelAnimationFrame(rafId);
      };
    }
  }, [isLoading, products, observeGridItems]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '1'); // reset page
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('q', localSearch.trim());
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setLocalSearch('');
  };

  const closeMobileFilters = () => {
    setDrawerClosing(true);
    setTimeout(() => {
      setMobileFiltersOpen(false);
      setDrawerClosing(false);
    }, 280);
  };

  const hasActiveFilters =
    Boolean(selectedCategory || selectedCraft || selectedDistrict || minPriceParam || maxPriceParam || searchQuery);

  return (
    <>
      <Helmet>
        <title>Shop Authentic Odisha Crafts &amp; Handlooms — ODCRAFTS</title>
        <meta
          name="description"
          content="Discover authentic handmade creations directly from women artisans of Odisha. Sambalpuri sarees, Pattachitra scrolls, Dhokra brass, and silver filigree."
        />
      </Helmet>

      <div className="min-h-screen bg-ivory pb-20 md:pb-0">
        {/* Editorial Header */}
        <div className="border-b border-primary/10 bg-ivory-dark/40 py-6 sm:py-10 md:py-14">
          <div className="container mx-auto px-4 text-center">
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-secondary-dark uppercase">
              The Living Crafts of Odisha
            </span>
            <h1 className="mt-1.5 sm:mt-2 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary">
              Discover the Hands Behind the Craft
            </h1>
            <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm md:text-base text-charcoal-light leading-relaxed">
              Every purchase connects you directly with a woman artisan in Odisha, supporting her livelihood, family, and heritage craft.
            </p>

            {/* Category Navigation Pills */}
            <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => updateFilter('category', '')}
                className={`rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                  !selectedCategory
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white/80 text-charcoal hover:bg-white'
                }`}
              >
                All Treasures
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateFilter('category', cat.slug || cat._id)}
                  className={`rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat.slug || selectedCategory === cat._id
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-white/80 text-charcoal hover:bg-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-3 sm:px-4 py-6 md:py-10">
          {/* Top Bar: Search, Filters button (mobile), Sort */}
          <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search sarees, pattachitra, dhokra..."
                className="w-full pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg border border-warm-gray/25 bg-white text-charcoal placeholder:text-warm-gray placeholder:text-xs sm:placeholder:text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              />
              <Search className="absolute left-3 top-2 sm:left-3.5 sm:top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-warm-gray" />
            </form>

            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 rounded-lg border border-warm-gray/30 bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-medium text-charcoal shadow-xs"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="hidden sm:inline text-xs text-warm-gray">Sort:</span>
                <div className="relative">
                  <select
                    value={selectedSort}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="appearance-none rounded-lg border border-warm-gray/25 bg-white py-1.5 sm:py-2 pl-2.5 sm:pl-3 pr-7 sm:pr-8 text-xs font-medium text-charcoal focus:border-primary focus:outline-none shadow-2xs"
                  >
                    <option value="recommended">Curated / Recommended</option>
                    <option value="newest">New Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="popular">Most Loved</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ArrowUpDown className="pointer-events-none absolute right-2 top-2 sm:right-2.5 sm:top-2.5 h-3.5 w-3.5 text-warm-gray" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 lg:gap-8">
            {/* Desktop Sidebar Filters — STICKY */}
            <aside className="hidden lg:block w-60 shrink-0">
              <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto rounded-xl border border-warm-gray/15 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-warm-gray/10">
                  <h3 className="font-serif text-base font-bold text-charcoal">Filter Crafts</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Reset all
                    </button>
                  )}
                </div>

                {/* Craft Filter */}
                <div className="py-4 border-b border-warm-gray/10 space-y-2">
                  <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                    Traditional Craft
                  </h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    <label className="flex items-center gap-2 text-xs text-charcoal cursor-pointer hover:text-primary">
                      <input
                        type="radio"
                        name="craft"
                        checked={!selectedCraft}
                        onChange={() => updateFilter('craft', '')}
                        className="text-primary focus:ring-primary"
                      />
                      All Crafts
                    </label>
                    {crafts.map((craft) => (
                      <label
                        key={craft._id}
                        className="flex items-center gap-2 text-xs text-charcoal cursor-pointer hover:text-primary"
                      >
                        <input
                          type="radio"
                          name="craft"
                          checked={selectedCraft === craft.slug || selectedCraft === craft._id}
                          onChange={() => updateFilter('craft', craft.slug || craft._id)}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="truncate">{craft.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* District Filter */}
                <div className="py-4 border-b border-warm-gray/10 space-y-2">
                  <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                    Odisha District
                  </h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    <label className="flex items-center gap-2 text-xs text-charcoal cursor-pointer hover:text-primary">
                      <input
                        type="radio"
                        name="district"
                        checked={!selectedDistrict}
                        onChange={() => updateFilter('district', '')}
                        className="text-primary focus:ring-primary"
                      />
                      All Odisha
                    </label>
                    {districts.map((dist) => (
                      <label
                        key={dist}
                        className="flex items-center gap-2 text-xs text-charcoal cursor-pointer hover:text-primary"
                      >
                        <input
                          type="radio"
                          name="district"
                          checked={selectedDistrict === dist}
                          onChange={() => updateFilter('district', dist)}
                          className="text-primary focus:ring-primary"
                        />
                        <span>{dist}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                    Price Range (₹)
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPriceParam}
                      onChange={(e) => updateFilter('minPrice', e.target.value)}
                      className="w-full rounded border border-warm-gray/30 px-2 py-1 text-xs text-charcoal"
                    />
                    <span className="text-warm-gray">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPriceParam}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                      className="w-full rounded border border-warm-gray/30 px-2 py-1 text-xs text-charcoal"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <main className="flex-1 min-w-0">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-2xl border border-warm-gray/15 bg-white p-6 sm:p-12 text-center shadow-xs">
                  <h3 className="font-serif text-lg sm:text-2xl font-bold text-charcoal">
                    No crafts found
                  </h3>
                  <p className="mx-auto mt-1.5 sm:mt-2 max-w-sm text-xs sm:text-sm text-warm-gray">
                    We couldn't find any creations matching your current filters. Try resetting your search or selecting another category.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 sm:px-6 py-2 sm:py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-light transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div
                    ref={gridRef}
                    className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 items-stretch"
                  >
                    {products.map((product, idx) => (
                      <div
                        key={product._id}
                        className={`scroll-fade-up stagger-${(idx % 8) + 1} h-full`}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {pagination && pagination.pages > 1 && (
                    <div className="mt-8 sm:mt-10 md:mt-12 flex items-center justify-center gap-1.5 sm:gap-2">
                      <button
                        onClick={() => updateFilter('page', String(currentPage - 1))}
                        disabled={!pagination.hasPrev}
                        className="rounded-lg border border-warm-gray/30 bg-white px-3 py-1.5 sm:px-3.5 sm:py-1.5 text-xs font-medium text-charcoal disabled:opacity-40 hover:bg-ivory transition-colors"
                      >
                        Previous
                      </button>
                      <span className="text-xs font-semibold text-charcoal px-2 sm:px-3">
                        Page {pagination.page} of {pagination.pages}
                      </span>
                      <button
                        onClick={() => updateFilter('page', String(currentPage + 1))}
                        disabled={!pagination.hasNext}
                        className="rounded-lg border border-warm-gray/30 bg-white px-3 py-1.5 sm:px-3.5 sm:py-1.5 text-xs font-medium text-charcoal disabled:opacity-40 hover:bg-ivory transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filter Modal — with overlay fade + slide-in drawer */}
        {mobileFiltersOpen && (
          <div
            className={`fixed inset-0 z-50 flex lg:hidden ${
              drawerClosing ? 'opacity-0' : 'overlay-fade-in'
            }`}
            style={{ transition: drawerClosing ? 'opacity 0.25s ease-out' : undefined }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              onClick={closeMobileFilters}
            />

            {/* Drawer */}
            <div
              className={`ml-auto relative flex h-full w-full max-w-[280px] sm:max-w-xs flex-col bg-white p-5 sm:p-6 shadow-2xl ${
                drawerClosing ? 'translate-x-full' : 'drawer-slide-in'
              }`}
              style={{ transition: drawerClosing ? 'transform 0.28s ease-in' : undefined }}
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-warm-gray/10">
                <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal">Filters</h3>
                <button onClick={closeMobileFilters} className="p-1 -mr-1 text-warm-gray hover:text-charcoal">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-5">
                {/* Craft Filter */}
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                    Traditional Craft
                  </h4>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs sm:text-sm text-charcoal cursor-pointer">
                      <input
                        type="radio"
                        name="m-craft"
                        checked={!selectedCraft}
                        onChange={() => updateFilter('craft', '')}
                        className="text-primary focus:ring-primary"
                      />
                      All Crafts
                    </label>
                    {crafts.map((craft) => (
                      <label key={craft._id} className="flex items-center gap-2 text-xs sm:text-sm text-charcoal cursor-pointer">
                        <input
                          type="radio"
                          name="m-craft"
                          checked={selectedCraft === craft.slug || selectedCraft === craft._id}
                          onChange={() => updateFilter('craft', craft.slug || craft._id)}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="truncate">{craft.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* District Filter */}
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                    Odisha District
                  </h4>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs sm:text-sm text-charcoal cursor-pointer">
                      <input
                        type="radio"
                        name="m-district"
                        checked={!selectedDistrict}
                        onChange={() => updateFilter('district', '')}
                        className="text-primary focus:ring-primary"
                      />
                      All Districts
                    </label>
                    {districts.map((dist) => (
                      <label key={dist} className="flex items-center gap-2 text-xs sm:text-sm text-charcoal cursor-pointer">
                        <input
                          type="radio"
                          name="m-district"
                          checked={selectedDistrict === dist}
                          onChange={() => updateFilter('district', dist)}
                          className="text-primary focus:ring-primary"
                        />
                        <span>{dist}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter in Mobile Drawer */}
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                    Price Range (₹)
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPriceParam}
                      onChange={(e) => updateFilter('minPrice', e.target.value)}
                      className="w-full rounded border border-warm-gray/30 px-2 py-1 text-xs text-charcoal"
                    />
                    <span className="text-warm-gray text-xs">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPriceParam}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                      className="w-full rounded border border-warm-gray/30 px-2 py-1 text-xs text-charcoal"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3.5 border-t border-warm-gray/10 flex gap-2.5">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 rounded-lg border border-warm-gray/30 py-2 sm:py-2.5 text-xs font-semibold text-charcoal hover:bg-ivory transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={closeMobileFilters}
                  className="flex-1 rounded-lg bg-primary py-2 sm:py-2.5 text-xs font-semibold text-white shadow-md hover:bg-primary-light transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
