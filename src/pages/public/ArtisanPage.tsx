import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Award, Star, CheckCircle2, Sparkles, Heart } from 'lucide-react';
import { api } from '@/services/api';
import { ProductCard } from '@/components/product/ProductCard';

export default function ArtisanPage() {
  const { slug } = useParams<{ slug: string }>();
  const [artisan, setArtisan] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadArtisan() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const res = await api.get(`/artisans/${slug}`);
        setArtisan(res.data?.data?.artisan);
        setProducts(res.data?.data?.products || []);
      } catch (err) {
        console.error('Failed to load artisan profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadArtisan();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8 animate-pulse">
          <div className="h-64 w-64 rounded-2xl bg-warm-gray/15" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-1/3 bg-warm-gray/20 rounded" />
            <div className="h-4 w-1/4 bg-warm-gray/15 rounded" />
            <div className="h-20 w-full bg-warm-gray/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-3xl font-bold text-primary">Artisan Profile Not Found</h2>
        <Link to="/artisans" className="mt-4 text-xs font-semibold text-primary underline">
          View All Artisans
        </Link>
      </div>
    );
  }

  const user = artisan.userId;

  return (
    <>
      <Helmet>
        <title>{`${user?.name || 'Artisan'} — Master of ${artisan.craftType || 'Odisha Craft'} | ODCRAFTS`}</title>
        <meta name="description" content={artisan.artisanStory?.slice(0, 160)} />
      </Helmet>

      <div className="min-h-screen bg-ivory">
        {/* Artisan Hero Banner */}
        <section className="border-b border-primary/10 bg-ivory-dark/50 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start max-w-5xl mx-auto">
              {/* Portrait */}
              <div className="relative aspect-square w-52 md:w-64 rounded-3xl overflow-hidden shadow-xl border-4 border-white shrink-0">
                <img
                  src={
                    artisan.photo ||
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={user?.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Bio & Credentials */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary-light/40 px-3 py-1 text-xs font-bold text-secondary-dark uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  <span>Master Craftswoman</span>
                </div>

                <h1 className="font-serif text-3xl md:text-5xl font-bold text-charcoal">
                  {user?.name}
                </h1>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-charcoal-light pt-1">
                  <span className="flex items-center gap-1 font-semibold text-charcoal">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {artisan.district}, Odisha
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-secondary-dark">{artisan.craftType}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-secondary-dark" />
                    {artisan.yearsOfExperience || '20+'} Years of Dedication
                  </span>
                </div>

                {artisan.artisanStory && (
                  <p className="mt-4 text-sm md:text-base text-charcoal leading-relaxed italic max-w-2xl bg-white/70 p-5 rounded-2xl border border-warm-gray/15">
                    "{artisan.artisanStory}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Artisan's Creations */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">
                Handcrafted by {user?.name?.split(' ')[0]}
              </h2>
              <p className="text-xs text-warm-gray mt-1">
                Direct from her loom and workshop in {artisan.district}
              </p>
            </div>
            <span className="text-xs font-semibold text-warm-gray">
              {products.length} {products.length === 1 ? 'creation' : 'creations'}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-warm-gray/15 bg-white p-12 text-center">
              <p className="text-sm text-warm-gray">
                {user?.name} is currently crafting new pieces. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={{ ...p, sellerId: artisan }} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
