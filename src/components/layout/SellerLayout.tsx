import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  LayoutDashboard,
  Package,
  Plus,
  ShoppingCart,
  CreditCard,
  User,
  ExternalLink,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { cn } from '@/utils/cn';

export default function SellerLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const workspaceTabs = [
    { name: 'Overview', href: '/seller/dashboard', icon: LayoutDashboard },
    { name: 'My Products', href: '/seller/products', icon: Package },
    { name: 'Add Creation', href: '/seller/products/new', icon: Plus },
    { name: 'Customer Orders', href: '/seller/orders', icon: ShoppingCart },
    { name: 'Wallet & Earnings', href: '/seller/earnings', icon: CreditCard },
    { name: 'Artisan Profile', href: '/seller/profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-ivory">
      {/* Sidebar with Desktop & Mobile Drawer Support */}
      <Sidebar
        role="seller"
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Responsive Top Bar */}
        <header className="h-16 border-b border-warm-gray/15 bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-charcoal hover:bg-ivory hover:text-primary md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-serif font-bold text-primary">
                Artisan Workspace
              </span>
              <span className="hidden sm:inline-block rounded-full bg-accent/15 text-accent px-2 py-0.5 text-[10px] font-bold">
                Odisha Heritage
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/seller/products/new"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-light transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Craft</span>
            </Link>

            <Link
              to="/shop"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-warm-gray/30 px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-ivory hover:text-primary transition-colors"
            >
              <span className="hidden xs:inline">Storefront</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        {/* Responsive Horizontal Tab Strip */}
        {/* <div className="bg-white border-b border-warm-gray/15 px-3 sm:px-6 py-2 overflow-x-auto scrollbar-none sticky top-16 z-20 shadow-2xs">
          <nav className="flex items-center gap-1 sm:gap-2 min-w-max">
            {workspaceTabs.map((tab) => {
              const isActive =
                tab.href === '/seller/products/new'
                  ? location.pathname === '/seller/products/new'
                  : location.pathname === tab.href ||
                    (tab.href === '/seller/products' &&
                      location.pathname.startsWith('/seller/products') &&
                      location.pathname !== '/seller/products/new') ||
                    (tab.href === '/seller/earnings' && location.pathname === '/seller/wallet');

              return (
                <Link
                  key={tab.name}
                  to={tab.href}
                  className={cn(
                    'flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all',
                    isActive
                      ? 'bg-primary text-white shadow-xs font-bold'
                      : 'text-charcoal/80 hover:bg-ivory hover:text-primary'
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </nav>
        </div> */}

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
