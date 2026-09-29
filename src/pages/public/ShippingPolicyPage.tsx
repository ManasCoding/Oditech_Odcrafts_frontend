import { Helmet } from 'react-helmet-async';

export default function ShippingPolicyPage() {
  const sections = [
    {
      title: 'Processing Time',
      content: `Most orders are processed within 1–3 business days after payment confirmation. Handcrafted or made-to-order pieces may require an additional 2–5 business days due to the artisan production cycle. You will receive an email notification once your order has been dispatched.`,
    },
    {
      title: 'Domestic Shipping (India)',
      content: `Standard delivery within India takes 5–9 business days depending on your location. Remote pin codes may take up to 12 business days. We offer free shipping on all orders above ₹1,500. Orders below ₹1,500 attract a flat shipping fee of ₹99.`,
    },
    {
      title: 'International Shipping',
      content: `We ship to 30+ countries worldwide. International shipping timelines are 10–21 business days depending on the destination country and customs processing. Shipping charges for international orders are calculated at checkout based on weight and destination. The customer is responsible for any import duties, customs fees, or taxes charged by the destination country.`,
    },
    {
      title: 'Order Tracking',
      content: `Once your order is dispatched, you will receive a shipment tracking number via email and SMS. You can track your order in real time from the "My Orders" section in your account dashboard, or by visiting the Track Order page.`,
    },
    {
      title: 'Packaging',
      content: `All ODCRAFTS orders are packaged in eco-friendly, recyclable materials. Fragile items (such as Terracotta or Dhokra Brass) receive additional protective padding. We offer premium gift wrapping on request at checkout.`,
    },
    {
      title: 'Lost or Damaged Shipments',
      content: `In the rare event of a lost or damaged shipment, please contact our support team within 48 hours of the expected delivery date. We will initiate an investigation with the courier and arrange a replacement or full refund as applicable.`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Shipping Policy — ODCRAFTS</title>
        <meta name="description" content="Learn about ODCRAFTS's shipping timelines, costs, and policies for domestic and international orders." />
      </Helmet>

      <section className="bg-[#1a0e08] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 60%, #c0773a 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Policies</p>
          <h1 className="text-5xl font-serif font-bold mb-4">Shipping Policy</h1>
          <p className="text-white/65">Transparent delivery timelines and costs for every order.</p>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#fdf8f3]">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-[#c0773a]/10 border border-[#c0773a]/30 rounded-xl p-5 flex gap-3 items-start">
            <span className="text-2xl">🚚</span>
            <p className="text-sm text-[#6b4226]">Free shipping on all domestic orders above ₹1,500. International shipping rates calculated at checkout.</p>
          </div>
          {sections.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl p-8 border border-[#e8c49a]/20 shadow-sm">
              <h2 className="font-serif font-bold text-[#3d1f0a] text-xl mb-3">{s.title}</h2>
              <p className="text-sm text-[#6b4226] leading-relaxed">{s.content}</p>
            </div>
          ))}
          <p className="text-xs text-[#6b4226]/60 text-center">Last updated: September 2026. Policy subject to change without prior notice.</p>
        </div>
      </section>
    </>
  );
}
