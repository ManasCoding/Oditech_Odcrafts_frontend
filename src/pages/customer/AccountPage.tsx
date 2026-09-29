import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

export default function AccountPage() {
  const { user, setUser } = useAuthStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: ''
  });

  useEffect(() => {
    async function loadAddresses() {
      try {
        const res = await api.get('/users/addresses');
        setAddresses(res.data?.data?.addresses || []);
      } catch {
        // ignore
      }
    }
    loadAddresses();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await api.patch('/users/me', { name, phone });
      setUser({ ...user!, name, phone });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingAddress(true);
      const res = await api.post('/users/addresses', newAddress);
      setAddresses([res.data.data.address, ...addresses]);
      setIsAddingAddress(false);
      setNewAddress({ fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
      toast.success('Address added successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Account Settings — ODCRAFTS</title>
      </Helmet>

      <div className="min-h-screen bg-ivory py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal">Account Settings</h1>
            <p className="text-xs text-warm-gray mt-1">Manage your profile details and shipping destinations</p>
          </div>

          {/* Profile Form */}
          <div className="rounded-2xl bg-white p-6 md:p-8 border border-warm-gray/15 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-charcoal pb-4 border-b border-warm-gray/10 mb-6">
              Personal Information
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-2.5 h-4 w-4 text-warm-gray" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-warm-gray/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-warm-gray" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-warm-gray/20 bg-warm-gray/10 text-warm-gray"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Mobile Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-warm-gray" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9861012345"
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-warm-gray/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-light transition-colors shadow-xs"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Saved Addresses */}
          <div className="rounded-2xl bg-white p-6 md:p-8 border border-warm-gray/15 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-warm-gray/10 mb-6">
              <h2 className="font-serif text-lg font-bold text-charcoal">Saved Delivery Addresses</h2>
              {!isAddingAddress && (
                <button 
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="rounded-lg border border-primary px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors shadow-xs"
                >
                  + Add Address
                </button>
              )}
            </div>

            {isAddingAddress ? (
              <form onSubmit={handleSaveAddress} className="space-y-4 mb-6 bg-ivory p-5 rounded-xl border border-warm-gray/10">
                <h3 className="font-serif text-sm font-bold text-charcoal mb-3">Add New Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Full Name</label>
                    <input required type="text" value={newAddress.fullName} onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-warm-gray/30 focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Phone Number</label>
                    <input required type="tel" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-warm-gray/30 focus:outline-none focus:border-primary" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-charcoal mb-1">Address Line 1</label>
                    <input required type="text" value={newAddress.line1} onChange={(e) => setNewAddress({...newAddress, line1: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-warm-gray/30 focus:outline-none focus:border-primary" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-charcoal mb-1">Address Line 2 (Optional)</label>
                    <input type="text" value={newAddress.line2} onChange={(e) => setNewAddress({...newAddress, line2: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-warm-gray/30 focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">City</label>
                    <input required type="text" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-warm-gray/30 focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">State</label>
                    <input required type="text" value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-warm-gray/30 focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Pincode</label>
                    <input required type="text" value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-warm-gray/30 focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-warm-gray/10 mt-4">
                  <button type="button" onClick={() => setIsAddingAddress(false)} className="px-4 py-2 text-xs font-bold text-warm-gray hover:text-charcoal transition-colors">Cancel</button>
                  <button type="submit" disabled={isSavingAddress} className="rounded-lg bg-primary px-6 py-2 text-xs font-bold text-white hover:bg-primary-light transition-colors shadow-xs">
                    {isSavingAddress ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            ) : null}

            {!isAddingAddress && addresses.length === 0 ? (
              <p className="text-xs text-warm-gray">No addresses saved yet. Addresses are saved when you checkout.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr._id} className="rounded-xl border border-warm-gray/20 p-4 text-xs space-y-1 bg-white">
                    <p className="font-bold text-charcoal">{addr.fullName}</p>
                    <p className="text-charcoal-light">{addr.line1}</p>
                    <p className="text-charcoal-light">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-warm-gray pt-1">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
