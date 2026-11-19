import { ArrowUp, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteData } from '@/contexts/SiteDataContext';

export function ScrollProgressAndUtilities() {
  const { settings } = useSiteData();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setProgress(pct);
      setShowTop(scrollTop > 500);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cleanWhatsapp = (settings.contact_whatsapp || '').replace(/[^0-9]/g, '');
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        `Hello ${settings.company_name}, I would like to enquire about planning an event.`
      )}`
    : null;

  const handleWhatsAppClick = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate('/#contact');
      const el = document.getElementById('contact');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
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
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        {showTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-sm border border-[#FFA01C]/50 bg-[#08080A]/95 text-[#FAF8F5] shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A]"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={handleWhatsAppClick}
          aria-label="Chat on WhatsApp"
          title={whatsappUrl ? 'Chat with us on WhatsApp' : 'Go to Contact & Enquiry'}
          className="pointer-events-auto group flex items-center gap-2.5 rounded-sm border border-[#FFA01C] bg-[#08080A]/95 px-4 py-3 text-xs uppercase tracking-[0.2em] text-[#FAF8F5] shadow-[0_4px_25px_rgba(255,160,28,0.25)] transition-all duration-300 hover:bg-[#FFA01C] hover:text-[#08080A]"
        >
          <MessageCircle className="h-4 w-4 text-[#FFA01C] transition-colors group-hover:text-[#08080A]" />
          <span className="hidden sm:inline font-semibold">WhatsApp Concierge</span>
        </button>
      </div>
    </>
  );
}
