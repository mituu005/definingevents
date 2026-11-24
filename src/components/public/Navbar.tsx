import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Copy, Menu, MessageCircle, Phone, QrCode, X } from 'lucide-react';
import QRCode from 'qrcode';
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
  const [conciergeModalOpen, setConciergeModalOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [callFeedback, setCallFeedback] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const phoneDisplay = settings.contact_phone || '+91 98765 43210';
  const cleanPhone = phoneDisplay.replace(/[^0-9+]/g, '');
  const phoneHref = `tel:${cleanPhone}`;

  const rawWhatsapp = settings.contact_whatsapp || '919876543210';
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '') || '919876543210';
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Hello ${settings.company_name || 'Defining Events'}, I would like to enquire about planning an event.`
  )}`;

  useEffect(() => {
    QRCode.toDataURL(phoneHref, {
      margin: 1,
      width: 160,
      color: {
        dark: '#08080A',
        light: '#FFA01C',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch(() => {});
  }, [phoneHref]);

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

  const handlePhoneClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setMobileOpen(false);
    setConciergeModalOpen(true);

    const isMobile =
      typeof navigator !== 'undefined' &&
      /iPhone|iPad|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      try {
        window.location.href = phoneHref;
      } catch {}
    }
  };

  const handleCopyPhone = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(phoneDisplay);
      } else {
        const ta = document.createElement('textarea');
        ta.value = phoneDisplay;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    } catch {}
  };

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCallAtelierClick = (e: React.MouseEvent) => {
    const isMobile =
      typeof navigator !== 'undefined' &&
      /iPhone|iPad|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = phoneHref;
      return;
    }

    e.preventDefault();
    handleCopyPhone();
    setCallFeedback('Calling... (Number Copied! ✓)');

    // 1. Open WhatsApp Web to initiate direct voice call or chat on laptop
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // 2. Attempt system dialer (Phone Link / Skype / FaceTime) without cancelling the window.open call
    setTimeout(() => {
      try {
        window.location.href = phoneHref;
      } catch {}
    }, 200);

    setTimeout(() => {
      setCallFeedback(null);
    }, 4500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConciergeModalOpen(false);
      }
    };
    if (conciergeModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [conciergeModalOpen]);

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
          <button
            type="button"
            onClick={handlePhoneClick}
            className="inline-flex items-center gap-1.5 xl:gap-2 rounded-full border border-[#FFA01C]/50 bg-[#121217]/90 px-3 py-1.5 xl:px-3.5 xl:py-2 text-[10px] xl:text-[11px] font-medium tracking-[0.03em] text-[#FAF8F5] transition-all duration-300 hover:border-[#FFA01C] hover:text-[#FFA01C] hover:shadow-[0_0_18px_rgba(255,160,28,0.35)] shrink-0 cursor-pointer"
            title={`Direct Concierge Line: ${phoneDisplay}`}
          >
            <Phone className="h-3 w-3 xl:h-3.5 xl:w-3.5 text-[#FFA01C]" />
            <span className="font-sans font-medium">{phoneDisplay}</span>
          </button>

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
          <button
            type="button"
            onClick={handlePhoneClick}
            aria-label={`Call or WhatsApp Concierge: ${phoneDisplay}`}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#FFA01C]/50 text-[#FFA01C] bg-[#121217]/80 hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors cursor-pointer"
          >
            <Phone className="h-4 w-4" />
          </button>
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
              <button
                type="button"
                onClick={handlePhoneClick}
                className="mt-3 flex items-center justify-center gap-2 rounded-sm border border-[#FFA01C]/60 bg-[#121217] py-3 text-xs uppercase tracking-[0.2em] text-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors cursor-pointer w-full"
              >
                <Phone className="h-4 w-4" />
                <span>Call {phoneDisplay}</span>
              </button>
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

      {/* Luxury VIP Concierge Action Dialog */}
      <AnimatePresence>
        {conciergeModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setConciergeModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="concierge-dialog-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm sm:max-w-md rounded-xl border border-[#FFA01C]/40 bg-[#0E0E14] p-5 sm:p-6 shadow-[0_0_60px_rgba(255,160,28,0.25)] text-[#FAF8F5]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setConciergeModalOpen(false)}
                aria-label="Close dialog"
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 text-[#FAF8F5]/70 hover:border-[#FFA01C] hover:text-[#FFA01C] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Title & Brand Header */}
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#FFA01C] font-semibold mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFA01C] shadow-[0_0_8px_#FFA01C]" />
                <span>Atelier VIP Concierge</span>
              </div>
              <h3 id="concierge-dialog-title" className="font-serif text-2xl sm:text-3xl font-normal text-[#FAF8F5]">
                Direct Connection
              </h3>
              <p className="mt-1.5 text-xs text-[#FAF8F5]/70 font-light leading-relaxed">
                Connect directly with our event directors for royal weddings, palatial galas, and bespoke productions.
              </p>

              {/* Direct Phone Number Box */}
              <div className="mt-5 rounded-lg border border-[#FFA01C]/30 bg-[#14141E] p-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#FFA01C]/80 font-medium mb-1">
                  Direct Line
                </p>
                <p className="font-serif text-xl sm:text-2xl font-medium tracking-wider text-[#FFA01C]">
                  {phoneDisplay}
                </p>
                <p className="mt-1 text-[11px] text-[#FAF8F5]/50">
                  Mon – Sun • 24/7 Private Client Desk
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                {/* 1. Call Now */}
                <button
                  type="button"
                  onClick={handleCallAtelierClick}
                  className="flex items-center justify-center gap-2.5 w-full rounded-sm bg-gradient-to-r from-[#FFA01C] via-[#FFB84D] to-[#E68A00] py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#08080A] shadow-[0_0_20px_rgba(255,160,28,0.35)] hover:shadow-[0_0_30px_rgba(255,160,28,0.6)] hover:scale-[1.01] transition-all cursor-pointer font-bold"
                >
                  <Phone className="h-4 w-4 fill-current" />
                  <span>{callFeedback ? callFeedback : 'Call Atelier Now'}</span>
                </button>

                {/* Laptop Quick Dial & Scan-To-Call Assistant */}
                <div className="rounded-lg border border-[#FFA01C]/25 bg-[#14141E]/90 p-3 sm:p-3.5 text-left">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#FFA01C] font-semibold mb-2">
                    <span className="flex items-center gap-1.5">
                      <QrCode className="h-3.5 w-3.5" />
                      <span>Laptop Quick Dial</span>
                    </span>
                    <span className="text-[9px] text-[#FAF8F5]/50 font-normal">or scan with phone</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* QR Code */}
                    {qrCodeUrl && (
                      <div className="shrink-0 rounded-md border border-[#FFA01C]/50 bg-[#FFA01C] p-1 shadow-[0_0_12px_rgba(255,160,28,0.3)]">
                        <img
                          src={qrCodeUrl}
                          alt={`Scan to Call ${phoneDisplay}`}
                          className="h-16 w-16 sm:h-20 sm:w-20 rounded-xs"
                        />
                      </div>
                    )}

                    {/* Laptop Call Instructions & Actions */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="text-[11px] leading-snug text-[#FAF8F5]/85 font-light">
                        <strong className="text-[#FFA01C] font-medium">Scan with your phone camera</strong> to dial immediately, or connect via:
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={handleWhatsAppClick}
                          className="inline-flex items-center gap-1 rounded-xs border border-[#25D366]/40 bg-[#25D366]/10 px-2 py-1 text-[9.5px] uppercase tracking-wider text-[#25D366] hover:bg-[#25D366] hover:text-[#08080A] transition-colors cursor-pointer"
                        >
                          <MessageCircle className="h-3 w-3" />
                          <span>WhatsApp Call</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleCopyPhone();
                            try {
                              window.location.href = phoneHref;
                            } catch {}
                          }}
                          className="inline-flex items-center gap-1 rounded-xs border border-[#FFA01C]/40 bg-[#121217] px-2 py-1 text-[9.5px] uppercase tracking-wider text-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors cursor-pointer"
                        >
                          <Phone className="h-3 w-3" />
                          <span>System App</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. WhatsApp Concierge */}
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="flex items-center justify-center gap-2.5 w-full rounded-sm border border-[#25D366]/60 bg-[#25D366]/10 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#25D366] hover:bg-[#25D366] hover:text-[#08080A] transition-all cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp</span>
                </button>

                {/* 3. Copy Phone Number */}
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="flex items-center justify-center gap-2 w-full rounded-sm border border-white/10 bg-[#121217] py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#FAF8F5]/90 hover:border-[#FFA01C] hover:text-[#FFA01C] transition-all cursor-pointer"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="h-4 w-4 text-[#FFA01C]" />
                      <span className="text-[#FFA01C]">Copied to Clipboard! ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#FFA01C]" />
                      <span>Copy Phone Number</span>
                    </>
                  )}
                </button>
              </div>

              {/* Secondary Option: Scroll to Contact Form */}
              <div className="mt-4 text-center border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setConciergeModalOpen(false);
                    scrollToSection('contact');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#FAF8F5]/60 hover:text-[#FFA01C] transition-colors cursor-pointer"
                >
                  <span>Or submit your celebration inquiry online</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
