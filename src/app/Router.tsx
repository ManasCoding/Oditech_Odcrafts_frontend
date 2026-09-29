import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Public pages
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const ShopPage = lazy(() => import('@/pages/public/ShopPage'));
const ShopCategoryPage = lazy(() => import('@/pages/public/CollectionPage'));
const ProductPage = lazy(() => import('@/pages/public/ProductPage'));
const ArtisansPage = lazy(() => import('@/pages/public/ArtisansPage'));
const ArtisanPage = lazy(() => import('@/pages/public/ArtisanPage'));
const StoriesPage = lazy(() => import('@/pages/public/StoriesPage'));
const StoryPage = lazy(() => import('@/pages/public/StoryPage'));
const CartPage = lazy(() => import('@/pages/public/CartPage'));
const WishlistPage = lazy(() => import('@/pages/public/WishlistPage'));
const CheckoutPage = lazy(() => import('@/pages/public/CheckoutPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'));

// Static info pages
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const CareersPage = lazy(() => import('@/pages/public/CareersPage'));
const PressPage = lazy(() => import('@/pages/public/PressPage'));
const FAQPage = lazy(() => import('@/pages/public/FAQPage'));
const SupportPage = lazy(() => import('@/pages/public/SupportPage'));
const ShippingPolicyPage = lazy(() => import('@/pages/public/ShippingPolicyPage'));
const ReturnExchangePage = lazy(() => import('@/pages/public/ReturnExchangePage'));
const TrackOrderPage = lazy(() => import('@/pages/public/TrackOrderPage'));
const TermsPage = lazy(() => import('@/pages/public/TermsPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/public/PrivacyPolicyPage'));

// Customer account pages
const OrdersPage = lazy(() => import('@/pages/customer/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/customer/OrderDetailPage'));
const AccountPage = lazy(() => import('@/pages/customer/AccountPage'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminArtisansPage = lazy(() => import('@/pages/admin/AdminArtisansPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminProfilePage = lazy(() => import('@/pages/admin/AdminProfilePage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminAccessControlPage = lazy(() => import('@/pages/admin/AdminAccessControl'));

// Seller pages
const SellerDashboard = lazy(() => import('@/pages/seller/SellerDashboard'));
const SellerProductsPage = lazy(() => import('@/pages/seller/SellerProductsPage'));
const SellerProductCreatePage = lazy(() => import('@/pages/seller/SellerProductCreatePage'));
const SellerProfilePage = lazy(() => import('@/pages/seller/SellerProfilePage'));
const SellerEarningsPage = lazy(() => import('@/pages/seller/SellerEarningsPage'));

// Layouts
const CustomerLayout = lazy(() => import('@/components/layout/CustomerLayout'));
const SellerLayout = lazy(() => import('@/components/layout/SellerLayout'));
const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'));

export function Router() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-ivory font-serif text-primary text-xl animate-pulse">
          Loading ODCRAFTS...
        </div>
      }
    >
      <Routes>
        {/* Public Storefront Routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />

          {/* Shop */}
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:category" element={<ShopCategoryPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />

          {/* Artisans & Stories */}
          <Route path="/artisans" element={<ArtisansPage />} />
          <Route path="/artisan/:slug" element={<ArtisanPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/:slug" element={<StoryPage />} />

          {/* Cart & Auth */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Static info pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="/return-exchange" element={<ReturnExchangePage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

          {/* Customer Auth-Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Artisan Workspace Routes */}
        <Route element={<ProtectedRoute allowedRoles={['SELLER', 'ADMIN']} />}>
          <Route path="/seller" element={<SellerLayout />}>
            <Route index element={<SellerDashboard />} />
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="products" element={<SellerProductsPage />} />
            <Route path="products/new" element={<SellerProductCreatePage />} />
            <Route path="profile" element={<SellerProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="earnings" element={<SellerEarningsPage />} />
            <Route path="wallet" element={<SellerEarningsPage />} />
          </Route>
        </Route>

        {/* Admin Portal Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="artisans" element={<AdminArtisansPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="access" element={<AdminAccessControlPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
