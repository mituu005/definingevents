import { ArrowUp, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';

export function ScrollProgressAndUtilities() {
  const { settings } = useSiteData();
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setProgress(pct);
      // Only show floating actions after scrolling past the hero and stats section (>1100px)
      // to keep credentials and trust metrics table 100% clean and unobstructed
      setShowTop(scrollTop > 1100);
      setIsNearBottom(scrollTop + window.innerHeight > document.documentElement.scrollHeight - 600);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const rawNumber = settings.contact_whatsapp || '919876543210';
  const cleanWhatsapp = rawNumber.replace(/[^0-9]/g, '') || '919876543210';
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Hello ${settings.company_name || 'Defining Events'}, I would like to enquire about planning an event.`
  )}`;

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[70] h-[2.5px] bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#FFA01C] via-[#FFB84D] to-[#C84B31] shadow-[0_0_12px_rgba(255,160,28,0.8)] transition-[width] duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating Utilities */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-2.5 pointer-events-none">
        {showTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="pointer-events-auto flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#FFA01C]/50 bg-[#08080A]/95 text-[#FAF8F5] shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] cursor-pointer"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}

        {showTop && !isNearBottom && (
          <button
            type="button"
            onClick={handleWhatsAppClick}
            aria-label="Chat on WhatsApp"
            title="Chat with us on WhatsApp"
            className="pointer-events-auto group flex items-center gap-2 rounded-full border border-[#FFA01C] bg-[#08080A]/95 px-3 py-2 sm:px-3.5 sm:py-2 text-[13.5px] uppercase tracking-[0.15em] text-[#FAF8F5] shadow-[0_4px_20px_rgba(255,160,28,0.3)] transition-all duration-300 hover:bg-[#FFA01C] hover:text-[#08080A] cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#FFA01C] transition-colors group-hover:text-[#08080A]" />
            <span className="hidden md:inline font-medium">WhatsApp Concierge</span>
          </button>
        )}
      </div>
    </>
  );
}
