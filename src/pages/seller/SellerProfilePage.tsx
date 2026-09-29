import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Camera, Loader2, User } from 'lucide-react';
import { api } from '@/services/api';

export default function SellerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [craftType, setCraftType] = useState('');
  const [district, setDistrict] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [artisanStory, setArtisanStory] = useState('');
  const [photo, setPhoto] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get('/seller/profile');
        const p = res.data?.data?.profile;
        if (p) {
          setProfile(p);
          setCraftType(p.craftType || '');
          setDistrict(p.district || '');
          setYearsOfExperience(p.yearsOfExperience || 0);
          setArtisanStory(p.artisanStory || '');
          setPhoto(p.photo || '');
        }
      } catch (err) {
        console.error('Error loading seller profile:', err);
      }
    }
    loadProfile();
  }, []);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': undefined },
      });

      const url = res.data?.data?.url;
      if (url) {
        setPhoto(url);
        toast.success('Photo uploaded successfully!');
      }
    } catch {
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await api.patch('/seller/profile', {
        craftType,
        district,
        yearsOfExperience: Number(yearsOfExperience),
        artisanStory,
        photo,
      });
      setProfile(res.data?.data?.profile);
      toast.success('Artisan profile updated!');
    } catch {
      toast.error('Failed to update artisan profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Artisan Profile & Bio — ODCRAFTS</title>
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Artisan Profile & Bio</h1>
          <p className="text-xs text-warm-gray mt-1">
            Share your craft background, district, and personal story with conscious patrons worldwide
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 rounded-2xl bg-white p-6 md:p-8 border border-warm-gray/15 shadow-xs">
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {/* Avatar preview */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-warm-gray/20 bg-sand flex items-center justify-center">
                {photo ? (
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-warm-gray/50" />
                )}
              </div>

              {/* Upload button overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary-light transition-colors disabled:opacity-60"
                title="Upload profile photo"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs font-semibold text-charcoal">Profile Photo</p>
              <p className="text-xs text-warm-gray">JPG, PNG or WEBP · Max 5MB</p>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Primary Craft</label>
              <input
                type="text"
                value={craftType}
                onChange={(e) => setCraftType(e.target.value)}
                placeholder="e.g. Sambalpuri Ikat Weaving"
                className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Odisha District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Bargarh"
                className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Years of Craft Experience</label>
            <input
              type="number"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(Number(e.target.value))}
              className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Your Personal Story & Heritage</label>
            <textarea
              rows={5}
              value={artisanStory}
              onChange={(e) => setArtisanStory(e.target.value)}
              placeholder="Tell patrons about how you learned your craft, your family traditions, and what creating means to you..."
              className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-primary-light transition-all disabled:opacity-60"
          >
            {isSaving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </>
  );
}
