import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export default function TrackOrderPage() {
  const [input, setInput] = useState('');
  const [searched, setSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const steps = [
    { label: 'Order Placed', date: 'Sep 25, 2026', done: true },
    { label: 'Payment Confirmed', date: 'Sep 25, 2026', done: true },
    { label: 'Crafted & Packed', date: 'Sep 27, 2026', done: true },
    { label: 'Shipped', date: 'Sep 28, 2026', done: false, active: true },
    { label: 'Out for Delivery', date: 'Est. Oct 2, 2026', done: false },
    { label: 'Delivered', date: 'Est. Oct 2, 2026', done: false },
  ];

  return (
    <>
      <Helmet>
        <title>Track Your Order — ODCRAFTS</title>
        <meta name="description" content="Track the status of your ODCRAFTS order in real time." />
      </Helmet>

      <section className="bg-[#1a0e08] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 60%, #c0773a 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Delivery</p>
          <h1 className="text-5xl font-serif font-bold mb-4">Track Your Order</h1>
          <p className="text-white/65">Enter your order number or tracking ID to see real-time status.</p>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#fdf8f3]">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleTrack} className="bg-white rounded-2xl p-8 border border-[#e8c49a]/20 shadow-sm mb-8">
            <label htmlFor="track-input" className="block text-xs font-bold uppercase tracking-wide text-[#6b4226] mb-2">Order Number or Tracking ID</label>
            <div className="flex gap-3">
              <input
                id="track-input"
                type="text"
                required
                placeholder="e.g. ODC-20260928-0001"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border border-[#e8c49a]/40 rounded-lg px-4 py-2.5 text-sm text-[#3d1f0a] placeholder-[#c0773a]/40 focus:outline-none focus:border-[#c0773a] bg-[#fdf8f3] transition-colors"
              />
              <button type="submit" className="bg-[#c0773a] hover:bg-[#a8622f] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm shrink-0">
                Track
              </button>
            </div>
          </form>

          {searched && (
            <div className="bg-white rounded-2xl p-8 border border-[#e8c49a]/20 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-[#6b4226]/60 mb-0.5">Order</p>
                  <p className="font-serif font-bold text-[#3d1f0a]">{input || 'ODC-20260928-0001'}</p>
                </div>
                <span className="bg-[#c0773a]/10 text-[#c0773a] text-xs font-bold px-3 py-1 rounded-full">In Transit</span>
              </div>

              <div className="space-y-0">
                {steps.map((step, i) => (
                  <div key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        step.done ? 'bg-[#c0773a] text-white' : step.active ? 'bg-[#c0773a]/20 border-2 border-[#c0773a] text-[#c0773a]' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.done ? '✓' : i + 1}
                      </div>
                      {i < steps.length - 1 && <div className={`w-0.5 h-8 my-1 ${step.done ? 'bg-[#c0773a]' : 'bg-gray-200'}`} />}
                    </div>
                    <div className="pb-6">
                      <p className={`font-medium text-sm ${step.done || step.active ? 'text-[#3d1f0a]' : 'text-gray-400'}`}>{step.label}</p>
                      <p className="text-xs text-[#6b4226]/60">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#6b4226]/50 mt-2 text-center">This is a demo tracking view. Log in to see real order tracking.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-sm text-[#6b4226]">Have an account? <a href="/orders" className="text-[#c0773a] hover:underline font-medium">View all your orders</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
