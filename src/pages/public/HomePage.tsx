import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import heroVideo from '../../../assets/odisha_crafts_video_gwr_video_mvp.mp4';
import { ArrowRight, Sparkles, ShieldCheck, Globe, Users, Volume2, VolumeX } from 'lucide-react';
import { useScrollAnimation, useScrollAnimationGroup } from '@/utils/useScrollAnimation';

export default function HomePage() {
  const { t } = useTranslation();

  const collectionsRef = useScrollAnimationGroup();
  const spotlightRef = useScrollAnimation();
  const whyRef = useScrollAnimationGroup();
  const storiesRef = useScrollAnimationGroup();
  const ctaRef = useScrollAnimation();

  // Video Sound Controller
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 0.85;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
        })
        .catch(() => {
          // Browser prevented autoplay with unmuted audio before user interaction
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});

          // Automatically unmute upon the user's first gesture anywhere on the page
          const enableSound = () => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.volume = 0.85;
              setIsMuted(false);
            }
            window.removeEventListener('click', enableSound);
            window.removeEventListener('touchstart', enableSound);
            window.removeEventListener('keydown', enableSound);
          };

          window.addEventListener('click', enableSound, { once: true });
          window.addEventListener('touchstart', enableSound, { once: true });
          window.addEventListener('keydown', enableSound, { once: true });
        });
    }
  }, []);

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    if (!nextMuted) {
      videoRef.current.volume = 0.85;
      videoRef.current.play().catch(() => {});
    }
    setIsMuted(nextMuted);
  };

  const featuredCollections = [
    {
      id: 'handloom',
      title: 'Odisha Handloom',
      subtitle: 'Sambalpuri, Kotpad & Berhampuri weaves',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      link: '/shop?category=handloom',
    },
    {
      id: 'pattachitra',
      title: 'Pattachitra Art',
      subtitle: 'Ancient scroll painting traditions',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      link: '/shop?category=pattachitra',
    },
    {
      id: 'dhokra',
      title: 'Dhokra Brass Craft',
      subtitle: '4,000-year-old lost wax casting',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      link: '/shop?category=dhokra',
    },
    {
      id: 'jewellery',
      title: 'Tarakasi Silver Filigree',
      subtitle: 'Delicate handcrafted silver lace',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      link: '/shop?category=jewellery',
    },
    {
      id: 'home-decor',
      title: 'Home & Living',
      subtitle: 'Terracotta, palm leaf & appliqué',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
      link: '/shop?category=home-decor',
    },
  ];

  const whyPoints = [
    {
      icon: Users,
      title: 'Made by Women',
      description: 'Every single seller is a woman artisan earning independently and supporting her family.',
    },
    {
      icon: Sparkles,
      title: 'Authentic Craft',
      description: 'Generations of traditional Odia techniques preserved with modern functional aesthetics.',
    },
    {
      icon: ShieldCheck,
      title: 'Fairer Opportunity',
      description: 'Transparent seller base pricing with platform profit-sharing directly back to artisans.',
    },
    {
      icon: Globe,
      title: 'From Odisha to the World',
      description: 'Connecting remote heritage villages to conscious collectors across India and globally.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>ODCRAFTS — Crafted by Her. Inspired by Odisha.</title>
        <meta
          name="description"
          content="Discover authentic handmade creations from women artisans of Odisha. Sambalpuri sarees, Pattachitra paintings, Dhokra craft, and silver filigree."
        />
      </Helmet>

      <div className="relative min-h-screen bg-ivory pb-16 md:pb-0">
        {/* 1. HERO SECTION WITH VIDEO BACKGROUND & OVERLAY */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 pb-20">
          {/* Background Video with Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
            >
              <source src={heroVideo} type="video/mp4" />
              <source src="/assets/odisha_crafts_video_gwr_video_mvp.mp4" type="video/mp4" />
            </video>

            {/* Overlay Divs: Main dark overlay + top vignette for navbar contrast + bottom fade into page */}
            <div className="absolute inset-0 bg-[#000000a7] backdrop-blur-[1px]" />
          </div>

          {/* Floating Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className="absolute bottom-6 right-6 z-20 flex items-center gap-2 rounded-full border border-white/25 bg-black/60 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-black/80 hover:border-white/50 hover:scale-105 shadow-xl active:scale-95 cursor-pointer"
            aria-label={isMuted ? 'Turn Sound On' : 'Mute Sound'}
            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-4 w-4 text-secondary-light" />
                <span className="hidden sm:inline">Play Sound</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-secondary-light animate-pulse" />
                <span className="hidden sm:inline">Sound On</span>
              </>
            )}
          </button>

          <div className="container relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="mb-4 sm:mb-6 font-serif text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-md">
              {t('hero.title', 'Crafted by Her. Inspired by Odisha.')}
            </h1>

            <p className="mx-auto mb-8 sm:mb-10 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-gray-200 drop-shadow-xs">
              {t(
                'hero.subtitle',
                'Discover authentic handmade creations by women artisans from the heartlands of Odisha.'
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto group flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm sm:text-base font-medium text-white shadow-lg transition-all hover:bg-primary-light hover:shadow-xl active:scale-98"
              >
                <span>{t('hero.cta', 'Explore Crafts')}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/artisans"
                className="w-full sm:w-auto text-center rounded-lg border border-white/50 bg-white/10 px-8 py-3.5 text-sm sm:text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-98"
              >
                {t('hero.ctaSecondary', 'Meet the Artisans')}
              </Link>
            </div>
          </div>
        </section>

        {/* 2. FEATURED COLLECTIONS */}
        <section className="border-t border-primary/10 bg-ivory-dark/30 py-14 sm:py-20">
          <div className="container mx-auto px-4" ref={collectionsRef}>
            <div className="mb-10 sm:mb-12 text-center scroll-fade-up">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal">
                Featured Collections
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-warm-gray">
                Curated treasures reflecting Odisha’s living cultural heritage
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {featuredCollections.map((col, idx) => (
                <Link
                  key={col.id}
                  to={col.link}
                  className={`group relative flex h-60 sm:h-80 flex-col justify-end overflow-hidden rounded-xl bg-charcoal p-4 sm:p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-xl scroll-fade-up stagger-${idx + 1}`}
                >
                  <img
                    src={col.image}
                    alt={col.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/40 to-transparent" />
                  <div className="relative z-10">
                    <h3 className="font-serif text-base sm:text-xl font-semibold text-white leading-tight">
                      {col.title}
                    </h3>
                    <p className="mt-1 text-[11px] sm:text-xs text-secondary-light line-clamp-1 sm:line-clamp-none">
                      {col.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 3. ARTISAN SPOTLIGHT */}
        <section className="py-16 ">
          <div className="container mx-auto px-4">
            <div
              ref={spotlightRef}
              className="overflow-hidden  rounded-2xl border h-[70vh] border-primary/15 bg-white shadow-lg md:flex scroll-fade-up"
            >
              <div className="relative h-60 sm:h-72 md:h-auto md:w-1/2">
                <img
                  src="/konark.jpg"
                  alt="Artisan Malati Meher"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-4 left-4 rounded-full bg-ivory/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-md">
                  SOUL OF ODISHA
                </div>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8 md:w-1/2 md:p-14">
                <span className="text-xs sm:text-sm font-semibold tracking-wider text-secondary-dark uppercase">
                  ODISHA CRAFTS
                </span>
                <h3 className="mt-2 font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal">
                  Soul of ODISHA
                </h3>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base leading-relaxed text-charcoal-light text-justify">
                  Every craft carries a piece of Odisha’s soul — shaped by our hands, our traditions, and stories passed from one generation to the next. This rich heritage breathes through the vibrant hues of canvas-bound Pattachitra scroll paintings that narrate sacred epics, and the ethereal, lace-like precision of Tarakasi silver filigree jewelry born in coastal workshops. The vivid, geometric canopies of Pipili appliqué work celebrate festive spirits under the sun, while the rustic, timeless forms of Dhokra lost-wax metal casting bridge the gap between ancient tribal roots and modern living spaces. Passed down as a living lineage, these hands do not merely mold raw materials; they preserve a timeless, unbroken dialogue between past devotion and present beauty.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. WHY THIS MARKETPLACE */}
        <section className="border-y border-primary/10 bg-ivory-dark/40 py-16 sm:py-20">
          <div className="container mx-auto px-4" ref={whyRef}>
            <div className="mb-10 sm:mb-14 text-center scroll-fade-up">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal">
                Why ODCRAFTS
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-warm-gray">
                A conscious marketplace built on direct empowerment and cultural preservation
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {whyPoints.map((point, idx) => {
                const IconComponent = point.icon;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border border-primary/10 bg-ivory p-6 sm:p-8 text-center shadow-xs transition-shadow hover:shadow-md scroll-fade-up stagger-${idx + 1}`}
                  >
                    <div className="mx-auto mb-4 sm:mb-5 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconComponent className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-charcoal">
                      {point.title}
                    </h3>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-charcoal-light">
                      {point.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. EDITORIAL CRAFT STORIES */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4" ref={storiesRef}>
            <div className="mb-8 sm:mb-12 flex flex-col justify-between gap-3 sm:gap-4 md:flex-row md:items-end scroll-fade-up">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal">
                  Living Heritage of Odisha
                </h2>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-warm-gray">
                  Every piece tells a story rooted in thousands of years of art
                </p>
              </div>
              <Link to="/stories" className="text-xs sm:text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
                Explore all stories &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              <article className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-xs scroll-fade-up stagger-1">
                <img
                  src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80"
                  alt="Pattachitra heritage"
                  className="h-44 sm:h-52 w-full object-cover"
                />
                <div className="p-5 sm:p-6">
                  <span className="text-[10px] sm:text-xs font-semibold text-secondary-dark uppercase">Raghurajpur Heritage</span>
                  <h3 className="mt-1.5 sm:mt-2 font-serif text-lg sm:text-xl font-bold text-charcoal">
                    The Sacred Art of Pattachitra
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-charcoal-light line-clamp-3">
                    How master women painters extract organic pigments from conch shells and volcanic minerals to preserve the Jagannath tradition.
                  </p>
                  <Link to="/stories/sacred-art-pattachitra" className="mt-3 sm:mt-4 inline-block text-xs font-semibold text-primary hover:underline">
                    Read Story &rarr;
                  </Link>
                </div>
              </article>

              <article className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-xs scroll-fade-up stagger-2">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
                  alt="Dhokra casting"
                  className="h-44 sm:h-52 w-full object-cover"
                />
                <div className="p-5 sm:p-6">
                  <span className="text-[10px] sm:text-xs font-semibold text-secondary-dark uppercase">Mayurbhanj & Dhenkanal</span>
                  <h3 className="mt-1.5 sm:mt-2 font-serif text-lg sm:text-xl font-bold text-charcoal">
                    Whispers in Brass: The Dhokra Way
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-charcoal-light line-clamp-3">
                    Tracing the timeless lost-wax metal craft preserved across generations by tribal women artisan guilds.
                  </p>
                  <Link to="/stories/whispers-in-brass-dhokra" className="mt-3 sm:mt-4 inline-block text-xs font-semibold text-primary hover:underline">
                    Read Story &rarr;
                  </Link>
                </div>
              </article>

              <article className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-xs scroll-fade-up stagger-3">
                <img
                  src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80"
                  alt="Sambalpuri weaving"
                  className="h-44 sm:h-52 w-full object-cover"
                />
                <div className="p-5 sm:p-6">
                  <span className="text-[10px] sm:text-xs font-semibold text-secondary-dark uppercase">Western Odisha</span>
                  <h3 className="mt-1.5 sm:mt-2 font-serif text-lg sm:text-xl font-bold text-charcoal">
                    Bandha Kala: Mathematics of Thread
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-charcoal-light line-clamp-3">
                    The intricate tie-and-dye geometry behind Odisha’s most celebrated handlooms, woven one thread at a time.
                  </p>
                  <Link to="/stories/bandha-kala-weaving" className="mt-3 sm:mt-4 inline-block text-xs font-semibold text-primary hover:underline">
                    Read Story &rarr;
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA */}
        <section ref={ctaRef} className="relative overflow-hidden bg-primary py-16 sm:py-20 text-white scroll-fade-up">
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Bring a piece of Odisha home.
            </h2>
            <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-sm sm:text-base md:text-lg text-ivory/80">
              When you purchase a handcrafted creation, you directly support the woman artisan who made it.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto text-center rounded-lg bg-secondary px-8 py-3.5 text-sm sm:text-base font-semibold text-charcoal shadow-md transition-colors hover:bg-secondary-light"
              >
                Shop Authentic Crafts
              </Link>
              <Link
                to="/register?role=SELLER"
                className="w-full sm:w-auto text-center rounded-lg border border-white/40 px-8 py-3.5 text-sm sm:text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                Become an Artisan Partner
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
