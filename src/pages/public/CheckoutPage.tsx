import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { ShieldCheck, Truck, CheckCircle2, ArrowRight, Loader2, MapPin, Banknote } from 'lucide-react';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  line1: z.string().min(5, 'Address line is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  district: z.string().optional(),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit Indian PIN code'),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, fetchCart, clearCart } = useCartStore();

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const activeItems = items.filter((i) => !i.savedForLater);
  const subtotal = activeItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shippingCharge = activeItems.length > 0 ? 50 : 0;
  const grandTotal = subtotal + shippingCharge;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: user?.name || '',
      phone: user?.phone || '',
      state: 'Odisha',
    },
  });

  useEffect(() => {
    fetchCart();
    async function loadAddresses() {
      try {
        const res = await api.get('/users/profile'); // or address list endpoint
        // If no dedicated address endpoint, we allow immediate creation
      } catch {
        setIsCreatingNew(true);
      }
    }
    loadAddresses();
  }, [fetchCart]);

  const handlePlaceOrder = async (addressData?: AddressFormData) => {
    if (activeItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setIsPlacingOrder(true);

      // Create address first if new
      let addressId = selectedAddressId;
      if (addressData || isCreatingNew || !addressId) {
        // Direct order creation via embedded address or address module
        // We'll pass the addressId or create address on the fly
        const addrRes = await api.post('/users/addresses', addressData);
        addressId = addrRes.data?.data?.address?._id;
      }

      const orderRes = await api.post('/orders', {
        addressId,
        paymentMethod: 'CASH_ON_DELIVERY',
      });

      const order = orderRes.data?.data?.order;
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/orders/${order._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout — ODCRAFTS</title>
      </Helmet>

      <div className="min-h-screen bg-ivory py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">Secure Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Address & Delivery Details */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-2xl bg-white p-6 sm:p-8 border border-warm-gray/15 shadow-xs">
                <div className="flex items-center gap-2 pb-4 border-b border-warm-gray/10 mb-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-lg font-bold text-charcoal">Delivery Address</h2>
                </div>

                <form id="checkout-form" onSubmit={handleSubmit(handlePlaceOrder)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Recipient Full Name
                      </label>
                      <input
                        {...register('fullName')}
                        type="text"
                        placeholder="Full name"
                        className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
                      />
                      {errors.fullName && <p className="mt-1 text-xs text-error">{errors.fullName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Contact Phone (10 digits)
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        placeholder="9861012345"
                        className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
                      />
                      {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      Street Address / House No.
                    </label>
                    <input
                      {...register('line1')}
                      type="text"
                      placeholder="e.g. Plot 102, Heritage Colony"
                      className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
                    />
                    {errors.line1 && <p className="mt-1 text-xs text-error">{errors.line1.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">City / Village</label>
                      <input
                        {...register('city')}
                        type="text"
                        placeholder="e.g. Bhubaneswar"
                        className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
                      />
                      {errors.city && <p className="mt-1 text-xs text-error">{errors.city.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">State</label>
                      <input
                        {...register('state')}
                        type="text"
                        defaultValue="Odisha"
                        className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">PIN Code</label>
                      <input
                        {...register('pincode')}
                        type="text"
                        placeholder="751001"
                        className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
                      />
                      {errors.pincode && <p className="mt-1 text-xs text-error">{errors.pincode.message}</p>}
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Method Notice: Cash on Delivery Only */}
              <div className="rounded-2xl bg-white p-6 border border-warm-gray/15 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-warm-gray/10 mb-4">
                  <Banknote className="h-5 w-5 text-emerald-700" />
                  <h3 className="font-serif text-base font-bold text-charcoal">Payment Mode</h3>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-emerald-600/30 bg-emerald-50/40">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="COD"
                    checked
                    readOnly
                    className="mt-1 h-4 w-4 text-emerald-700 focus:ring-emerald-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
                        Cash on Delivery (COD)
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        Active Mode
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-charcoal-light leading-relaxed">
                      Pay with Cash or UPI upon doorstep arrival. Inspect your authentic handcrafted Odia masterpiece before completing payment.
                    </p>
                    <p className="mt-2 text-[11px] text-warm-gray flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                      100% genuine artisan provenance guaranteed by ODCRAFTS.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl bg-white p-6 border border-warm-gray/15 shadow-xs space-y-4">
                <h3 className="font-serif text-base font-bold text-charcoal pb-3 border-b border-warm-gray/10">
                  Items in Order ({activeItems.length})
                </h3>

                <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                  {activeItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-10 w-10 rounded-md object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-semibold text-charcoal">{item.productName}</p>
                        <p className="text-warm-gray">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-charcoal shrink-0">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-3 border-t border-warm-gray/10 text-xs text-charcoal-light">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-charcoal">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold text-charcoal">₹{shippingCharge}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-primary pt-2 border-t border-warm-gray/10">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isPlacingOrder || activeItems.length === 0}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 text-xs font-bold text-white shadow-md hover:bg-primary-light transition-all disabled:opacity-50"
                >
                  {isPlacingOrder ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
