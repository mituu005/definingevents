import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrandMark } from '@/components/common/BrandMark';
import { useSiteData } from '@/contexts/SiteDataContext';

const NAV_ITEMS = [
  { label: 'Home', id: 'hero' },
  { label: 'Testimonials', id: 'testimonials' },
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Our Work', id: 'portfolio' },
  { label: 'Process', id: 'process' },
  { label: 'Contact', id: 'contact' },
];

export function Navbar() {
  const { settings } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const phoneDisplay = settings.contact_phone || '+91 98765 43210';
  const phoneHref = `tel:${phoneDisplay.replace(/[^0-9+]/g, '')}`;

  // Scrollspy: automatically light up the active header navigation link based on scroll position
  useEffect(() => {
    const sectionIds = ['hero', 'stats', 'testimonials', 'about', 'services', 'portfolio', 'process', 'contact'];

    const onScroll = () => {
      const isScrolled = window.scrollY > 35;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));

      const scrollPos = window.scrollY + 220;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            // Map stats section to 'testimonials' or 'hero'
            const mappedId = id === 'stats' ? 'testimonials' : id;
            setActiveSection((prev) => (prev !== mappedId ? mappedId : prev));
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        window.history.pushState(null, '', window.location.pathname);
      } catch {}
      return;
    }

    const el = document.getElementById(sectionId);
    if (!el) return;

    const headerHeight = 72;
    const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
    const targetY = Math.max(0, elementTop - headerHeight);

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });

    try {
      window.history.pushState(null, '', `#${sectionId}`);
    } catch {}
  };

  const handleNavClick = (sectionId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    const wasMobile = mobileOpen;
    setMobileOpen(false);
    setActiveSection(sectionId);

    if (!isHome) {
      navigate(`/#${sectionId}`);
      return;
    }

    if (wasMobile) {
      // Delay scroll until mobile drawer starts collapsing so document layout measurements are stable
      window.setTimeout(() => {
        scrollToSection(sectionId);
      }, 150);
    } else {
      scrollToSection(sectionId);
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
      <div className="mx-auto flex w-full max-w-[1720px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Left: Brand Identity with Guaranteed Separation Barrier */}
        <div className="shrink-0 flex items-center mr-3 lg:mr-5 xl:mr-8">
          <a
            href="/#hero"
            onClick={(e) => handleNavClick('hero', e)}
            className="text-left focus:outline-none group inline-block"
            aria-label="Go to homepage"
          >
            <BrandMark tone="light" />
          </a>
        </div>

        {/* Center: Perfectly Proportioned Navigation with Automatic Scrollspy Lighting */}
        <nav
          className="hidden lg:flex items-center justify-center flex-1 min-w-0 gap-1 lg:gap-1.5 xl:gap-2.5 2xl:gap-5 px-2"
          aria-label="Primary Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            // On desktop nav, 'Contact' is represented by the direct Phone pill & 'Plan Your Event' button
            // To ensure zero crowding, hide 'Contact' text link below 2xl viewports (retained in mobile menu)
            const isContact = item.id === 'contact';
            return (
              <a
                key={item.id}
                href={`/#${item.id}`}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`relative whitespace-nowrap px-1.5 xl:px-2 py-1 text-[10px] xl:text-[10.5px] 2xl:text-[11.5px] uppercase tracking-[0.08em] xl:tracking-[0.1em] 2xl:tracking-[0.15em] font-medium transition-all duration-300 shrink-0 ${
                  isContact ? 'hidden 2xl:block' : ''
                } ${
                  isActive
                    ? 'text-[#FFA01C] font-semibold drop-shadow-[0_0_12px_rgba(255,160,28,0.75)]'
                    : 'text-[#FAF8F5]/80 hover:text-[#FFA01C]'
                }`}
              >
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Direct Phone Number Pill & CTA with Guaranteed Separation Barrier */}
        <div className="hidden lg:flex shrink-0 items-center gap-2 lg:gap-2.5 xl:gap-3 ml-3 lg:mr-0 lg:ml-5 xl:ml-8">
          <a
            href={phoneHref}
            className="inline-flex items-center gap-1.5 xl:gap-2 rounded-full border border-[#FFA01C]/50 bg-[#121217]/90 px-3 py-1.5 xl:px-3.5 xl:py-2 text-[10px] xl:text-[11px] font-medium tracking-[0.03em] text-[#FAF8F5] transition-all duration-300 hover:border-[#FFA01C] hover:text-[#FFA01C] hover:shadow-[0_0_18px_rgba(255,160,28,0.35)] shrink-0"
            title={`Direct Concierge Line: ${phoneDisplay}`}
          >
            <Phone className="h-3 w-3 xl:h-3.5 xl:w-3.5 text-[#FFA01C]" />
            <span className="font-sans font-medium">{phoneDisplay}</span>
          </a>

          <a
            href="/#contact"
            onClick={(e) => handleNavClick('contact', e)}
            className="whitespace-nowrap rounded-sm bg-gradient-to-r from-[#FFA01C] via-[#FFB84D] to-[#E68A00] px-3.5 py-1.5 xl:px-4 xl:py-2 text-[10px] xl:text-[10.5px] font-semibold uppercase tracking-[0.14em] xl:tracking-[0.16em] text-[#08080A] shadow-[0_0_20px_rgba(255,160,28,0.35)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,160,28,0.6)] hover:scale-[1.02] shrink-0"
          >
            Plan Your Event
          </a>
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
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-[#08080A] border-t border-[#FFA01C]/25"
          >
            <nav className="flex flex-col px-6 py-6 space-y-4" aria-label="Mobile Navigation">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`/#${item.id}`}
                  onClick={(e) => handleNavClick(item.id, e)}
                  className="block text-left font-serif text-2xl tracking-wide text-[#FAF8F5] hover:text-[#FFA01C] transition-colors py-1 border-b border-white/5"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={phoneHref}
                className="mt-3 flex items-center justify-center gap-2 rounded-sm border border-[#FFA01C]/60 bg-[#121217] py-3 text-xs uppercase tracking-[0.2em] text-[#FFA01C]"
              >
                <Phone className="h-4 w-4" />
                <span>Call {phoneDisplay}</span>
              </a>
              <a
                href="/#contact"
                onClick={(e) => handleNavClick('contact', e)}
                className="block w-full text-center rounded-sm bg-gradient-to-r from-[#FFA01C] to-[#E68A00] py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#08080A] shadow-lg"
              >
                Plan Your Event
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
