import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Users, Package, ShoppingCart, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      try {
        const res = await api.get('/admin/metrics');
        setMetrics(res.data?.data?.metrics);
        setRecentOrders(res.data?.data?.recentOrders || []);
      } catch (err) {
        console.error('Failed to load admin metrics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-warm-gray/15" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — ODCRAFTS</title>
      </Helmet>

      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">
            Platform Performance
          </h1>
          <p className="text-xs text-warm-gray mt-1">
            Real-time operations metrics across Odisha women artisan networks
          </p>
        </div>

        {/* Pending Moderation Alert */}
        {metrics?.pendingProducts > 0 && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200 text-amber-900 shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900">
                  {metrics.pendingProducts} Artisan Creation{metrics.pendingProducts > 1 ? 's' : ''} Awaiting Review
                </p>
                <p className="text-[11px] text-amber-800">
                  New craft items have been submitted and need administrative approval before appearing in the ODCRAFTS shop.
                </p>
              </div>
            </div>
            <Link
              to="/admin/products"
              className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-xs font-bold shadow-xs whitespace-nowrap text-center transition-all"
            >
              Review & Approve ({metrics.pendingProducts})
            </Link>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl bg-white p-5 border border-warm-gray/15 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Total Sales</p>
              <h3 className="font-serif text-2xl font-bold text-charcoal mt-1">
                ₹{metrics?.totalSales?.toLocaleString('en-IN') || 0}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          <Link
            to="/admin/artisans"
            className="rounded-2xl bg-white p-5 border border-warm-gray/15 shadow-xs flex items-center justify-between hover:border-primary/40 transition-colors"
          >
            <div>
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Active Artisans</p>
              <h3 className="font-serif text-2xl font-bold text-charcoal mt-1">
                {metrics?.totalSellers || 0}
              </h3>
              {metrics?.pendingSellers > 0 && (
                <span className="text-[10px] text-primary font-bold">
                  +{metrics.pendingSellers} pending review
                </span>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Users className="h-6 w-6" />
            </div>
          </Link>

          <Link
            to="/admin/products"
            className="rounded-2xl bg-white p-5 border border-warm-gray/15 shadow-xs flex items-center justify-between hover:border-amber-500/40 transition-colors"
          >
            <div>
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Craft Catalog</p>
              <h3 className="font-serif text-2xl font-bold text-charcoal mt-1">
                {metrics?.totalProducts || 0}
              </h3>
              {metrics?.pendingProducts > 0 && (
                <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full font-bold inline-block mt-1">
                  +{metrics.pendingProducts} pending review
                </span>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Package className="h-6 w-6" />
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="rounded-2xl bg-white p-5 border border-warm-gray/15 shadow-xs flex items-center justify-between hover:border-charcoal/40 transition-colors"
          >
            <div>
              <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Total Orders</p>
              <h3 className="font-serif text-2xl font-bold text-charcoal mt-1">
                {metrics?.totalOrders || 0}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-charcoal/10 text-charcoal">
              <ShoppingCart className="h-6 w-6" />
            </div>
          </Link>
        </div>

        {/* Recent Master Orders */}
        <div className="rounded-2xl bg-white p-6 border border-warm-gray/15 shadow-xs">
          <h2 className="font-serif text-lg font-bold text-charcoal mb-4">Recent Marketplace Orders</h2>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-warm-gray py-4 text-center">No transactions recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-warm-gray/15 text-warm-gray uppercase tracking-wider">
                    <th className="py-3 px-2">Order #</th>
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Total</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-gray/10 text-charcoal">
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-ivory/50">
                      <td className="py-3 px-2 font-mono font-bold">#{ord.orderNumber}</td>
                      <td className="py-3 px-2 font-medium">{ord.userId?.name || 'Customer'}</td>
                      <td className="py-3 px-2 text-warm-gray">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-2 font-bold">₹{ord.grandTotal?.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-2">
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase bg-primary/10 text-primary">
                          {ord.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
