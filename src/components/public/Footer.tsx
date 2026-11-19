import { Lock, MessageCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrandMark } from '@/components/common/BrandMark';
import { useSiteData } from '@/contexts/SiteDataContext';

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function Footer() {
  const { settings, services, setPreselectedEventType } = useSiteData();
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const cleanWhatsapp = (settings.contact_whatsapp || '').replace(/[^0-9]/g, '');
  const whatsappUrl = cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}` : null;

  return (
    <footer className="bg-[#08080A] text-[#FAF8F5] border-t border-[#FFA01C]/25">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <BrandMark tone="light" />
            <p className="text-sm leading-relaxed text-[#FAF8F5]/75 font-light max-w-sm">
              {settings.about_intro ||
                'International luxury event planning, architectural scenography, and bespoke production studio.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#FFA01C]/40 bg-[#121217] text-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#FFA01C]/40 bg-[#121217] text-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
                >
                  <InstagramIcon />
                </a>
              )}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#FFA01C]/40 bg-[#121217] text-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
                >
                  <FacebookIcon />
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#FFA01C]/40 bg-[#121217] text-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
                >
                  <LinkedInIcon />
                </a>
              )}
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] uppercase tracking-[0.26em] text-[#FFA01C] mb-5 font-semibold">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm font-light">
              {[
                ['Home', 'hero'],
                ['About Us', 'about'],
                ['Services', 'services'],
                ['Our Work', 'portfolio'],
                ['Our Process', 'process'],
                ['Testimonials', 'testimonials'],
                ['Contact', 'contact'],
              ].map(([label, id]) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(id)}
                    className="text-[#FAF8F5]/75 hover:text-[#FFA01C] transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#FFA01C] hover:text-[#FFB84D] transition-colors font-medium mt-1"
                >
                  <Lock className="h-3 w-3" />
                  <span>Studio Admin</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] uppercase tracking-[0.26em] text-[#FFA01C] mb-5 font-semibold">
              Core Services
            </h3>
            <ul className="space-y-3 text-sm font-light">
              {services.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setPreselectedEventType(s.title);
                      scrollToSection('contact');
                    }}
                    className="text-left text-[#FAF8F5]/75 hover:text-[#FFA01C] transition-colors"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] uppercase tracking-[0.26em] text-[#FFA01C] mb-5 font-semibold">
              Atelier &amp; Contact
            </h3>
            <div className="space-y-3 text-sm font-light text-[#FAF8F5]/75">
              {settings.contact_phone && (
                <p>
                  <a
                    href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`}
                    className="hover:text-[#FFA01C] transition-colors"
                  >
                    {settings.contact_phone}
                  </a>
                </p>
              )}
              {settings.contact_email && (
                <p>
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="hover:text-[#FFA01C] transition-colors"
                  >
                    {settings.contact_email}
                  </a>
                </p>
              )}
              {settings.contact_address && <p>{settings.contact_address}</p>}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#FFA01C]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/50 pb-16 sm:pb-0 sm:pr-48 md:pr-56 relative z-10">
          <p>
            © {new Date().getFullYear()} {settings.company_name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link to="/privacy-policy" className="hover:text-[#FFA01C] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#FFA01C] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#FFA01C]/50 bg-[#FFA01C]/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-[#FFA01C] transition-all hover:bg-[#FFA01C] hover:text-[#08080A] font-semibold cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              <Lock className="h-3 w-3" />
              <span>Studio Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
