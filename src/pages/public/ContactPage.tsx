import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const contacts = [
    { icon: '📧', label: 'Email', value: 'hello@odcrafts.com', href: 'mailto:hello@odcrafts.com' },
    { icon: '📱', label: 'WhatsApp', value: '+91 99999 99999', href: 'https://wa.me/919999999999' },
    { icon: '📍', label: 'Office', value: 'Bhubaneswar, Odisha — 751001' },
    { icon: '🕐', label: 'Hours', value: 'Mon–Sat, 9 AM – 6 PM IST' },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us — ODCRAFTS</title>
        <meta name="description" content="Get in touch with the ODCRAFTS team for queries, partnerships, or artisan support." />
      </Helmet>

      {/* Hero */}
      <section className="bg-[#1a0e08] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 60%, #c0773a 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Get In Touch</p>
          <h1 className="text-5xl font-serif font-bold mb-4">We'd love to hear from you</h1>
          <p className="text-white/65">Whether you're a customer, artisan, partner, or press — our team is here.</p>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#fdf8f3]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">

          {/* Contact Cards */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#3d1f0a] mb-8">Reach us directly</h2>
            <div className="space-y-4 mb-10">
              {contacts.map((c) => (
                <div key={c.label} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-[#e8c49a]/20 shadow-sm">
                  <span className="text-2xl mt-0.5">{c.icon}</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#c0773a] mb-0.5">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-[#3d1f0a] font-medium hover:text-[#c0773a] transition-colors">{c.value}</a>
                    ) : (
                      <p className="text-[#3d1f0a] font-medium">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#1a0e08] rounded-2xl p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-2">Artisan Support</p>
              <p className="text-sm text-white/70 leading-relaxed">Are you an artisan needing help with your account, payments, or listings? Contact our dedicated artisan support line at <a href="mailto:artisans@odcrafts.com" className="text-[#e8c49a] hover:underline">artisans@odcrafts.com</a></p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8c49a]/20">
            {sent ? (
              <div className="text-center py-12">
                <span className="text-5xl mb-4 block">✅</span>
                <h3 className="text-xl font-serif font-bold text-[#3d1f0a] mb-2">Message Sent!</h3>
                <p className="text-[#6b4226] text-sm">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="mt-6 text-sm text-[#c0773a] hover:underline">Send another message</button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-serif font-bold text-[#3d1f0a] mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { id: 'name', label: 'Your Name', type: 'text', placeholder: 'Ananya Das' },
                    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                    { id: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help?' },
                  ].map((f) => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="block text-xs font-bold uppercase tracking-wide text-[#6b4226] mb-1">{f.label}</label>
                      <input
                        id={f.id}
                        type={f.type}
                        required
                        placeholder={f.placeholder}
                        value={form[f.id as keyof typeof form]}
                        onChange={(e) => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                        className="w-full border border-[#e8c49a]/40 rounded-lg px-4 py-2.5 text-sm text-[#3d1f0a] placeholder-[#c0773a]/40 focus:outline-none focus:border-[#c0773a] transition-colors bg-[#fdf8f3]"
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wide text-[#6b4226] mb-1">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      placeholder="Tell us more..."
                      value={form.message}
                      onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full border border-[#e8c49a]/40 rounded-lg px-4 py-2.5 text-sm text-[#3d1f0a] placeholder-[#c0773a]/40 focus:outline-none focus:border-[#c0773a] transition-colors bg-[#fdf8f3] resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full bg-[#c0773a] hover:bg-[#a8622f] text-white font-semibold py-3 rounded-lg transition-colors">
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
