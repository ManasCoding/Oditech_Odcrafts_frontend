import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, Eye, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import { api } from '@/services/api';
import { ProductCard } from '@/components/product/ProductCard';

export default function StoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStory() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const res = await api.get(`/stories/${slug}`);
        setStory(res.data?.data?.story);
        setRelated(res.data?.data?.related || []);
      } catch (err) {
        console.error('Error loading story:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStory();
  }, [slug]);

  if (isLoading) {
    return (
      <article className="container mx-auto px-4 py-16 max-w-3xl animate-pulse space-y-6">
        <div className="h-10 bg-warm-gray/20 rounded w-3/4" />
        <div className="aspect-16/9 bg-warm-gray/15 rounded-2xl w-full" />
        <div className="space-y-3">
          <div className="h-4 bg-warm-gray/15 rounded w-full" />
          <div className="h-4 bg-warm-gray/15 rounded w-full" />
          <div className="h-4 bg-warm-gray/15 rounded w-2/3" />
        </div>
      </article>
    );
  }

  if (!story) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-3xl font-bold text-primary">Chronicle Not Found</h2>
        <Link to="/stories" className="mt-4 text-xs font-semibold text-primary underline">
          View All Cultural Stories
        </Link>
      </div>
    );
  }

  const artisan = story.relatedArtisanId;

  return (
    <>
      <Helmet>
        <title>{`${story.title} — ODCRAFTS Journal`}</title>
        <meta name="description" content={story.excerpt} />
      </Helmet>

      <div className="min-h-screen bg-ivory py-12 md:py-16">
        <article className="container mx-auto px-4 max-w-3xl">
          {/* Back link */}
          <Link
            to="/stories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-warm-gray hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all stories
          </Link>

          {/* Header */}
          <header className="space-y-4">
            <span className="inline-block rounded-full bg-secondary-light/50 px-3.5 py-1 text-xs font-bold text-secondary-dark uppercase tracking-wider">
              {story.category?.replace('-', ' ')}
            </span>

            <h1 className="font-serif text-3xl md:text-5xl font-bold text-charcoal leading-tight">
              {story.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-warm-gray pt-2 border-b border-warm-gray/15 pb-6">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {story.readTimeMinutes || 5} minute read
              </span>
              <span>•</span>
              <span>Published on {new Date(story.publishedAt || story.createdAt).toLocaleDateString()}</span>
              {story.viewCount > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {story.viewCount} views
                  </span>
                </>
              )}
            </div>
          </header>

          {/* Hero Image */}
          <div className="my-8 aspect-16/9 rounded-3xl overflow-hidden shadow-lg border border-warm-gray/15">
            <img src={story.heroImage} alt={story.title} className="h-full w-full object-cover" />
          </div>

          {/* Excerpt Lead */}
          <p className="font-serif text-lg md:text-xl text-charcoal italic leading-relaxed border-l-4 border-primary pl-4 my-8">
            {story.excerpt}
          </p>

          {/* Body Content */}
          <div className="prose prose-lg prose-amber max-w-none text-charcoal text-base leading-relaxed space-y-6 whitespace-pre-line font-sans">
            {story.content}
          </div>

          {/* Featured Artisan Profile in Story */}
          {artisan && (
            <div className="mt-12 rounded-2xl bg-white border border-secondary/25 p-6 md:p-8 shadow-xs">
              <span className="text-xs font-bold text-secondary-dark uppercase tracking-wider">
                Featured Odisha Artisan
              </span>
              <div className="mt-4 flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={
                    artisan.photo ||
                    artisan.userId?.avatar ||
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={artisan.userId?.name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-secondary/40 shrink-0"
                />
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-charcoal">{artisan.userId?.name}</h3>
                  <p className="text-xs text-warm-gray">
                    {artisan.craftType} Master · {artisan.district}, Odisha
                  </p>
                  <p className="text-xs text-charcoal-light italic">
                    "{artisan.artisanStory}"
                  </p>
                  <Link
                    to={`/artisan/${artisan.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-2"
                  >
                    View her creations <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mt-16 pt-12 border-t border-warm-gray/15">
              <h3 className="font-serif text-2xl font-bold text-charcoal mb-6">More Cultural Chronicles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((r) => (
                  <Link
                    key={r._id}
                    to={`/stories/${r.slug}`}
                    className="group rounded-xl border border-warm-gray/15 bg-white p-4 hover:shadow-md transition-all flex gap-4"
                  >
                    <img src={r.heroImage} alt={r.title} className="h-20 w-24 rounded-lg object-cover shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-secondary-dark uppercase">
                        {r.category?.replace('-', ' ')}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-charcoal group-hover:text-primary line-clamp-2">
                        {r.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
}
