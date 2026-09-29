import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const milestones = [
    { year: '2021', title: 'The Idea', desc: 'Founders visited remote artisan villages in Odisha and saw the gap between master craftswomen and global markets.' },
    { year: '2022', title: 'First Weavers', desc: 'Onboarded 12 women artisans from Nuapatna and Raghurajpur, hand-verifying each craft tradition.' },
    { year: '2023', title: 'Platform Launch', desc: 'ODCRAFTS went live, connecting 200+ artisans with customers across India and 30+ countries.' },
    { year: '2026', title: 'Today', desc: 'Over 1,200 artisan families supported, 50,000+ handcrafted pieces delivered, preserving 14 living craft traditions.' },
  ];

  const values = [
    { icon: '🧵', title: 'Authentic Provenance', desc: 'Every piece is verified by our curation team. If it does not meet our authenticity standard, it does not ship.' },
    { icon: '💛', title: 'Fair Remuneration', desc: 'Artisans keep 70% of every sale. No hidden deductions. Transparent payout every fortnight.' },
    { icon: '🌿', title: 'Sustainable Craft', desc: 'We support only natural dyes, handwoven techniques and zero-waste production methods.' },
    { icon: '📖', title: 'Living Heritage', desc: 'Beyond commerce — we document every craft tradition, artisan story and regional technique for posterity.' },
  ];

  return (
    <>
      <Helmet>
        <title>About ODCRAFTS — Our Story & Mission</title>
        <meta name="description" content="Learn how ODCRAFTS was founded to connect women artisans of Odisha with the world, preserving living craft heritage." />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-[#1a0e08] text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 60% 40%, #c0773a 0%, transparent 70%)' }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Our Story</p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6">
            Crafted with purpose.<br />Built on trust.
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            ODCRAFTS is a fair-trade marketplace founded to bridge the gap between the master craftswomen of Odisha and conscious patrons around the world.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-[#fdf8f3]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#c0773a] mb-3">Why We Exist</p>
            <h2 className="text-3xl font-serif font-bold text-[#3d1f0a] mb-5">A marketplace built for the maker, not just the buyer.</h2>
            <p className="text-[#6b4226] leading-relaxed mb-4">
              Odisha is home to over 30 distinct living craft traditions — Pattachitra, Ikat weaving, Dhokra metalwork, Appliqué, Terracotta and more. Yet the artisans — predominantly women — earn a fraction of the market value of their creations.
            </p>
            <p className="text-[#6b4226] leading-relaxed">
              ODCRAFTS changes that. We provide a direct digital channel so that every rupee spent by a customer creates meaningful, dignified income for a master craftsperson.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['1,200+', 'Artisan Families'], ['50,000+', 'Pieces Delivered'], ['30+', 'Countries Reached'], ['14', 'Craft Traditions']].map(([num, label]) => (
              <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8c49a]/30 text-center">
                <p className="text-3xl font-serif font-bold text-[#c0773a] mb-1">{num}</p>
                <p className="text-xs text-[#6b4226] font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c0773a] mb-3">Our Values</p>
            <h2 className="text-3xl font-serif font-bold text-[#3d1f0a]">What we stand for</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-[#fdf8f3] rounded-2xl p-6 border border-[#e8c49a]/20">
                <span className="text-3xl mb-4 block">{v.icon}</span>
                <h3 className="font-serif font-bold text-[#3d1f0a] mb-2">{v.title}</h3>
                <p className="text-sm text-[#6b4226] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-[#1a0e08] text-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-3">Our Journey</p>
            <h2 className="text-3xl font-serif font-bold">From idea to impact</h2>
          </div>
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#c0773a] flex items-center justify-center text-xs font-bold shrink-0">{m.year}</div>
                  {i < milestones.length - 1 && <div className="flex-1 w-px bg-white/10 my-2" />}
                </div>
                <div className="pb-8">
                  <h3 className="font-serif font-bold text-[#e8c49a] mb-1">{m.title}</h3>
                  <p className="text-sm text-white/65 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#fdf8f3] text-center">
        <h2 className="text-3xl font-serif font-bold text-[#3d1f0a] mb-4">Join the movement</h2>
        <p className="text-[#6b4226] mb-8 max-w-xl mx-auto">Every purchase is a vote for fair trade, authentic craft, and living heritage. Start exploring today.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/shop" className="bg-[#c0773a] hover:bg-[#a8622f] text-white font-semibold px-8 py-3 rounded-full transition-colors">Shop Now</Link>
          <Link to="/artisans" className="border border-[#c0773a] text-[#c0773a] hover:bg-[#c0773a] hover:text-white font-semibold px-8 py-3 rounded-full transition-colors">Meet Artisans</Link>
        </div>
      </section>
    </>
  );
}
