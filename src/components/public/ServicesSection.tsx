import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';
import type { ServiceRecord } from '@/types/database';

export function ServicesSection() {
  const { services, setPreselectedEventType } = useSiteData();
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);

  const handleEnquire = (serviceTitle: string) => {
    setPreselectedEventType(serviceTitle);
    setSelectedService(null);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="bg-[#08080A] text-[#FAF8F5] py-12 sm:py-16 border-t border-[#FFA01C]/15 scroll-mt-20 sm:scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-5 border-b border-[#FFA01C]/20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.3em] text-[#FFA01C] mb-2 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFA01C]" />
              <span>Bespoke Disciplines</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight">
              Curated Services &amp;{' '}
              <span className="gold-gradient-text italic font-serif">Production</span>
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-[13px] leading-relaxed text-[#FAF8F5]/75 font-light">
            Every celebration is architected from initial spatial concept through minute-by-minute
            show calling with bespoke creative direction.
          </p>
        </div>

        {/* Compact Services Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {services.map((service, idx) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, delay: Math.min(idx * 0.04, 0.25) }}
              className="group flex flex-col justify-between rounded-lg border border-[#FFA01C]/25 bg-[#121217]/85 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-[#FFA01C] hover:shadow-[0_4px_25px_rgba(255,160,28,0.18)] hover:-translate-y-0.5"
            >
              <div>
                {/* Compact Media Header */}
                <div className="relative h-32 w-full overflow-hidden bg-[#08080A]">
                  {service.cover_image_url ? (
                    <img
                      src={service.cover_image_url}
                      alt={service.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#121217] text-xs uppercase tracking-widest text-[#FFA01C]">
                      {service.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-black/30" />
                  <span className="absolute top-2.5 left-2.5 rounded border border-[#FFA01C]/50 bg-[#08080A]/85 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-[#FFA01C] font-semibold">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Compact Content */}
                <div className="p-4 sm:p-4.5">
                  <h3 className="font-serif text-lg font-normal text-[#FAF8F5] group-hover:text-[#FFA01C] transition-colors line-clamp-1">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#FAF8F5]/70 font-light line-clamp-2">
                    {service.short_description}
                  </p>
                </div>
              </div>

              {/* Compact Footer */}
              <div className="flex items-center justify-between px-4 pb-3.5 pt-2 border-t border-white/5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="uppercase tracking-[0.16em] text-[#FAF8F5]/75 hover:text-[#FFA01C] transition-colors"
                >
                  View Scope
                </button>
                <button
                  type="button"
                  onClick={() => handleEnquire(service.title)}
                  className="inline-flex items-center gap-1 font-semibold uppercase tracking-[0.16em] text-[#FFA01C] hover:text-[#FAF8F5] transition-colors"
                >
                  <span>Enquire</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-sm border border-[#FFA01C]/40 bg-[#08080A] text-[#FAF8F5] shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            >
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                aria-label="Close service details"
                className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-sm border border-[#FFA01C]/40 bg-[#08080A]/90 text-[#FAF8F5] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {selectedService.cover_image_url && (
                <div className="aspect-[16/8] w-full overflow-hidden">
                  <img
                    src={selectedService.cover_image_url}
                    alt={selectedService.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="p-7 sm:p-10">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#FFA01C] font-semibold mb-2">
                  Service Discipline
                </p>
                <h3 className="font-serif text-3xl sm:text-4xl font-normal">
                  {selectedService.title}
                </h3>

                <p className="mt-5 text-base leading-relaxed text-[#FAF8F5]/85 font-light">
                  {selectedService.full_description || selectedService.short_description}
                </p>

                {selectedService.highlights && selectedService.highlights.length > 0 && (
                  <div className="mt-8 border-t border-[#FFA01C]/20 pt-6">
                    <h4 className="text-xs uppercase tracking-[0.22em] text-[#FFA01C] mb-4 font-semibold">
                      Key Capabilities
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedService.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-[#FAF8F5]/90">
                          <Check className="h-4 w-4 shrink-0 text-[#FFA01C] mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-9 flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => handleEnquire(selectedService.title)}
                    className="rounded-sm bg-gradient-to-r from-[#FFA01C] to-[#E68A00] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#08080A] hover:opacity-90 transition-opacity shadow-lg"
                  >
                    Enquire About {selectedService.title}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="rounded-sm border border-[#FAF8F5]/30 px-7 py-3.5 text-xs uppercase tracking-[0.22em] text-[#FAF8F5] hover:border-[#FFA01C] hover:text-[#FFA01C] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
