import { Link } from 'react-router-dom';

export function Footer() {
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/ODCRAFTS',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/ODCRAFTS',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@ODCRAFTS',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/9124670012',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      name: 'Pinterest',
      href: 'https://pinterest.com/ODCRAFTS',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#1a0e08] text-white pt-16 pb-8">
      <div className="container mx-auto px-6">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">

          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <img src="/logo.png" alt="ODCRAFTS" className="h-12 w-auto object-contain" />
              <span className="text-2xl font-serif font-bold text-[#e8c49a] tracking-wide">ODCRAFTS</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-xs">
              A bridge connecting conscious patrons with women master artisans across 30 districts of Odisha. Every purchase preserves a living heritage.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mb-6">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-[#c0773a] flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Newsletter</p>
            <div className="flex rounded-lg overflow-hidden border border-white/15 max-w-xs">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/5 text-sm text-white placeholder-white/30 px-3 py-2 outline-none"
              />
              <button className="bg-[#c0773a] hover:bg-[#a8622f] text-white text-xs font-bold px-4 py-2 transition-colors shrink-0">
                Subscribe
              </button>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Shop</h4>
              <ul className="space-y-2.5 text-sm text-white/55">
                {[['All Products','/shop'],['Pattachitra','/shop/pattachitra'],['Applique','/shop/applique'],['Terracotta','/shop/terracotta'],['Dhokra Brass','/shop/dhokra'],['Handloom','/shop/handloom']].map(([label,href])=>(
                  <li key={label}><Link to={href} className="hover:text-[#e8c49a] transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Artisans</h4>
              <ul className="space-y-2.5 text-sm text-white/55">
                {[['Meet Artisans','/artisans'],['Join as Artisan','/register'],['Artisan Login','/login'],['Our Stories','/stories'],['Support','/support']].map(([label,href])=>(
                  <li key={label}><Link to={href} className="hover:text-[#e8c49a] transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-white/55">
                {[['About Us','/about'],['Contact Us','/contact'],['Careers','/careers'],['Press','/press'],['FAQs','/faq']].map(([label,href])=>(
                  <li key={label}><Link to={href} className="hover:text-[#e8c49a] transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#e8c49a] mb-4">Policies</h4>
              <ul className="space-y-2.5 text-sm text-white/55">
                {[['Shipping Policy','/shipping-policy'],['Return & Exchange','/return-exchange'],['Track Order','/track-order'],['Terms & Conditions','/terms'],['Privacy Policy','/privacy-policy']].map(([label,href])=>(
                  <li key={label}><Link to={href} className="hover:text-[#e8c49a] transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-white/35 text-center md:text-left">
            © 2026 <span className="text-[#e8c49a] font-semibold">ODCRAFTS</span> by Oditech Global. All rights reserved. Made with ♥ for Odisha's craftswomen.
          </p>
          <div className="flex flex-wrap justify-center gap-5 text-xs text-white/35">
            {[['Privacy Policy','/privacy-policy'],['Terms','/terms'],['Shipping','/shipping-policy'],['Returns','/return-exchange'],['Track Order','/track-order']].map(([label,href])=>(
              <Link key={label} to={href} className="hover:text-[#e8c49a] transition-colors">{label}</Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
