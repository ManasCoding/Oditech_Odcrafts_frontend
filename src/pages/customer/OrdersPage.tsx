import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, ArrowRight, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';

const TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'completed', label: 'Completed' },
  { id: 'canceled', label: 'Canceled' },
  { id: 'returned', label: 'Returned' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      try {
        const res = await api.get('/orders');
        setOrders(res.data?.data?.orders || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const status = order.status?.toUpperCase() || '';
      if (activeTab === 'completed') return status === 'DELIVERED' || status === 'COMPLETED';
      if (activeTab === 'canceled') return status === 'CANCELLED' || status === 'CANCELED';
      if (activeTab === 'returned') return status === 'RETURNED';
      return true; // 'all'
    });
  }, [orders, activeTab]);

  return (
    <>
      <Helmet>
        <title>My Orders — ODCRAFTS</title>
      </Helmet>

      <div className="min-h-screen bg-ivory py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-serif text-3xl font-bold text-charcoal mb-2">My Orders</h1>
          <p className="text-xs text-warm-gray mb-8">
            Track your handcrafted shipments and review previous craft acquisitions
          </p>

          <div className="flex items-center gap-6 border-b border-warm-gray/20 mb-6 overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap pb-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-warm-gray hover:text-charcoal hover:border-warm-gray/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-36 rounded-2xl bg-white border border-warm-gray/15 p-6" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-warm-gray/15 p-8 shadow-xs">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ivory text-primary mb-4">
                <Package className="h-8 w-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-charcoal">No orders yet</h2>
              <p className="text-sm text-warm-gray mt-2 max-w-sm mx-auto">
                Support Odisha’s master artisans by placing your first order of handmade crafts.
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-primary-light transition-all"
              >
                Browse Creations
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const totalItems = order.sellerOrders?.reduce(
                  (sum: number, so: any) => sum + (so.items?.length || 0),
                  0
                );

                return (
                  <div
                    key={order._id}
                    className="rounded-2xl bg-white p-6 border border-warm-gray/15 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-charcoal">
                          #{order.orderNumber}
                        </span>
                        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase bg-primary/10 text-primary">
                          {order.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-warm-gray mt-1 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-charcoal font-medium mt-2">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} · Total: ₹{order.grandTotal?.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-primary px-4 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
