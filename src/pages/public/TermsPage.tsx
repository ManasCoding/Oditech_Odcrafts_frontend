import { Helmet } from 'react-helmet-async';

export default function TermsPage() {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing or using the ODCRAFTS platform (website and mobile apps), you agree to be bound by these Terms & Conditions and all applicable laws. If you do not agree with any of these terms, you are prohibited from using the platform.' },
    { title: '2. Use of Platform', content: 'You may use the ODCRAFTS platform for lawful personal or commercial purposes only. You may not use the platform to engage in fraudulent transactions, impersonate artisans or other users, or violate any applicable law or regulation.' },
    { title: '3. Account Registration', content: 'To place orders or sell on ODCRAFTS, you must register with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials. ODCRAFTS reserves the right to terminate accounts that violate these terms.' },
    { title: '4. Product Listings', content: 'All products listed on ODCRAFTS are handcrafted by registered artisans. ODCRAFTS curates and verifies listings for authenticity, but is not the manufacturer. Product descriptions and images are provided by the artisans and verified by our team.' },
    { title: '5. Pricing & Payments', content: 'All prices on ODCRAFTS are in Indian Rupees (INR) unless stated otherwise. Prices are inclusive of applicable taxes. ODCRAFTS uses secure, third-party payment gateways. We do not store your card information.' },
    { title: '6. Intellectual Property', content: 'All content on ODCRAFTS — including text, images, logos, and design elements — is the property of ODCRAFTS or licensed to us. You may not reproduce, distribute, or use any content without prior written permission.' },
    { title: '7. Limitation of Liability', content: 'ODCRAFTS is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability to you for any claim shall not exceed the amount paid for the transaction giving rise to the claim.' },
    { title: '8. Governing Law', content: 'These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bhubaneswar, Odisha.' },
    { title: '9. Changes to Terms', content: 'ODCRAFTS reserves the right to update these Terms & Conditions at any time. We will notify you of significant changes via email or a prominent notice on the platform. Continued use of the platform after changes constitutes acceptance.' },
    { title: '10. Contact', content: 'For questions about these terms, please contact us at legal@odcrafts.com or write to ODCRAFTS, Bhubaneswar, Odisha — 751001, India.' },
  ];

  return (
    <>
      <Helmet>
        <title>Terms &amp; Conditions — ODCRAFTS</title>
        <meta name="description" content="Read ODCRAFTS's Terms and Conditions governing use of our platform, marketplace, and services." />
      </Helmet>

      <section className="bg-[#1a0e08] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 60%, #c0773a 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Legal</p>
          <h1 className="text-5xl font-serif font-bold mb-4">Terms &amp; Conditions</h1>
          <p className="text-white/65">Please read these terms carefully before using the ODCRAFTS platform.</p>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#fdf8f3]">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-[#c0773a]/10 border border-[#c0773a]/30 rounded-xl p-5">
            <p className="text-sm text-[#6b4226]"><strong>Effective Date:</strong> 1 January 2026 &nbsp;|&nbsp; <strong>Last Updated:</strong> September 2026</p>
          </div>
          {sections.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl p-8 border border-[#e8c49a]/20 shadow-sm">
              <h2 className="font-serif font-bold text-[#3d1f0a] text-lg mb-3">{s.title}</h2>
              <p className="text-sm text-[#6b4226] leading-relaxed">{s.content}</p>
            </div>
          ))}
          <p className="text-xs text-[#6b4226]/60 text-center">By continuing to use ODCRAFTS, you agree to these terms.</p>
        </div>
      </section>
    </>
  );
}
