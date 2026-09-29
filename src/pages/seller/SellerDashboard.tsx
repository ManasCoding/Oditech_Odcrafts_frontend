import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, ShoppingBag, CreditCard, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { api } from '@/services/api';

export default function SellerDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSellerData() {
      setIsLoading(true);
      try {
        const [profRes, prodRes, ordRes, earnRes] = await Promise.all([
          api.get('/seller/profile'),
          api.get('/seller/products'),
          api.get('/seller/orders'),
          api.get('/seller/earnings'),
        ]);

        setProfile(profRes.data?.data?.profile);
        setProducts(prodRes.data?.data?.products || []);
        setOrders(ordRes.data?.data?.orders || []);
        setWallet(earnRes.data?.data?.wallet);
      } catch (err) {
        console.error('Failed to load artisan workspace data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSellerData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-warm-gray/15" />
          ))}
        </div>
      </div>
    );
  }

  const isApproved = profile?.status === 'APPROVED';

  return (
    <>
      <Helmet>
        <title>Artisan Dashboard — ODCRAFTS</title>
      </Helmet>

      <div className="space-y-8">
        {/* Welcome & Approval Banner */}
        <div className="rounded-2xl bg-white p-6 border border-warm-gray/15 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-charcoal">
                Namaste, {profile?.userId?.name || 'Artisan Partner'}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  isApproved
                    ? 'bg-accent/10 text-accent'
                    : 'bg-secondary/20 text-secondary-dark'
                }`}
              >
                {profile?.status || 'PENDING'}
              </span>
            </div>
            <p className="text-xs text-warm-gray mt-1">
              Craft Type: <strong className="text-charcoal">{profile?.craftType || 'Not specified'}</strong> · District: {profile?.district || 'Odisha'}
            </p>
          </div>

          <Link
            to="/seller/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-light transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Creation</span>
          </Link>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white p-5 border border-warm-gray/15 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Total Earnings</p>
              <h3 className="font-serif text-2xl font-bold text-charcoal mt-1">
                ₹{wallet?.totalEarned?.toLocaleString('en-IN') || 0}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-warm-gray/15 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Listed Crafts</p>
              <h3 className="font-serif text-2xl font-bold text-charcoal mt-1">
                {products.length}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Package className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-warm-gray/15 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Orders Received</p>
              <h3 className="font-serif text-2xl font-bold text-charcoal mt-1">
                {orders.length}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 text-secondary-dark">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Recent Orders for this Artisan */}
        <div className="rounded-2xl bg-white p-6 border border-warm-gray/15 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-bold text-charcoal">Customer Orders for Your Crafts</h2>
            <Link to="/seller/orders" className="text-xs font-semibold text-primary hover:underline">
              View All Orders
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-warm-gray py-6 text-center">
              No orders received yet. When conscious patrons buy your creations, they will appear here.
            </p>
          ) : (
            <div className="divide-y divide-warm-gray/10 text-xs">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord.orderId} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-charcoal">#{ord.orderNumber}</span>
                    <p className="text-warm-gray mt-0.5">
                      {new Date(ord.createdAt).toLocaleDateString()} · Deliver to {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                    </p>
                  </div>
                  <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase bg-primary/10 text-primary">
                    {ord.subOrder?.status?.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
