
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Trash2, Key, UserPlus } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

export default function AdminAccessControl() {
  const { user } = useAuthStore();
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/admins');
      setAdmins(res.data?.data?.admins || []);
    } catch {
      toast.error('Failed to load admins');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/admins', newAdmin);
      toast.success('Admin created successfully');
      setNewAdmin({ name: '', email: '', password: '' });
      loadAdmins();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke admin access?')) return;
    try {
      await api.delete("/admin/admins/" + id);
      toast.success('Admin access revoked');
      loadAdmins();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to revoke access');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/admin/change-password', passwords);
      toast.success('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Access Control - ODCRAFTS</title>
      </Helmet>

      <div className='max-w-5xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex items-center gap-3 bg-white p-6 rounded-2xl border border-warm-gray/15 shadow-sm'>
          <div className='p-3 bg-charcoal rounded-xl'>
            <Shield className='h-6 w-6 text-white' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-charcoal tracking-tight uppercase font-sans'>Administrator Access Control</h1>
            <p className='text-sm text-warm-gray'>Manage users with full administrative privileges.</p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column */}
          <div className='space-y-6 lg:col-span-1'>
            {/* Add New Admin */}
            <div className='bg-white rounded-3xl p-6 border border-warm-gray/15 shadow-sm'>
              <div className='flex items-center gap-2 mb-6'>
                <UserPlus className='h-5 w-5 text-charcoal' />
                <h2 className='text-lg font-bold text-charcoal'>Add New Admin</h2>
              </div>
              <form onSubmit={handleCreateAdmin} className='space-y-4'>
                <div>
                  <label className='block text-[10px] font-bold text-warm-gray uppercase tracking-wider mb-1'>Email Address</label>
                  <input
                    type='email'
                    required
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className='w-full px-4 py-2.5 bg-ivory/50 border border-warm-gray/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary'
                    placeholder='admin@company.com'
                  />
                </div>
                <div>
                  <label className='block text-[10px] font-bold text-warm-gray uppercase tracking-wider mb-1'>Full Name</label>
                  <input
                    type='text'
                    required
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    className='w-full px-4 py-2.5 bg-ivory/50 border border-warm-gray/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary'
                    placeholder='Admin Name'
                  />
                </div>
                <div>
                  <label className='block text-[10px] font-bold text-warm-gray uppercase tracking-wider mb-1'>Temporary Password</label>
                  <input
                    type='password'
                    required
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className='w-full px-4 py-2.5 bg-ivory/50 border border-warm-gray/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary'
                    placeholder='••••••••'
                  />
                </div>
                <button type='submit' className='w-full py-3 bg-charcoal text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-charcoal/90 transition-colors mt-2'>
                  Grant Admin Access
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className='bg-white rounded-3xl p-6 border border-warm-gray/15 shadow-sm'>
              <div className='flex items-center gap-2 mb-6'>
                <Key className='h-5 w-5 text-charcoal' />
                <h2 className='text-lg font-bold text-charcoal'>Change Password</h2>
              </div>
              <form onSubmit={handleChangePassword} className='space-y-4'>
                <div>
                  <label className='block text-[10px] font-bold text-warm-gray uppercase tracking-wider mb-1'>Current Password</label>
                  <input
                    type='password'
                    required
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className='w-full px-4 py-2.5 bg-ivory/50 border border-warm-gray/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary'
                    placeholder='••••••••'
                  />
                </div>
                <div>
                  <label className='block text-[10px] font-bold text-warm-gray uppercase tracking-wider mb-1'>New Password</label>
                  <input
                    type='password'
                    required
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className='w-full px-4 py-2.5 bg-ivory/50 border border-warm-gray/20 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary'
                    placeholder='••••••••'
                  />
                </div>
                <button type='submit' className='w-full py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors mt-2'>
                  Update Password
                </button>
              </form>
            </div>
          </div>

          {/* Right Column */}
          <div className='lg:col-span-2 bg-white rounded-3xl border border-warm-gray/15 shadow-sm overflow-hidden flex flex-col'>
            <div className='p-6 border-b border-warm-gray/10 flex items-center justify-between'>
              <h2 className='text-sm font-bold text-charcoal uppercase tracking-wider'>Active Administrators</h2>
              <span className='px-3 py-1 bg-ivory text-charcoal text-[10px] font-bold rounded-full border border-warm-gray/10'>{admins.length} ACCOUNTS</span>
            </div>
            
            <div className='flex-1 p-6 space-y-4'>
              {isLoading ? (
                <div className='animate-pulse space-y-4'>
                   {[1,2,3].map(i => <div key={i} className='h-16 bg-warm-gray/10 rounded-2xl'></div>)}
                </div>
              ) : (
                admins.map((admin) => {
                  const isYou = user?.id === admin._id;
                  const initial = admin.name?.charAt(0).toUpperCase() || '?';
                  return (
                    <div key={admin._id} className='flex items-center justify-between p-4 bg-white border border-warm-gray/10 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.02)]'>
                      <div className='flex items-center gap-4'>
                        <div className='h-10 w-10 rounded-full bg-ivory text-charcoal flex items-center justify-center font-bold text-sm border border-warm-gray/15 shrink-0 overflow-hidden'>
                          {admin.avatar ? (
                            <img src={admin.avatar} alt={admin.name} className='h-full w-full object-cover' />
                          ) : (
                            initial
                          )}
                        </div>
                        <div>
                          <div className='flex items-center gap-2'>
                            <p className='text-sm font-bold text-charcoal'>{admin.name}</p>
                            {isYou && (
                              <span className='px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold uppercase rounded-md'>YOU</span>
                            )}
                          </div>
                          <p className='text-xs text-warm-gray'>{admin.email}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-6'>
                        <div className='text-right hidden sm:block'>
                          <p className='text-[9px] font-bold text-warm-gray/60 uppercase tracking-wider'>Last Activity</p>
                          <p className='text-xs font-semibold text-charcoal-light'>
                            {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString('en-GB') : new Date(admin.createdAt).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                        {!isYou && (
                          <button onClick={() => handleDeleteAdmin(admin._id)} className='text-warm-gray hover:text-error transition-colors p-2' title='Revoke Access'>
                            <Trash2 className='h-4 w-4' />
                          </button>
                        )}
                        {isYou && (
                           <div className='w-8' /> /* spacing filler */
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

