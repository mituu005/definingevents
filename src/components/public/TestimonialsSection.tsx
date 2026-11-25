import { motion } from 'framer-motion';
import { Award, CheckCircle2, Play, Quote, Star, X } from 'lucide-react';
import { useState } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';
import { DEFAULT_TESTIMONIALS } from '@/lib/defaults';

export function TestimonialsSection() {
  const { testimonials } = useSiteData();
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);

  const list = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <section
      id="testimonials"
      className="relative bg-[#08080A] text-[#FAF8F5] py-10 sm:py-14 border-t border-[#FFA01C]/15 overflow-hidden scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,_rgba(255,160,28,0.06)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFA01C]/40 bg-[#FFA01C]/10 px-3.5 py-1 text-[13px] uppercase tracking-[0.25em] text-[#FFA01C] mb-3">
            <Award className="h-3 w-3 text-[#FFA01C]" />
            <span>Trusted By Discerning Families & Global Hosts</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-tight">
            Enduring Impressions.{' '}
            <span className="gold-gradient-text italic font-serif">Verified Reflections.</span>
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#FAF8F5]/70 font-light leading-relaxed">
            The true hallmark of our atelier is the peace of mind and wonder experienced by the
            hosts who entrust us with life’s most meaningful celebrations.
          </p>
        </div>

        {/* 3-Column Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {list.slice(0, 3).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative flex flex-col justify-between rounded-xl border border-[#FFA01C]/25 bg-gradient-to-b from-[#14141C] to-[#0E0E14] p-5 sm:p-6 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#FFA01C]/60 hover:shadow-[0_0_25px_rgba(255,160,28,0.15)] group"
            >
              {/* Subtle top quote watermark */}
              <Quote className="absolute top-5 right-5 h-6 w-6 text-[#FFA01C]/15 group-hover:text-[#FFA01C]/25 transition-colors" />

              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-3.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-[#FFA01C] text-[#FFA01C] drop-shadow-[0_0_4px_rgba(255,160,28,0.4)]"
                    />
                  ))}
                  <span className="ml-2 inline-flex items-center gap-1 text-[12.5px] uppercase tracking-[0.15em] text-[#FFA01C] font-medium">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Verified Host
                  </span>
                </div>

                {/* Quote Text */}
                <p className="font-serif text-[16.5px] sm:text-base md:text-[17.5px] leading-relaxed text-[#FAF8F5]/85 italic font-normal">
                  “{item.quote}”
                </p>
              </div>

              {/* Host Profile Footer */}
              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {item.client_photo_url ? (
                    <img
                      src={item.client_photo_url}
                      alt={item.client_name}
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover border border-[#FFA01C]/60 shrink-0"
                    />
                  ) : (
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#FFA01C]/15 border border-[#FFA01C]/60 text-[#FFA01C] font-serif font-bold text-sm shrink-0">
                      {item.client_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-[14px] sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#FFA01C]">
                      {item.client_name}
                    </h3>
                    <p className="text-[13px] text-[#FAF8F5]/55 tracking-wider mt-0.5 line-clamp-1">
                      {item.event_type}
                    </p>
                  </div>
                </div>

                {item.video_url && (
                  <button
                    type="button"
                    onClick={() => setVideoModalUrl(item.video_url)}
                    className="p-1.5 rounded-full bg-[#FFA01C]/15 text-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors shrink-0"
                    title="Watch video review"
                  >
                    <Play className="h-3 w-3 fill-current ml-0.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {videoModalUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setVideoModalUrl(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#08080A] border border-[#FFA01C]/40 p-2 rounded-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setVideoModalUrl(null)}
              aria-label="Close video testimonial"
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center border border-[#FFA01C]/50 bg-[#08080A] text-[#FAF8F5] hover:bg-[#FFA01C] hover:text-[#08080A]"
            >
              <X className="h-4 w-4" />
            </button>
            <video src={videoModalUrl} controls autoPlay className="w-full max-h-[75vh]" />
          </div>
        </div>
      )}
    </section>
  );
}
