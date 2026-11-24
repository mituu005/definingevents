import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, Play, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';
import { DEFAULT_HERO_POSTER, DEFAULT_HERO_VIDEO } from '@/lib/defaults';

function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }
  return null;
}

export function HeroSection() {
  const { settings } = useSiteData();
  const containerRef = useRef<HTMLElement>(null);
  const [showreelOpen, setShowreelOpen] = useState(false);

  // Close showreel modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowreelOpen(false);
    };
    if (showreelOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showreelOpen]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.65], [0, 60]);

  // Video URL: use local showreel which contains the vibrant, high-energy live event video
  const videoSrc = useMemo(() => {
    const raw = settings.hero_video_url;
    if (!raw || raw.includes('pexels.com/video-files/3175525') || raw === '/showreel.mp4') {
      return DEFAULT_HERO_VIDEO;
    }
    return raw;
  }, [settings.hero_video_url]);

  const posterSrc = settings.hero_poster_url || DEFAULT_HERO_POSTER;
  const embedUrl = useMemo(() => getEmbedUrl(videoSrc), [videoSrc]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#08080A]"
    >
      {/* Background Video: High-Energy Live Event in Full Swing */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0 z-0">
        {!embedUrl && videoSrc ? (
          <video
            key={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            poster={posterSrc}
            className="h-full w-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <img
            src={posterSrc}
            alt="High-energy luxury celebration"
            className="h-full w-full object-cover"
          />
        )}

        {/* Dynamic event atmospheric gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08080A]/85 via-[#08080A]/40 to-[#08080A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,160,28,0.22)_0%,_transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(200,75,49,0.16)_0%,_transparent_65%)]" />
      </motion.div>


      {/* Center Monumental Content */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 pt-24 sm:pt-32 pb-12 text-center flex-1 flex flex-col justify-center items-center"
      >
        {/* Dynamic Celebration Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-normal leading-[1.08] tracking-tight text-[#FAF8F5]"
        >
          {(() => {
            const headline = settings.hero_headline;
            const isDefaultOrLegacy =
              !headline ||
              headline.includes('Beyond Events') ||
              headline.includes('Beyond Expectations') ||
              headline.includes('Monumental') ||
              headline.includes('Unforgettable Nights') ||
              headline.includes('Exquisite Celebrations');

            if (isDefaultOrLegacy) {
              return (
                <>
                  Exquisite Celebrations.{' '}
                  <span className="block font-serif italic gold-gradient-text mt-1">
                    Bespoke Event Architecture.
                  </span>
                </>
              );
            }

            const parts = headline.split(/\. |\n/);
            if (parts.length >= 2) {
              return (
                <>
                  {parts[0]}.{' '}
                  <span className="block font-serif italic gold-gradient-text mt-1">
                    {parts.slice(1).join('. ')}
                  </span>
                </>
              );
            }

            return headline;
          })()}
        </motion.h1>

        {/* Interactive CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.5 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          {/* Radiant Primary CTA Button */}
          <button
            type="button"
            onClick={() => scrollTo('contact')}
            className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2.5 overflow-hidden rounded-sm bg-gradient-to-r from-[#FFA01C] via-[#FFB84D] to-[#E68A00] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#08080A] shadow-[0_0_25px_rgba(255,160,28,0.35)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,160,28,0.55)] hover:scale-[1.02]"
          >
            <span>Plan Your Event</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Secondary Glass CTA */}
          <button
            type="button"
            onClick={() => scrollTo('portfolio')}
            className="inline-flex w-full sm:w-auto items-center justify-center border border-[#FFA01C]/50 bg-[#121217]/80 px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#FAF8F5] backdrop-blur-md transition-all duration-300 hover:border-[#FFA01C] hover:bg-[#FFA01C]/15 hover:text-[#FFA01C]"
          >
            Explore Our Work
          </button>

          {/* Watch Showreel Action */}
          <button
            type="button"
            onClick={() => setShowreelOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2.5 text-xs uppercase tracking-[0.18em] text-[#FAF8F5]/90 hover:text-[#FFA01C] transition-colors cursor-pointer group"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#FFA01C]/60 bg-[#FFA01C]/15 text-[#FFA01C] group-hover:scale-110 group-hover:bg-[#FFA01C] group-hover:text-[#08080A] transition-all">
              <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
            </span>
            <span className="group-hover:text-[#FFA01C] transition-colors font-medium text-[11px]">Watch Showreel</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Subtle Bottom Scroll Hint */}
      <div className="relative z-10 w-full pb-8 pt-4 flex justify-center">
        <button
          type="button"
          onClick={() => scrollTo('stats')}
          aria-label="Scroll down to explore"
          className="group inline-flex flex-col items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[#FAF8F5]/60 hover:text-[#FFA01C] transition-colors"
        >
          <span className="group-hover:tracking-[0.35em] transition-all">Scroll</span>
          <ArrowDown className="h-3.5 w-3.5 animate-bounce text-[#FFA01C]" />
        </button>
      </div>

      {/* Cinematic Fullscreen Showreel Modal */}
      <AnimatePresence>
        {showreelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-xl"
            onClick={() => setShowreelOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl w-full border border-[#FFA01C]/50 bg-[#08080A] rounded-xl overflow-hidden shadow-[0_0_60px_rgba(255,160,28,0.25)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#121217]">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#FFA01C] animate-pulse" />
                  <span className="text-xs uppercase tracking-[0.25em] text-[#FFA01C] font-medium">
                    Defining Events • Live Event Showreel
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowreelOpen(false)}
                  aria-label="Close Showreel"
                  className="flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/70 hover:text-[#FFA01C] border border-white/10 hover:border-[#FFA01C]/60 rounded transition-all cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Close</span>
                </button>
              </div>

              {/* Video Player Container */}
              <div className="aspect-video w-full bg-black overflow-hidden relative">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="Defining Events Showreel"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : (
                  <video
                    key={videoSrc}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover"
                  >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support HTML5 video playback.
                  </video>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
