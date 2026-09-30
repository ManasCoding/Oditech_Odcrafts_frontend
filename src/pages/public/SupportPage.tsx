import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function SupportPage() {
  const topics = [
    { icon: '📦', title: 'Orders & Shipping', desc: 'Track your order, update delivery address, or check dispatch status.', link: '/track-order' },
    { icon: '↩️', title: 'Returns & Refunds', desc: 'Initiate a return, check refund status, or understand our exchange process.', link: '/return-exchange' },
    { icon: '👤', title: 'Account & Login', desc: 'Reset your password, update profile, or manage notification preferences.', link: '/account' },
    { icon: '💳', title: 'Payments', desc: 'Payment failures, charges, invoices, and billing queries.', link: '/contact' },
    { icon: '🎨', title: 'Artisan Support', desc: 'Seller account help, payouts, listing issues, or onboarding queries.', link: '/contact' },
    { icon: '🎁', title: 'Gift & Custom Orders', desc: 'Bulk gifting, corporate orders, or custom craft commissions.', link: '/contact' },
  ];

  return (
    <>
      <Helmet>
        <title>Support — ODCRAFTS Help Centre</title>
        <meta name="description" content="Get help with your ODCRAFTS orders, returns, account, or artisan queries." />
      </Helmet>

      <section className="bg-[#1a0e08] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 60%, #c0773a 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Help Centre</p>
          <h1 className="text-5xl font-serif font-bold mb-4">How can we help?</h1>
          <p className="text-white/65">Find answers, track orders, or reach our support team.</p>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#fdf8f3]">
        <div className="max-w-4xl mx-auto">

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {topics.map((t) => (
              <Link key={t.title} to={t.link} className="bg-white rounded-2xl p-6 border border-[#e8c49a]/20 shadow-sm hover:border-[#c0773a]/40 hover:shadow-md transition-all group">
                <span className="text-3xl mb-3 block">{t.icon}</span>
                <h3 className="font-serif font-bold text-[#3d1f0a] mb-2 group-hover:text-[#c0773a] transition-colors">{t.title}</h3>
                <p className="text-xs text-[#6b4226] leading-relaxed">{t.desc}</p>
              </Link>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-[#e8c49a]/20 shadow-sm text-center">
              <span className="text-4xl mb-4 block">💬</span>
              <h3 className="font-serif font-bold text-[#3d1f0a] mb-2">Chat with us</h3>
              <p className="text-sm text-[#6b4226] mb-4">WhatsApp support available Mon–Sat, 9 AM – 6 PM IST.</p>
              <a href="https://wa.me/9124670012" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#25D366] hover:bg-[#1da851] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors">Open WhatsApp</a>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-[#e8c49a]/20 shadow-sm text-center">
              <span className="text-4xl mb-4 block">📧</span>
              <h3 className="font-serif font-bold text-[#3d1f0a] mb-2">Email us</h3>
              <p className="text-sm text-[#6b4226] mb-4">We respond to all queries within 24 hours on business days.</p>
              <Link to="/contact" className="inline-block bg-[#c0773a] hover:bg-[#a8622f] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors">Send a Message</Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#6b4226]">Browse common questions in our <Link to="/faq" className="text-[#c0773a] hover:underline font-medium">FAQ section</Link>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
