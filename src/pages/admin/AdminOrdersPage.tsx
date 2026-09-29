import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { api } from '@/services/api';

const ORDER_STATUS_LIST = [
  'PENDING_PAYMENT',
  'CONFIRMED',
  'PROCESSING',
  'READY_FOR_SHIPMENT',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/orders/admin/all');
      setOrders(res.data?.data?.orders || []);
    } catch (err) {
      console.error('Failed to load orders for admin:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/admin/${orderId}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      loadOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <>
      <Helmet>
        <title>Master Orders — ODCRAFTS Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Master Marketplace Orders</h1>
          <p className="text-xs text-warm-gray mt-1">
            Track customer deliveries, update fulfillment milestones, and audit multi-seller split orders
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white border border-warm-gray/15" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-warm-gray/15">
            <p className="text-sm text-warm-gray">No customer orders on record yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-warm-gray/15 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-warm-gray/15 bg-ivory/50 text-warm-gray uppercase tracking-wider">
                    <th className="py-3 px-4">Order Number</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4">Advance Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-gray/10 text-charcoal">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-ivory/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold">#{order.orderNumber}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold">{order.userId?.name || 'Customer'}</p>
                        <p className="text-[11px] text-warm-gray">{order.userId?.email}</p>
                      </td>
                      <td className="py-3.5 px-4 text-warm-gray">
                        {order.addressSnapshot?.city}, {order.addressSnapshot?.state}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-charcoal">
                        ₹{order.grandTotal?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase bg-primary/10 text-primary">
                          {order.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className="rounded-lg border border-warm-gray/30 bg-white px-2 py-1 text-xs font-medium text-charcoal focus:border-primary focus:outline-none"
                        >
                          {ORDER_STATUS_LIST.map((st) => (
                            <option key={st} value={st}>
                              {st.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
