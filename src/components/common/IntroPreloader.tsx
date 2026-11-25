import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';

export function IntroPreloader() {
  const { settings } = useSiteData();
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('de_intro_seen');
  });

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('de_intro_seen', '1');
    }, 1150);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9990] flex flex-col items-center justify-center bg-[#08080A] text-[#FAF8F5]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,160,28,0.12),transparent_70%)] pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center px-6 relative z-10 flex flex-col items-center"
          >
            <img
              src="/logo.png"
              alt="Defining Events Logo"
              className="w-16 h-16 object-contain mb-4 drop-shadow-[0_0_20px_rgba(255,160,28,0.4)]"
            />
            <p className="text-[14px] uppercase tracking-[0.45em] text-[#FFA01C] mb-2 font-medium">
              Bespoke Event Architecture
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.18em] uppercase font-light text-[#FAF8F5]">
              {settings.company_name}
            </h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-5 h-[1.5px] w-48 origin-center bg-gradient-to-r from-transparent via-[#FFA01C] to-transparent shadow-[0_0_12px_rgba(255,160,28,0.6)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
