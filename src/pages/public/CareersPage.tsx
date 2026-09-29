import { Helmet } from 'react-helmet-async';

export default function CareersPage() {
  const openings = [
    { role: 'Artisan Relations Manager', location: 'Bhubaneswar, Odisha', type: 'Full-time', dept: 'Operations' },
    { role: 'Frontend Engineer (React)', location: 'Remote (India)', type: 'Full-time', dept: 'Engineering' },
    { role: 'Content & Storytelling Writer', location: 'Remote (India)', type: 'Contract', dept: 'Marketing' },
    { role: 'Photography & Visual Arts', location: 'Odisha (Field)', type: 'Freelance', dept: 'Creative' },
    { role: 'Logistics & Supply Chain Intern', location: 'Bhubaneswar, Odisha', type: 'Internship', dept: 'Operations' },
  ];

  const perks = [
    { icon: '🌿', title: 'Meaningful Work', desc: 'Every task you do directly impacts artisan livelihoods.' },
    { icon: '🏡', title: 'Remote-First', desc: 'Most roles are remote or hybrid. Work from where you thrive.' },
    { icon: '📚', title: 'Learning Budget', desc: '₹25,000/year for courses, conferences, and books.' },
    { icon: '🎨', title: 'Craft Immersions', desc: 'Annual field visits to artisan villages across Odisha.' },
  ];

  return (
    <>
      <Helmet>
        <title>Careers — Join the ODCRAFTS Team</title>
        <meta name="description" content="Work at ODCRAFTS and help empower women artisans of Odisha. View open roles and internships." />
      </Helmet>

      <section className="bg-[#1a0e08] text-white py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 60%, #c0773a 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">We're Hiring</p>
          <h1 className="text-5xl font-serif font-bold mb-4">Build something meaningful</h1>
          <p className="text-white/65 leading-relaxed">Join a small, passionate team working at the intersection of technology, culture, and social impact.</p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 px-6 bg-[#fdf8f3]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#c0773a] text-center mb-8">Why ODCRAFTS</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl p-6 border border-[#e8c49a]/20 shadow-sm text-center">
                <span className="text-3xl mb-3 block">{p.icon}</span>
                <h3 className="font-serif font-bold text-[#3d1f0a] mb-2">{p.title}</h3>
                <p className="text-xs text-[#6b4226] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-[#3d1f0a] text-center mb-8">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job) => (
              <div key={job.role} className="bg-[#fdf8f3] rounded-2xl p-6 border border-[#e8c49a]/20 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-[#3d1f0a] mb-1">{job.role}</h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-[#c0773a]/10 text-[#c0773a] px-2 py-0.5 rounded-full font-medium">{job.dept}</span>
                    <span className="text-[#6b4226]">{job.location}</span>
                    <span className="text-[#6b4226]">· {job.type}</span>
                  </div>
                </div>
                <a href={`mailto:careers@odcrafts.com?subject=Application: ${job.role}`} className="shrink-0 bg-[#c0773a] hover:bg-[#a8622f] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors">Apply</a>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-[#1a0e08] rounded-2xl p-8 text-white text-center">
            <p className="text-[#e8c49a] font-bold font-serif text-lg mb-2">Don't see your role?</p>
            <p className="text-white/60 text-sm mb-4">We're always open to exceptional people. Send us your profile.</p>
            <a href="mailto:careers@odcrafts.com" className="inline-block border border-[#e8c49a]/40 hover:border-[#e8c49a] text-[#e8c49a] px-6 py-2 rounded-full text-sm font-medium transition-colors">careers@odcrafts.com</a>
          </div>
        </div>
      </section>
    </>
  );
}
