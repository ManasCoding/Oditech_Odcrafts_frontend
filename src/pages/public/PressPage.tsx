import { Helmet } from 'react-helmet-async';

export default function PressPage() {
  const coverages = [
    { outlet: 'The Hindu', date: 'Aug 2026', headline: '"ODCRAFTS is democratising traditional craft commerce, one Pattachitra at a time"', type: 'Feature' },
    { outlet: 'Economic Times', date: 'Jun 2026', headline: 'Odisha startup bridges gap between artisans and global buyers', type: 'News' },
    { outlet: 'Forbes India', date: 'Mar 2026', headline: 'Social commerce for craftswomen: India\'s most authentic marketplace', type: 'Profile' },
    { outlet: 'BBC Hindi', date: 'Jan 2026', headline: 'डिजिटल क्रांति: ओडिशा की महिला कारीगरें ग्लोबल बाज़ार में', type: 'Feature' },
  ];

  return (
    <>
      <Helmet>
        <title>Press &amp; Media — ODCRAFTS</title>
        <meta name="description" content="ODCRAFTS press kit, media coverage, and contact for journalists and media professionals." />
      </Helmet>

      <section className="bg-[#1a0e08] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 60%, #c0773a 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Newsroom</p>
          <h1 className="text-5xl font-serif font-bold mb-4">Press &amp; Media</h1>
          <p className="text-white/65">Resources for journalists, media professionals, and partners.</p>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#fdf8f3]">
        <div className="max-w-4xl mx-auto">

          {/* Press Kit */}
          <div className="bg-[#1a0e08] rounded-2xl p-8 text-white mb-12 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-2">Media Kit</p>
              <h2 className="text-2xl font-serif font-bold mb-2">Download our Press Kit</h2>
              <p className="text-white/65 text-sm">Includes logos, brand guidelines, founder bios, product photography, and company fact sheet.</p>
            </div>
            <a href="mailto:press@odcrafts.com?subject=Press Kit Request" className="shrink-0 bg-[#c0773a] hover:bg-[#a8622f] text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm">Request Press Kit</a>
          </div>

          {/* Coverage */}
          <h2 className="text-2xl font-serif font-bold text-[#3d1f0a] mb-6">In the News</h2>
          <div className="space-y-4 mb-12">
            {coverages.map((c) => (
              <div key={c.headline} className="bg-white rounded-2xl p-6 border border-[#e8c49a]/20 shadow-sm flex items-start gap-4">
                <div className="shrink-0 w-20 text-center">
                  <p className="text-xs font-bold text-[#c0773a] uppercase">{c.outlet}</p>
                  <p className="text-xs text-[#6b4226]/60">{c.date}</p>
                </div>
                <div className="flex-1">
                  <p className="font-serif text-[#3d1f0a] leading-snug">"{c.headline}"</p>
                </div>
                <span className="shrink-0 text-xs bg-[#c0773a]/10 text-[#c0773a] px-2 py-0.5 rounded-full font-medium">{c.type}</span>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl p-8 border border-[#e8c49a]/20 shadow-sm text-center">
            <h2 className="text-xl font-serif font-bold text-[#3d1f0a] mb-2">Press Contact</h2>
            <p className="text-sm text-[#6b4226] mb-4">For interview requests, quotes, or media enquiries:</p>
            <a href="mailto:press@odcrafts.com" className="text-[#c0773a] font-bold hover:underline text-lg">press@odcrafts.com</a>
            <p className="text-xs text-[#6b4226]/60 mt-2">We aim to respond within 24 hours on business days.</p>
          </div>
        </div>
      </section>
    </>
  );
}
