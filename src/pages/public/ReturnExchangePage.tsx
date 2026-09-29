import { Helmet } from 'react-helmet-async';

export default function ReturnExchangePage() {
  const eligibility = [
    'Item received is damaged or defective',
    'Item does not match the description or photos on the listing',
    'Wrong item delivered',
    'Item arrives in a condition that does not meet quality standards',
  ];

  const nonEligible = [
    'Made-to-order or personalised items',
    'Items returned after 7 days of delivery',
    'Items showing signs of use, washing, or alteration',
    'Items returned without original packaging',
  ];

  return (
    <>
      <Helmet>
        <title>Return &amp; Exchange Policy — ODCRAFTS</title>
        <meta name="description" content="ODCRAFTS's 7-day return and exchange policy. Learn what qualifies and how to initiate a return." />
      </Helmet>

      <section className="bg-[#1a0e08] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 60%, #c0773a 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Policies</p>
          <h1 className="text-5xl font-serif font-bold mb-4">Return &amp; Exchange</h1>
          <p className="text-white/65">Our 7-day hassle-free return policy, explained clearly.</p>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#fdf8f3]">
        <div className="max-w-3xl mx-auto space-y-8">

          <div className="bg-[#c0773a]/10 border border-[#c0773a]/30 rounded-xl p-5 flex gap-3 items-start">
            <span className="text-2xl">💡</span>
            <p className="text-sm text-[#6b4226]">Returns must be initiated within <strong>7 days</strong> of delivery. Contact us at <a href="mailto:returns@odcrafts.com" className="text-[#c0773a] hover:underline">returns@odcrafts.com</a> or WhatsApp us to get started.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#e8c49a]/20 shadow-sm">
            <h2 className="font-serif font-bold text-[#3d1f0a] text-xl mb-4">Eligible for Return / Exchange</h2>
            <ul className="space-y-2">
              {eligibility.map((e) => (
                <li key={e} className="flex items-start gap-2 text-sm text-[#6b4226]">
                  <span className="text-green-600 font-bold mt-0.5">✓</span> {e}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#e8c49a]/20 shadow-sm">
            <h2 className="font-serif font-bold text-[#3d1f0a] text-xl mb-4">Not Eligible for Return</h2>
            <ul className="space-y-2">
              {nonEligible.map((n) => (
                <li key={n} className="flex items-start gap-2 text-sm text-[#6b4226]">
                  <span className="text-red-500 font-bold mt-0.5">✗</span> {n}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#e8c49a]/20 shadow-sm">
            <h2 className="font-serif font-bold text-[#3d1f0a] text-xl mb-3">How to Initiate a Return</h2>
            <ol className="space-y-3">
              {[
                'Email returns@odcrafts.com with your order number and reason for return within 7 days of delivery.',
                'Our team will respond within 24 hours with a return authorisation and pickup instructions.',
                'Pack the item securely in its original packaging. Affix the return label provided.',
                'The courier will collect the item from your address. Once we receive and inspect the item, your refund or exchange will be processed within 5–7 business days.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#6b4226]">
                  <span className="w-6 h-6 rounded-full bg-[#c0773a] text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#e8c49a]/20 shadow-sm">
            <h2 className="font-serif font-bold text-[#3d1f0a] text-xl mb-3">Refunds</h2>
            <p className="text-sm text-[#6b4226] leading-relaxed">Approved refunds are processed to the original payment method within 5–7 business days after we receive the returned item. For international orders, refunds may take up to 14 business days depending on your bank.</p>
          </div>

          <p className="text-xs text-[#6b4226]/60 text-center">Last updated: September 2026.</p>
        </div>
      </section>
    </>
  );
}
