import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { api } from '@/services/api';

export default function StoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';

  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { label: 'All Chronicles', value: '' },
    { label: 'Craft Stories', value: 'craft-stories' },
    { label: 'Artisan Journeys', value: 'artisan-stories' },
    { label: 'Odisha Heritage', value: 'odisha-culture' },
  ];

  useEffect(() => {
    async function loadStories() {
      setIsLoading(true);
      try {
        const params: Record<string, string> = {};
        if (categoryFilter) params.category = categoryFilter;
        const res = await api.get('/stories', { params });
        setStories(res.data?.data?.stories || []);
      } catch (err) {
        console.error('Failed to load cultural stories:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStories();
  }, [categoryFilter]);

  const handleCategoryChange = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat) next.set('category', cat);
    else next.delete('category');
    setSearchParams(next);
  };

  return (
    <>
      <Helmet>
        <title>Cultural Chronicles & Craft Stories — ODCRAFTS</title>
        <meta
          name="description"
          content="Immerse in the folklore, natural alchemy, and centuries of tradition that shape the living crafts of Odisha."
        />
      </Helmet>

      <div className="min-h-screen bg-ivory">
        {/* Editorial Masthead */}
        <section className="border-b border-primary/10 bg-ivory-dark/40 py-16 md:py-24 text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <span className="text-xs font-semibold tracking-wider text-secondary-dark uppercase flex items-center justify-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Editorial Journal
            </span>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-bold text-primary leading-tight">
              Chronicles of Craft & Culture
            </h1>
            <p className="mt-4 text-base md:text-lg text-charcoal-light leading-relaxed">
              Stories woven in silk, painted with conch shells, and cast in ancient brass. Discover the myths and mathematics behind Odisha’s sacred traditions.
            </p>

            {/* Category Filter Pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => handleCategoryChange(c.value)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    categoryFilter === c.value
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-white text-charcoal hover:bg-white/80'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="container mx-auto px-4 py-16 max-w-6xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-warm-gray/15 p-6 animate-pulse space-y-4">
                  <div className="aspect-16/9 w-full rounded-xl bg-warm-gray/15" />
                  <div className="h-6 w-3/4 bg-warm-gray/20 rounded" />
                  <div className="h-4 w-full bg-warm-gray/10 rounded" />
                </div>
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-warm-gray/15 p-8 max-w-md mx-auto">
              <h3 className="font-serif text-xl font-bold text-charcoal">No stories published yet</h3>
              <p className="text-xs text-warm-gray mt-2">New editorial essays will appear here soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stories.map((story) => (
                <article
                  key={story._id}
                  className="group flex flex-col rounded-2xl bg-white border border-warm-gray/15 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <Link to={`/stories/${story.slug}`} className="relative aspect-16/9 overflow-hidden bg-ivory-dark">
                    <img
                      src={story.heroImage}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-white/90 backdrop-blur-xs px-3 py-1 text-[10px] font-bold text-charcoal uppercase tracking-wider shadow-xs">
                        {story.category?.replace('-', ' ')}
                      </span>
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-xs text-warm-gray mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {story.readTimeMinutes || 5} min read
                      </span>
                      <span>•</span>
                      <span>{new Date(story.publishedAt || story.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Link to={`/stories/${story.slug}`}>
                      <h2 className="font-serif text-xl md:text-2xl font-bold text-charcoal group-hover:text-primary transition-colors leading-snug">
                        {story.title}
                      </h2>
                    </Link>

                    <p className="mt-3 text-xs text-charcoal-light leading-relaxed line-clamp-3">
                      {story.excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-warm-gray/10 flex items-center justify-between">
                      <Link
                        to={`/stories/${story.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-primary-light transition-colors"
                      >
                        <span>Read Full Chronicle</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
