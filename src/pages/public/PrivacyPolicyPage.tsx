import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicyPage() {
  const sections = [
    { title: '1. Information We Collect', content: 'We collect information you provide directly — such as your name, email address, delivery address, and payment details when you register or place an order. We also collect usage data automatically via cookies and analytics tools, including pages visited, time spent, and device information.' },
    { title: '2. How We Use Your Information', content: 'We use your information to process and fulfil orders, communicate about your account or transactions, personalise your shopping experience, send newsletters and marketing communications (with your consent), improve our platform and services, and comply with legal obligations.' },
    { title: '3. Sharing of Information', content: 'We do not sell your personal data. We share data only with trusted third parties necessary to provide our services: payment processors (to handle transactions), courier partners (to deliver orders), and analytics providers (to understand platform usage). All third parties are contractually bound to protect your data.' },
    { title: '4. Cookies', content: 'We use essential cookies for platform functionality (session management, cart), and optional analytics cookies to understand user behaviour. You may opt out of analytics cookies via your browser settings. Essential cookies cannot be disabled without affecting platform functionality.' },
    { title: '5. Data Retention', content: 'We retain your personal data for as long as your account is active, or as long as required to provide services and comply with legal obligations. You may request deletion of your account and associated data at any time by contacting privacy@odcrafts.com.' },
    { title: '6. Your Rights', content: 'You have the right to access the personal data we hold about you, correct inaccurate data, request deletion of your data, opt out of marketing communications at any time, and lodge a complaint with the applicable data protection authority.' },
    { title: '7. Security', content: 'We implement industry-standard security measures including HTTPS encryption, secure payment processing, and access controls. While we take reasonable steps to protect your data, no internet transmission is 100% secure.' },
    { title: '8. Children\'s Privacy', content: 'ODCRAFTS is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.' },
    { title: '9. Changes to This Policy', content: 'We may update this Privacy Policy periodically. We will notify you of material changes via email or a notice on the platform. Continued use of ODCRAFTS after changes constitutes acceptance of the revised policy.' },
    { title: '10. Contact Us', content: 'For privacy-related questions or to exercise your data rights, contact our Privacy Officer at privacy@odcrafts.com or write to ODCRAFTS, Bhubaneswar, Odisha — 751001, India.' },
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy — ODCRAFTS</title>
        <meta name="description" content="Read ODCRAFTS's Privacy Policy to understand how we collect, use, and protect your personal data." />
      </Helmet>

      <section className="bg-[#1a0e08] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 60%, #c0773a 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Legal</p>
          <h1 className="text-5xl font-serif font-bold mb-4">Privacy Policy</h1>
          <p className="text-white/65">Your data belongs to you. Here's how we handle it.</p>
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
          <p className="text-xs text-[#6b4226]/60 text-center">We are committed to protecting your privacy and being transparent about our practices.</p>
        </div>
      </section>
    </>
  );
}
