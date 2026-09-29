import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Heart, FileText, User } from 'lucide-react';

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-ivory border-t border-primary/20 pb-safe">
      <div className="flex items-center justify-around h-16">
        <Link to="/" className="flex flex-col items-center justify-center w-full h-full text-charcoal-light hover:text-primary">
          <Home className="h-5 w-5 mb-1" />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link to="/shop" className="flex flex-col items-center justify-center w-full h-full text-charcoal-light hover:text-primary">
          <ShoppingBag className="h-5 w-5 mb-1" />
          <span className="text-[10px]">Shop</span>
        </Link>
        <Link to="/wishlist" className="flex flex-col items-center justify-center w-full h-full text-charcoal-light hover:text-primary">
          <Heart className="h-5 w-5 mb-1" />
          <span className="text-[10px]">Wishlist</span>
        </Link>
        <Link to="/orders" className="flex flex-col items-center justify-center w-full h-full text-charcoal-light hover:text-primary">
          <FileText className="h-5 w-5 mb-1" />
          <span className="text-[10px]">Orders</span>
        </Link>
        <Link to="/account" className="flex flex-col items-center justify-center w-full h-full text-charcoal-light hover:text-primary">
          <User className="h-5 w-5 mb-1" />
          <span className="text-[10px]">Account</span>
        </Link>
      </div>
    </nav>
  );
}
