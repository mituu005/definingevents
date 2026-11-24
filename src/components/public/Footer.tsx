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

  const contactPhone = settings.contact_phone || '+91 98765 43210';
  const contactEmail = settings.contact_email || 'concierge@definingevents.com';
  const contactAddress =
    settings.contact_address || 'Belgravia Creative Studio & Global Production Hub';

  return (
    <footer className="bg-[#08080A] text-[#FAF8F5] border-t border-[#FFA01C]/25">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-3.5">
            <BrandMark tone="light" />
            <p className="text-xs sm:text-[13px] leading-relaxed text-[#FAF8F5]/75 font-light max-w-sm">
              {settings.about_intro ||
                'International luxury event planning, architectural scenography, and bespoke production studio.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
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
                    className="text-[#FAF8F5]/75 hover:text-[#FFA01C] transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] uppercase tracking-[0.26em] text-[#FFA01C] mb-5 font-semibold">
              Core Disciplines
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
                    className="text-left text-[#FAF8F5]/75 hover:text-[#FFA01C] transition-colors cursor-pointer"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Atelier & Contact Column */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] uppercase tracking-[0.26em] text-[#FFA01C] mb-5 font-semibold">
              Atelier &amp; Contact
            </h3>
            <div className="space-y-3 text-sm font-light text-[#FAF8F5]/75">
              <p>
                <a
                  href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-[#FFA01C] transition-colors"
                >
                  {contactPhone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-[#FFA01C] transition-colors"
                >
                  {contactEmail}
                </a>
              </p>
              <p className="leading-relaxed text-[#FAF8F5]/70">{contactAddress}</p>
              <p className="text-xs text-[#FFA01C]/80 pt-1">
                Mon – Sat: 9:00 AM – 8:00 PM (IST / GMT)
              </p>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
