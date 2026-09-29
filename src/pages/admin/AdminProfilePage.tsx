import { useState, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { User, Mail, Shield, Camera, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';

export default function AdminProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  if (!user) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const data = new FormData();
      data.append('image', file);

      const uploadRes = await api.post('/upload/image', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = uploadRes.data?.data?.url || uploadRes.data?.data?.files?.[0]?.url;

      if (!imageUrl) throw new Error('Failed to get image URL');

      await api.patch('/users/me', { avatar: imageUrl });
      setUser({ ...user, avatar: imageUrl });
      toast.success('Profile picture updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updateRes = await api.patch('/users/me', formData);
      setUser({ ...user, ...formData });
      toast.success('Profile details updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary">Admin Profile</h2>
          <p className="text-sm text-charcoal-light mt-1">
            Manage your administrative account details
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-gray/15">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-warm-gray/15">
          
          {/* Avatar Section */}
          <div className="relative group">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary overflow-hidden border-2 border-primary/20">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10" />
              )}
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100 disabled:bg-black/40"
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <Camera className="h-6 w-6" />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-charcoal">{user.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
                <Shield className="h-3 w-3" />
                Administrator
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-gray">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-warm-gray/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white text-sm text-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-gray">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-warm-gray/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white text-sm text-charcoal"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving || (formData.name === user.name && formData.email === user.email)}
              className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
