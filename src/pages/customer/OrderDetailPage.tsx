import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  Truck,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { api } from '@/services/api';

const ORDER_STEPS = [
  { status: 'PENDING_PAYMENT', label: 'Order Placed', desc: 'Order received and awaiting processing' },
  { status: 'CONFIRMED', label: 'Confirmed by Artisan', desc: 'Craftswoman verified and preparing materials' },
  { status: 'PROCESSING', label: 'In Weaving / Crafting', desc: 'Handcrafted production or packing underway' },
  { status: 'SHIPPED', label: 'Dispatched from Village', desc: 'Handed to postal/courier logistics partner' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Courier agent delivering to your doorstep' },
  { status: 'DELIVERED', label: 'Delivered', desc: 'Cherished craft delivered to conscious home' },
];

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      setIsLoading(true);
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data?.data?.order);
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl animate-pulse space-y-6">
        <div className="h-8 w-1/3 bg-warm-gray/20 rounded" />
        <div className="h-64 bg-white rounded-2xl border border-warm-gray/15" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-3xl font-bold text-primary">Order Not Found</h2>
        <Link to="/orders" className="mt-4 text-xs font-semibold text-primary underline">
          View My Orders
        </Link>
      </div>
    );
  }

  const currentStepIdx = ORDER_STEPS.findIndex((s) => s.status === order.status);
  const activeStepIdx = currentStepIdx === -1 ? 0 : currentStepIdx;

  return (
    <>
      <Helmet>
        <title>{`Order #${order.orderNumber} Tracking — ODCRAFTS`}</title>
      </Helmet>

      <div className="min-h-screen bg-ivory py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-warm-gray hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to orders
          </Link>

          {/* Header Card */}
          <div className="rounded-2xl bg-white p-6 md:p-8 border border-warm-gray/15 shadow-xs mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-warm-gray/10">
              <div>
                <span className="text-xs font-bold text-secondary-dark uppercase tracking-wider">
                  Order Status
                </span>
                <h1 className=" text-xs md:text-sm font-bold text-charcoal">
                  #{order.orderNumber}
                </h1>
                <p className="text-xs text-warm-gray mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} · Total: ₹{order.grandTotal?.toLocaleString('en-IN')}
                </p>
              </div>

              <span className="rounded-full px-4 py-1 text-xs font-bold uppercase bg-primary text-white shadow-xs">
                {order.status?.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Vertical Order Progress Tracker */}
            <div className="mt-8">
              <h2 className="font-serif text-lg font-bold text-charcoal mb-6">Delivery Progress</h2>
              <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-warm-gray/20">
                { ORDER_STEPS.map((step, idx) => {
                  const isCompleted = idx <= activeStepIdx;
                  const isCurrent = idx === activeStepIdx;

                  return (
                    <div key={step.status} className="relative flex items-start gap-4">
                      {/* Timeline Node */}
                      <span
                        className={`absolute -left-6 flex h-6 w-6 items-center justify-center rounded-full text-white ring-4 ring-white ${
                          isCompleted ? 'bg-primary' : 'bg-warm-gray/30 text-warm-gray'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <Circle className="h-2 w-2" />
                        )}
                      </span>

                      <div className='ml-2'>
                        <h3
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-primary'
                              : isCompleted
                              ? 'text-charcoal'
                              : 'text-warm-gray'
                          }`}
                        >
                          {step.label}
                        </h3>
                        <p className="text-xs text-warm-gray mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Delivery Address Snapshot */}
            <div className="rounded-2xl bg-white p-6 border border-warm-gray/15 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-warm-gray/10 mb-4">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="font-serif text-base font-bold text-charcoal">Delivery Address</h3>
              </div>
              <div className="text-xs text-charcoal-light space-y-1">
                <p className="font-semibold text-charcoal">{order.addressSnapshot?.fullName}</p>
                <p>{order.addressSnapshot?.line1}</p>
                {order.addressSnapshot?.line2 && <p>{order.addressSnapshot?.line2}</p>}
                <p>
                  {order.addressSnapshot?.city}, {order.addressSnapshot?.state} - {order.addressSnapshot?.pincode}
                </p>
                <p className="pt-2 text-warm-gray">Phone: {order.addressSnapshot?.phone}</p>
              </div>
            </div>

            {/* Items Purchased */}
            <div className="rounded-2xl bg-white p-6 border border-warm-gray/15 shadow-xs">
              <h3 className="font-serif text-base font-bold text-charcoal pb-3 border-b border-warm-gray/10 mb-4">
                Ordered Creations
              </h3>
              <div className="space-y-4">
                {order.sellerOrders?.map((so: any) =>
                  so.items?.map((item: any) => (
                    <div key={item._id} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-12 w-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.productSlug}`}
                          className="font-semibold text-charcoal hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.productName}
                        </Link>
                        <p className="text-warm-gray">
                          Qty: {item.quantity} · ₹{item.unitPrice?.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span className="font-bold text-charcoal shrink-0">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
