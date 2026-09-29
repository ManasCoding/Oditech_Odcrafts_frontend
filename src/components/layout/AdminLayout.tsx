import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { cn } from '@/utils/cn';

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const adminTabs = [
    { name: 'Metrics Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Artisan Approvals', href: '/admin/artisans', icon: Users },
    { name: 'Product Approvals', href: '/admin/products', icon: Package },
    { name: 'Master Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Access Control', href: '/admin/access', icon: Shield },
    { name: 'Admin Profile', href: '/admin/profile', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-ivory">
      {/* Sidebar with Desktop & Mobile Drawer Support */}
      <Sidebar
        role="admin"
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Responsive Header */}
        <header className="h-16 border-b border-warm-gray/15 bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-charcoal hover:bg-ivory hover:text-primary md:hidden"
              aria-label="Open admin menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-base sm:text-lg text-primary">Admin Control Center</h1>
              <span className="hidden sm:inline-block rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold">
                Moderator
              </span>
            </div>
          </div>

          <Link
            to="/shop"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-warm-gray/30 px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-ivory hover:text-primary transition-colors"
          >
            <span className="hidden xs:inline">Marketplace</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </header>

        {/* Responsive Horizontal Tab Strip */}
        <div className="bg-white border-b border-warm-gray/15 px-3 sm:px-6 py-2 overflow-x-auto scrollbar-none sticky top-16 z-20 shadow-2xs">
          <nav className="flex items-center gap-1 sm:gap-2 min-w-max">
            {adminTabs.map((tab) => {
              const isActive = location.pathname === tab.href || location.pathname.startsWith(tab.href + '/');

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
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
