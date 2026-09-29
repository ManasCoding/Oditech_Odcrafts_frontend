import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, AlertCircle, MapPin, Award } from 'lucide-react';
import { api } from '@/services/api';

export default function AdminArtisansPage() {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadArtisans = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/sellers');
      setArtisans(res.data?.data?.sellers || []);
    } catch (err) {
      console.error('Failed to load artisans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArtisans();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/sellers/${id}/status`, { status });
      toast.success(`Artisan marked as ${status}`);
      loadArtisans();
    } catch {
      toast.error('Failed to update artisan status');
    }
  };

  return (
    <>
      <Helmet>
        <title>Artisan Approvals — ODCRAFTS Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Artisan Partner Approvals</h1>
          <p className="text-xs text-warm-gray mt-1">
            Review registration submissions, verify craft authenticity, and manage artisan platform permissions
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white border border-warm-gray/15" />
            ))}
          </div>
        ) : artisans.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-warm-gray/15">
            <p className="text-sm text-warm-gray">No artisan partner applications on record.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {artisans.map((artisan) => {
              const user = artisan.userId;
              const isApproved = artisan.status === 'APPROVED';

              return (
                <div
                  key={artisan._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-6 border border-warm-gray/15 shadow-xs"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        artisan.photo ||
                        user?.avatar ||
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={user?.name}
                      className="h-14 w-14 rounded-full object-cover border border-warm-gray/20 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-bold text-charcoal">{user?.name}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            isApproved
                              ? 'bg-accent/10 text-accent'
                              : artisan.status === 'PENDING'
                              ? 'bg-secondary/20 text-secondary-dark'
                              : 'bg-error/10 text-error'
                          }`}
                        >
                          {artisan.status}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-light flex items-center gap-2">
                        <span className="font-medium text-primary">{artisan.craftType || 'Artisan'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {artisan.district || 'Odisha'}
                        </span>
                        <span>•</span>
                        <span>{user?.email}</span>
                      </p>
                      {artisan.artisanStory && (
                        <p className="text-xs text-warm-gray italic max-w-xl line-clamp-1">
                          "{artisan.artisanStory}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isApproved && (
                      <button
                        onClick={() => handleUpdateStatus(artisan._id, 'APPROVED')}
                        className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-bold text-white hover:bg-accent-dark transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    {isApproved && (
                      <button
                        onClick={() => handleUpdateStatus(artisan._id, 'SUSPENDED')}
                        className="flex items-center gap-1.5 rounded-lg border border-error/30 px-3.5 py-2 text-xs font-bold text-error hover:bg-error/10 transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Suspend</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
