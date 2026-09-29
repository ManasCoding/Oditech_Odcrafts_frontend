import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

export default function CustomerLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={`flex-1 ${isHomePage ? 'pt-0' : 'pt-16'}`}>
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
