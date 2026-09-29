import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Sparkles, Award, Star, ArrowRight, Heart } from 'lucide-react';
import { api } from '@/services/api';

export default function ArtisansPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const districtFilter = searchParams.get('district') || '';

  const [artisans, setArtisans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const districts = ['Bargarh', 'Puri', 'Cuttack', 'Dhenkanal', 'Sambalpur', 'Mayurbhanj'];

  useEffect(() => {
    // Load unique mock data instead of real seller data
    setIsLoading(true);
    
    setTimeout(() => {
      const mockArtisans = [
        {
          _id: 'mock-1',
          userId: { name: 'Pramila Devi' },
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
          district: 'Puri',
          craftType: 'Pattachitra Art',
          yearsOfExperience: 35,
          rating: 4.9,
          artisanStory: 'I have spent my entire life dedicated to the sacred art of Pattachitra, passing down the stories of our gods through natural colors on palm leaves.',
          slug: 'pramila-devi'
        },
        {
          _id: 'mock-2',
          userId: { name: 'Sujata Mohanty' },
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
          district: 'Bargarh',
          craftType: 'Sambalpuri Handloom',
          yearsOfExperience: 22,
          rating: 4.8,
          artisanStory: 'Weaving the Baandha patterns is like weaving poetry into cloth. Each thread holds a piece of my heritage and passion.',
          slug: 'sujata-mohanty'
        },
        {
          _id: 'mock-3',
          userId: { name: 'Manasi Biswal' },
          photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
          district: 'Cuttack',
          craftType: 'Silver Filigree',
          yearsOfExperience: 28,
          rating: 5.0,
          artisanStory: 'Working with delicate silver wires requires immense patience. Tarakasi is not just a craft, it is a meditation for me.',
          slug: 'manasi-biswal'
        },
        {
          _id: 'mock-4',
          userId: { name: 'Gitanjali Pradhan' },
          photo: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80',
          district: 'Dhenkanal',
          craftType: 'Dhokra Casting',
          yearsOfExperience: 18,
          rating: 4.7,
          artisanStory: 'The lost wax process connects me directly to my tribal roots. Every piece we cast in brass has a soul of its own.',
          slug: 'gitanjali-pradhan'
        }
      ];

      if (districtFilter) {
        setArtisans(mockArtisans.filter(a => a.district === districtFilter));
      } else {
        setArtisans(mockArtisans);
      }
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, [districtFilter]);

  const handleDistrictChange = (dist: string) => {
    const next = new URLSearchParams(searchParams);
    if (dist) next.set('district', dist);
    else next.delete('district');
    setSearchParams(next);
  };

  return (
    <>
      <Helmet>
        <title>Meet the Women Artisans of Odisha — ODCRAFTS</title>
        <meta
          name="description"
          content="Meet the courageous women artisans of Odisha whose skilled hands preserve centuries of sacred handlooms, lost-wax brass casting, and Pattachitra heritage."
        />
      </Helmet>

      <div className="min-h-screen bg-ivory">
        {/* Editorial Hero Header */}
        <section className="border-b border-primary/10 bg-ivory-dark/40 py-16 md:py-24 text-center">
          <div className="container mx-auto px-4">
            <span className="text-xs font-semibold tracking-wider text-secondary-dark uppercase flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Empowering Odisha's Craftswomen
            </span>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-bold text-primary max-w-2xl mx-auto leading-tight">
              The Hands Behind the Living Heritage
            </h1>
            <p className="mt-4 text-base md:text-lg text-charcoal-light max-w-xl mx-auto leading-relaxed">
              ODCRAFTS is more than a marketplace — it is a bridge connecting conscious patrons with women master artisans across 30 districts of Odisha.
            </p>

            {/* District Filter Pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleDistrictChange('')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  !districtFilter ? 'bg-primary text-white shadow-xs' : 'bg-white text-charcoal hover:bg-white/80'
                }`}
              >
                All Odisha
              </button>
              {districts.map((d) => (
                <button
                  key={d}
                  onClick={() => handleDistrictChange(d)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    districtFilter === d
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-white text-charcoal hover:bg-white/80'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Artisans Grid */}
        <section className="container mx-auto px-4 py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-warm-gray/15 p-6 animate-pulse space-y-4">
                  <div className="aspect-square w-full rounded-xl bg-warm-gray/15" />
                  <div className="h-6 w-1/2 bg-warm-gray/20 rounded" />
                  <div className="h-4 w-3/4 bg-warm-gray/10 rounded" />
                </div>
              ))}
            </div>
          ) : artisans.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-warm-gray/15 p-8 max-w-md mx-auto">
              <h3 className="font-serif text-xl font-bold text-charcoal">No artisans found in this region</h3>
              <p className="text-xs text-warm-gray mt-2">Try clearing your district filter to view all craftswomen.</p>
              <button
                onClick={() => handleDistrictChange('')}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white"
              >
                Show All Artisans
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {artisans.map((artisan) => {
                const user = artisan.userId;
                return (
                  <div
                    key={artisan._id}
                    className="group relative flex flex-col rounded-2xl bg-white border border-warm-gray/15 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    {/* Portrait Image */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory-dark">
                      <img
                        src={
                          artisan.photo ||
                          user?.avatar ||
                          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={user?.name || 'Artisan'}
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />

                      {/* District Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-xs px-2 py-1 text-[10px] font-semibold text-charcoal shadow-xs">
                          <MapPin className="h-3 w-3 text-primary" />
                          {artisan.district}
                        </span>
                      </div>

                      {/* Name Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary-light">
                          {artisan.craftType || 'Traditional Craft'}
                        </span>
                        <h3 className="font-serif text-xl font-bold leading-tight">{user?.name}</h3>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-warm-gray pb-3 border-b border-warm-gray/10">
                        <div className="flex items-center gap-1 font-semibold text-charcoal">
                          <Award className="h-3.5 w-3.5 text-secondary-dark" />
                          <span>{artisan.yearsOfExperience || '20+'} yrs experience</span>
                        </div>
                        {artisan.rating && (
                          <div className="flex items-center gap-1 font-semibold text-charcoal">
                            <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                            <span>{artisan.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      {artisan.artisanStory && (
                        <p className="mt-4 text-xs text-charcoal-light italic leading-relaxed line-clamp-3">
                          "{artisan.artisanStory}"
                        </p>
                      )}

                      <div className="mt-auto pt-6 flex items-center justify-between">
                        <Link
                          to={`/artisan/${artisan.slug}`}
                          className="inline-flex items-center gap-2 text-xs font-bold text-primary group-hover:text-primary-light transition-colors"
                        >
                          <span>Discover Her Story & Crafts</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
