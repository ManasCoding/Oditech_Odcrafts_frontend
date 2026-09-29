import { Helmet } from 'react-helmet-async';

export default function FAQPage() {
  const faqs = [
    { q: 'Are the products genuinely handmade?', a: 'Yes. Every product on ODCRAFTS is verified by our in-house curation team before it is listed. We visit artisan workshops and authenticate the craft tradition and production method.' },
    { q: 'How long does delivery take?', a: 'Most orders are delivered within 5–9 business days. Handcrafted items may take slightly longer as some pieces are made-to-order. You can track your order in real time from your orders dashboard.' },
    { q: 'Can I return or exchange a product?', a: 'Yes. We have a 7-day return and exchange policy for most items. Products that are personalised or made-to-order are final sale. Please see our Return & Exchange policy for full details.' },
    { q: 'How much do artisans earn per sale?', a: 'Artisans keep 70% of every sale price. ODCRAFTS retains 30% to cover platform operations, photography, packaging, and quality control. We publish our fee structure transparently in every artisan dashboard.' },
    { q: 'Do you ship internationally?', a: 'Yes! We currently ship to 30+ countries. International shipping charges and timelines are calculated at checkout based on your location.' },
    { q: 'How do I become a seller / artisan?', a: 'Click "Join as Artisan" in the footer or navigate to the Artisans section. Fill in your application with your craft tradition and craft samples. Our team will review and get back to you within 3–5 business days.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and popular wallets via our secure payment gateway. International cards (Visa, Mastercard) are also accepted.' },
    { q: 'How do I track my order?', a: 'After your order ships, you will receive a tracking link via email and SMS. You can also track orders from the "My Orders" section in your account dashboard.' },
    { q: 'Are the dyes and materials eco-friendly?', a: 'We encourage and prioritise natural dye and sustainable material practices. Each product listing indicates the materials and dyes used. Artisans using certified natural dyes receive a special "Natural Dye" badge on their listings.' },
    { q: 'Can I gift wrap an order?', a: 'Yes! ODCRAFTS offers eco-friendly gift packaging on request. Select the gift wrap option at checkout and add a personalised message for the recipient.' },
  ];

  return (
    <>
      <Helmet>
        <title>FAQs — ODCRAFTS</title>
        <meta name="description" content="Answers to frequently asked questions about ODCRAFTS — orders, shipping, returns, artisans, and more." />
      </Helmet>

      <section className="bg-[#1a0e08] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 60%, #c0773a 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Help Centre</p>
          <h1 className="text-5xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-white/65">Everything you need to know about shopping on ODCRAFTS.</p>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#fdf8f3]">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-white rounded-2xl border border-[#e8c49a]/20 shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                <span className="font-serif font-semibold text-[#3d1f0a]">{faq.q}</span>
                <span className="text-[#c0773a] text-xl font-bold group-open:rotate-45 transition-transform duration-200 shrink-0 ml-4">+</span>
              </summary>
              <p className="px-6 pb-6 text-sm text-[#6b4226] leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="py-14 px-6 bg-white text-center">
        <p className="text-[#6b4226] mb-4">Still have questions?</p>
        <a href="/contact" className="inline-block bg-[#c0773a] hover:bg-[#a8622f] text-white font-semibold px-8 py-3 rounded-full transition-colors">Contact Us</a>
      </section>
    </>
  );
}
