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
      className="relative bg-[#08080A] text-[#FAF8F5] py-24 sm:py-32 border-t border-[#FFA01C]/20 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse,_rgba(255,160,28,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFA01C]/40 bg-[#FFA01C]/10 px-4 py-1.5 text-[10.5px] uppercase tracking-[0.3em] text-[#FFA01C] mb-4">
            <Award className="h-3.5 w-3.5 text-[#FFA01C]" />
            <span>Trusted By Discerning Families & Global Hosts</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
            Enduring Impressions.{' '}
            <span className="gold-gradient-text italic font-serif">Verified Reflections.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#FAF8F5]/75 font-light leading-relaxed">
            The true hallmark of our atelier is the peace of mind and wonder experienced by the
            hosts who entrust us with life’s most meaningful celebrations.
          </p>

          {/* Trust Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg border border-white/10 bg-[#121217]/70 backdrop-blur-md">
            <div className="text-center">
              <p className="text-lg sm:text-xl font-serif text-[#FFA01C] font-semibold">100%</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#FAF8F5]/60 mt-0.5">
                5-Star Rated
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-serif text-[#FFA01C] font-semibold">500+</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#FAF8F5]/60 mt-0.5">
                Landmarks Produced
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-serif text-[#FFA01C] font-semibold">28+</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#FAF8F5]/60 mt-0.5">
                World Capitals
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-serif text-[#FFA01C] font-semibold">Flawless</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#FAF8F5]/60 mt-0.5">
                Run of Show
              </p>
            </div>
          </div>
        </div>

        {/* 3-Column Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {list.slice(0, 3).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="relative flex flex-col justify-between rounded-xl border border-[#FFA01C]/25 bg-gradient-to-b from-[#14141C] to-[#0E0E14] p-7 sm:p-8 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-[#FFA01C]/60 hover:shadow-[0_0_30px_rgba(255,160,28,0.15)] group"
            >
              {/* Subtle top quote watermark */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-[#FFA01C]/15 group-hover:text-[#FFA01C]/25 transition-colors" />

              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[#FFA01C] text-[#FFA01C] drop-shadow-[0_0_4px_rgba(255,160,28,0.4)]"
                    />
                  ))}
                  <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-[#FFA01C] font-medium">
                    <CheckCircle2 className="h-3 w-3" /> Verified Host
                  </span>
                </div>

                {/* Quote Text */}
                <p className="font-serif text-base sm:text-lg leading-relaxed text-[#FAF8F5]/90 italic font-normal">
                  “{item.quote}”
                </p>
              </div>

              {/* Host Profile Footer */}
              <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {item.client_photo_url ? (
                    <img
                      src={item.client_photo_url}
                      alt={item.client_name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-[#FFA01C]/60 shrink-0"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFA01C]/15 border border-[#FFA01C]/60 text-[#FFA01C] font-serif font-bold text-base shrink-0">
                      {item.client_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFA01C]">
                      {item.client_name}
                    </h3>
                    <p className="text-[11px] text-[#FAF8F5]/60 tracking-wider mt-0.5 line-clamp-1">
                      {item.event_type}
                    </p>
                  </div>
                </div>

                {item.video_url && (
                  <button
                    type="button"
                    onClick={() => setVideoModalUrl(item.video_url)}
                    className="p-2 rounded-full bg-[#FFA01C]/15 text-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors shrink-0"
                    title="Watch video review"
                  >
                    <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
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
