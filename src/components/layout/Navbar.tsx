import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

export function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      // Threshold: nearly 100vh (~85% of viewport height)
      const threshold = window.innerHeight * 0.85;
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login?redirect=/wishlist');
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login?redirect=/cart');
    } else {
      navigate('/cart');
    }
  };

    const navLinkClass = isTransparent
      ? 'text-white/90 hover:text-white transition-colors font-medium drop-shadow-xs'
      : 'text-charcoal hover:text-primary transition-colors font-medium';

    const iconButtonClass = isTransparent
      ? 'text-white/90 hover:text-white transition-colors p-1 drop-shadow-xs'
      : 'text-charcoal hover:text-primary transition-colors p-1';

    return (
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent border-b border-transparent shadow-none'
            : 'border-b border-primary/20 bg-ivory/90 backdrop-blur-md shadow-xs'
        }`}
      >
        <div className="w-full lg:w-[70%] mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-1 transition-colors ${iconButtonClass}`}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link
              to="/"
              className={`flex items-center gap-2 transition-opacity hover:opacity-90 ${
                isTransparent ? 'drop-shadow-sm' : ''
              }`}
            >
              <img src="/logo.png" alt="ODCRAFTS Logo" className="h-8 md:h-10 w-auto object-contain drop-shadow-sm" />
              <span className={`text-lg md:text-xl font-serif font-bold tracking-tight ${isTransparent ? 'text-white' : 'text-primary'}`}>
                ODCRAFTS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            <Link to="/" className={navLinkClass}>
              {t('nav.home', 'Home')}
            </Link>
            <Link to="/shop" className={navLinkClass}>
              {t('nav.shop', 'Shop')}
            </Link>
            <Link to="/artisans" className={navLinkClass}>
              {t('nav.artisans', 'Artisans')}
            </Link>
            <Link to="/stories" className={navLinkClass}>
              {t('nav.stories', 'Stories')}
            </Link>
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-4 relative">
            <Link
              to="/shop"
              aria-label={t('nav.search', 'Search')}
              className={`hidden sm:block ${iconButtonClass}`}
            >
              <Search className="h-5 w-5" />
            </Link>

            <Link
              to="/wishlist"
              onClick={handleWishlistClick}
              aria-label={t('nav.wishlist', 'Wishlist')}
              className={iconButtonClass}
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* User Account / Dropdown */}
            <div className="relative">
              <button
                onClick={handleAccountClick}
                aria-label={t('nav.account', 'Account')}
                className={`flex items-center gap-1.5 transition-colors p-1 ${
                  isTransparent
                    ? 'text-white/90 hover:text-white drop-shadow-xs'
                    : 'text-charcoal hover:text-primary'
                }`}
              >
                {isAuthenticated && user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="h-6 w-6 rounded-full object-cover border border-warm-gray/20" />
                ) : (
                  <UserIcon className="h-5 w-5" />
                )}
                {isAuthenticated && user && (
                  <span
                    className={`hidden lg:inline text-xs font-semibold max-w-[90px] truncate ${
                      isTransparent ? 'text-white drop-shadow-xs' : 'text-charcoal'
                    }`}
                  >
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </button>

              {/* Dropdown Menu for Authenticated Users */}
              {dropdownOpen && isAuthenticated && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-xl bg-white p-2 shadow-xl border border-warm-gray/15 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-warm-gray/10 mb-1 flex items-center gap-3">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover border border-warm-gray/15 shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-ivory text-charcoal flex items-center justify-center font-bold text-sm border border-warm-gray/15 shrink-0">
                        <UserIcon className="h-5 w-5 text-warm-gray" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-charcoal truncate">{user?.name}</p>
                      <p className="text-xs text-warm-gray truncate">{user?.email}</p>
                      <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/account"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-ivory rounded-lg transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-warm-gray" />
                    My Profile
                  </Link>

                  <Link
                    to="/orders"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-ivory rounded-lg transition-colors"
                  >
                    <Package className="h-4 w-4 text-warm-gray" />
                    My Orders
                  </Link>

                  {user?.role === 'SELLER' && (
                    <Link
                      to="/seller"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-primary font-medium hover:bg-ivory rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Artisan Dashboard
                    </Link>
                  )}

                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-primary font-medium hover:bg-ivory rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/5 rounded-lg transition-colors mt-1 border-t border-warm-gray/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <button
              onClick={handleCartClick}
              aria-label={t('nav.cart', 'Cart')}
              className={`relative transition-colors p-1 ${
                isTransparent
                  ? 'text-white/90 hover:text-white drop-shadow-xs'
                  : 'text-charcoal hover:text-primary'
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount() > 0 && (
                <span
                  className={`absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[10px] font-bold shadow-xs transition-colors ${
                    isTransparent
                      ? 'bg-secondary text-charcoal font-bold'
                      : 'bg-primary text-white'
                  }`}
                >
                  {itemCount()}
                </span>
              )}
            </button>
          </div>
        </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary/10 bg-ivory px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-charcoal hover:text-primary py-1"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-charcoal hover:text-primary py-1"
          >
            Shop Authentic Crafts
          </Link>
          <Link
            to="/artisans"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-charcoal hover:text-primary py-1"
          >
            Meet the Artisans
          </Link>
          <Link
            to="/stories"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-charcoal hover:text-primary py-1"
          >
            Cultural Stories
          </Link>
          {isAuthenticated ? (
            <div className="pt-2 border-t border-warm-gray/15 space-y-2">
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-charcoal"
              >
                My Orders
              </Link>
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-charcoal"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-sm text-error font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-warm-gray/15 flex gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-medium rounded-lg bg-primary text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-medium rounded-lg border border-primary text-primary"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
