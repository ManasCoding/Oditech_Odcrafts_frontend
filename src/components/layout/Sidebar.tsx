import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  FileText,
  CreditCard,
  User,
  ExternalLink,
  X,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface SidebarProps {
  role: 'seller' | 'admin';
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const sellerLinks = [
    { name: 'Overview', href: '/seller/dashboard', icon: LayoutDashboard },
    { name: 'My Products', href: '/seller/products', icon: Package },
    { name: 'Customer Orders', href: '/seller/orders', icon: ShoppingCart },
    { name: 'Wallet & Earnings', href: '/seller/earnings', icon: CreditCard },
    { name: 'Artisan Profile', href: '/seller/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Metrics Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Artisan Approvals', href: '/admin/artisans', icon: Users },
    { name: 'Product Approvals', href: '/admin/products', icon: Package },
    { name: 'Master Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Access Control', href: '/admin/access', icon: Shield },
    { name: 'Admin Profile', href: '/admin/profile', icon: User },
  ];

  const links = role === 'seller' ? sellerLinks : adminLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLinkClick = () => {
    onClose?.();
  };

  const navContent = (
    <>
      <div className="px-4 py-3 bg-ivory/50 border-b border-warm-gray/10">
        <span className="text-[10px] font-bold tracking-wider text-secondary-dark uppercase">
          {role === 'admin' ? '🛡️ Administration' : '🧵 Artisan Workspace'}
        </span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.href);
          return (
            <Link
              key={link.name}
              to={link.href}
              onClick={handleLinkClick}
              className={cn(
                'flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-charcoal hover:bg-ivory hover:text-primary'
              )}
            >
              <link.icon className="h-4 w-4 mr-3 shrink-0" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-warm-gray/15">
        <button
          onClick={() => {
            onClose?.();
            handleLogout();
          }}
          className="flex items-center w-full px-3.5 py-2 text-xs font-semibold text-error hover:bg-error/10 rounded-xl transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3 shrink-0" />
          Exit & Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="w-64 bg-white border-r border-warm-gray/20 hidden md:flex flex-col shrink-0">
        <div className="h-16 flex items-center justify-between px-6 border-b border-warm-gray/15">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="ODCRAFTS Logo" className="h-8 w-auto object-contain" />
            <span className="text-xl font-serif font-bold text-primary tracking-tight">ODCRAFTS</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="text-xs text-warm-gray hover:text-primary flex items-center gap-1"
            title="Open Marketplace Storefront"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {navContent}
      </aside>

      {/* Mobile Slide-over Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-over Drawer Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-warm-gray/15">
          <Link to="/" onClick={onClose} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="ODCRAFTS Logo" className="h-8 w-auto object-contain" />
            <span className="text-xl font-serif font-bold text-primary tracking-tight">ODCRAFTS</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-warm-gray hover:text-charcoal hover:bg-ivory"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {navContent}
      </aside>
    </>
  );
}
