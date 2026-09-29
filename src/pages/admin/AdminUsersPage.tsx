import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Shield,
  User as UserIcon,
  X,
  ShoppingBag,
  RotateCcw,
  XCircle,
  CheckCircle2,
  Loader2,
  Calendar,
  Mail,
  Phone,
} from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';

const roleBadge: Record<string, string> = {
  ADMIN: 'bg-primary/10 text-primary',
  SELLER: 'bg-accent/10 text-accent',
  CUSTOMER: 'bg-secondary/20 text-secondary-dark',
};

const statusColor: Record<string, string> = {
  DELIVERED: 'bg-accent/10 text-accent',
  CANCELLED: 'bg-error/10 text-error',
  RETURNED: 'bg-orange-100 text-orange-600',
  REFUNDED: 'bg-purple-100 text-purple-600',
  CONFIRMED: 'bg-blue-100 text-blue-600',
  SHIPPED: 'bg-cyan-100 text-cyan-600',
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
};

function Avatar({ user, size = 'md' }: { user: any; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'h-10 w-10 text-base' : size === 'lg' ? 'h-20 w-20 text-3xl' : 'h-12 w-12 text-xl';
  const iconSize = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-10 w-10' : 'h-6 w-6';

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`${sizeClass} rounded-full object-cover border-2 border-white shadow-sm`}
      />
    );
  }
  // Generate initials from name
  const initials = user.name
    ?.split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  const colors = ['bg-primary/80', 'bg-accent/80', 'bg-secondary-dark/80', 'bg-purple-500/80'];
  const colorIndex = user.name?.charCodeAt(0) % colors.length || 0;

  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold ${colors[colorIndex]} border-2 border-white shadow-sm`}>
      {initials}
    </div>
  );
}

function UserDetailModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [data, setData] = useState<{ user: any; orders: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/admin/users/${userId}`);
        setData(res.data?.data);
      } catch {
        toast.error('Failed to load user details');
        onClose();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userId]);

  const totalSpent = data?.orders.reduce((sum: number, o: any) => sum + (o.grandTotal || 0), 0) || 0;
  const returnedOrders = data?.orders.filter((o: any) => ['RETURNED', 'RETURN_REQUESTED', 'REFUNDED'].includes(o.status)) || [];
  const cancelledOrders = data?.orders.filter((o: any) => o.status === 'CANCELLED') || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-gray/15 shrink-0">
          <h2 className="font-serif text-lg font-bold text-charcoal">User Details</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-warm-gray hover:bg-ivory hover:text-charcoal transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data ? (
          <div className="flex-1 overflow-y-auto">
            {/* User profile section */}
            <div className="px-6 py-6 bg-ivory/40 border-b border-warm-gray/15">
              <div className="flex items-center gap-5">
                <Avatar user={data.user} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-xl font-bold text-charcoal">{data.user.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${roleBadge[data.user.role]}`}>
                      {data.user.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                      {data.user.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${data.user.isActive ? 'bg-accent/10 text-accent' : 'bg-error/10 text-error'}`}>
                      {data.user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <p className="text-sm text-charcoal-light flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-warm-gray shrink-0" />
                      {data.user.email}
                    </p>
                    {data.user.phone && (
                      <p className="text-sm text-charcoal-light flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-warm-gray shrink-0" />
                        {data.user.phone}
                      </p>
                    )}
                    <p className="text-xs text-charcoal-light flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-warm-gray shrink-0" />
                      Joined {new Date(data.user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-3 mt-5">
                {[
                  { label: 'Total Orders', value: data.orders.length, icon: ShoppingBag, color: 'text-primary' },
                  { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: CheckCircle2, color: 'text-accent' },
                  { label: 'Returns', value: returnedOrders.length, icon: RotateCcw, color: 'text-orange-500' },
                  { label: 'Cancelled', value: cancelledOrders.length, icon: XCircle, color: 'text-error' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-3 border border-warm-gray/15 text-center">
                    <stat.icon className={`h-4 w-4 mx-auto mb-1 ${stat.color}`} />
                    <p className="text-lg font-bold text-charcoal">{stat.value}</p>
                    <p className="text-[10px] text-warm-gray font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders list */}
            <div className="px-6 py-5">
              <h4 className="font-semibold text-sm text-charcoal mb-3">Order History</h4>
              {data.orders.length === 0 ? (
                <div className="text-center py-10 text-sm text-warm-gray border border-warm-gray/15 rounded-xl bg-ivory/30">
                  No orders yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.orders.map((order: any) => (
                    <div key={order._id} className="flex items-center justify-between p-4 rounded-xl border border-warm-gray/15 hover:bg-ivory/30 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-charcoal">{order.orderNumber}</p>
                        <p className="text-xs text-charcoal-light mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' · '}
                          {order.sellerOrders?.reduce((sum: number, so: any) => sum + so.items?.length, 0) || 0} item(s)
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <p className="text-sm font-bold text-primary">₹{order.grandTotal?.toLocaleString('en-IN')}</p>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${statusColor[order.status] || 'bg-warm-gray/10 text-charcoal'}`}>
                          {order.status?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data?.data?.users || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <Helmet>
        <title>User Management — ODCRAFTS Admin</title>
      </Helmet>

      {selectedUserId && (
        <UserDetailModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}

      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Platform Users</h1>
          <p className="text-xs text-warm-gray mt-1">
            Click on any user to view their details, orders, and activity.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-white border border-warm-gray/15" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-warm-gray/15">
            <p className="text-sm text-warm-gray">No users found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-warm-gray/15 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory/50 border-b border-warm-gray/15 text-[11px] text-charcoal font-bold uppercase tracking-wider">
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray/10">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    onClick={() => setSelectedUserId(user._id)}
                    className="hover:bg-ivory/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar user={user} size="sm" />
                        <div>
                          <p className="text-sm font-bold text-charcoal group-hover:text-primary transition-colors">
                            {user.name}
                          </p>
                          <p className="text-xs text-charcoal-light">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${roleBadge[user.role]}`}>
                        {user.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.isActive ? 'bg-accent/10 text-accent' : 'bg-error/10 text-error'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-charcoal-light">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
