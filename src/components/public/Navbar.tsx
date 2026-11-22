import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrandMark } from '@/components/common/BrandMark';
import { useSiteData } from '@/contexts/SiteDataContext';

const NAV_ITEMS = [
  { label: 'Home', id: 'hero' },
  { label: 'About Us', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Our Work', id: 'portfolio' },
  { label: 'Our Process', id: 'process' },
  { label: 'Testimonials', id: 'testimonials' },
  { label: 'Contact', id: 'contact' },
];

export function Navbar() {
  const { settings } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const phoneDisplay = settings.contact_phone || '+91 98765 43210';
  const phoneHref = `tel:${phoneDisplay.replace(/[^0-9+]/g, '')}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 35);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleNavClick = (sectionId: string) => {
    setMobileOpen(false);
    if (!isHome) {
      navigate(`/#${sectionId}`);
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return;
    }
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const solidBg = !isHome || scrolled || mobileOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solidBg
          ? 'bg-[#08080A]/95 backdrop-blur-md border-b border-[#FFA01C]/25 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-gradient-to-b from-[#08080A]/90 via-[#08080A]/40 to-transparent py-4'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <button
          type="button"
          onClick={() => handleNavClick('hero')}
          className="text-left focus:outline-none shrink-0"
          aria-label="Go to homepage"
        >
          <BrandMark tone="light" />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className="relative whitespace-nowrap text-[11px] xl:text-[12px] uppercase tracking-[0.16em] xl:tracking-[0.22em] text-[#FAF8F5]/85 transition-colors hover:text-[#FFA01C] py-1 font-medium"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
          <a
            href={phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-[#FFA01C]/40 bg-[#121217]/90 px-3.5 py-2 text-[11px] font-medium tracking-[0.1em] text-[#FAF8F5] transition-all duration-300 hover:border-[#FFA01C] hover:text-[#FFA01C] hover:shadow-[0_0_15px_rgba(255,160,28,0.25)]"
            title="Call concierge directly"
          >
            <Phone className="h-3.5 w-3.5 text-[#FFA01C]" />
            <span className="font-sans font-medium">{phoneDisplay}</span>
          </a>

          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className="whitespace-nowrap rounded-sm bg-gradient-to-r from-[#FFA01C] via-[#FFB84D] to-[#E68A00] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#08080A] shadow-[0_0_20px_rgba(255,160,28,0.35)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,160,28,0.6)] hover:scale-[1.02]"
          >
            Plan Your Event
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2.5">
          <a
            href={phoneHref}
            aria-label={`Call ${phoneDisplay}`}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#FFA01C]/50 text-[#FFA01C] bg-[#121217]/80 hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
          >
            <Phone className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#FFA01C]/50 text-[#FAF8F5] transition-colors hover:border-[#FFA01C] hover:text-[#FFA01C]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-[#08080A] border-t border-[#FFA01C]/25"
          >
            <nav className="flex flex-col px-6 py-6 space-y-4" aria-label="Mobile Navigation">
              {NAV_ITEMS.map((item, idx) => (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left font-serif text-2xl tracking-wide text-[#FAF8F5] hover:text-[#FFA01C] transition-colors py-1 border-b border-white/5"
                >
                  {item.label}
                </motion.button>
              ))}
              <a
                href={phoneHref}
                className="mt-3 flex items-center justify-center gap-2 rounded-sm border border-[#FFA01C]/60 bg-[#121217] py-3 text-xs uppercase tracking-[0.2em] text-[#FFA01C]"
              >
                <Phone className="h-4 w-4" />
                <span>Call {phoneDisplay}</span>
              </a>
              <button
                type="button"
                onClick={() => handleNavClick('contact')}
                className="w-full rounded-sm bg-gradient-to-r from-[#FFA01C] to-[#E68A00] py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#08080A] shadow-lg"
              >
                Plan Your Event
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
