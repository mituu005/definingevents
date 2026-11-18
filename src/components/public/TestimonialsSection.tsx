import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Quote, X } from 'lucide-react';
import { useState } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';

export function TestimonialsSection() {
  const { testimonials } = useSiteData();
  const [index, setIndex] = useState(0);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);

  if (testimonials.length === 0) {
    if (!import.meta.env.DEV) return null;

    return (
      <section
        id="testimonials"
        className="bg-[#08080A] text-[#FAF8F5] py-20 border-t border-[#FFA01C]/15"
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#FFA01C] mb-3 font-semibold">
            Client Reflections (Development Notice)
          </p>
          <p className="font-serif text-2xl text-[#FAF8F5]/85">
            No client testimonials have been published yet.
          </p>
          <p className="mt-2 text-xs text-[#FAF8F5]/50">
            Add genuine client reviews or video testimonials in the Admin Dashboard under Website
            Content. This section automatically hides in production when empty.
          </p>
        </div>
      </section>
    );
  }

  const current = testimonials[index % testimonials.length];

  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);

  return (
    <section id="testimonials" className="bg-[#08080A] text-[#FAF8F5] py-28 sm:py-36 border-t border-[#FFA01C]/15">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-[#FFA01C] mb-3 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFA01C]" />
            <span>Client Reflections</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal">
            Words From Our <span className="gold-gradient-text italic font-serif">Hosts &amp; Partners</span>
          </h2>
        </div>

        <div className="relative rounded-sm border border-[#FFA01C]/30 bg-[#121217]/90 p-8 sm:p-14 backdrop-blur-md shadow-2xl">
          <Quote className="h-10 w-10 text-[#FFA01C]/50 mb-6 mx-auto" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <blockquote className="font-serif text-2xl sm:text-3xl leading-relaxed text-[#FAF8F5] font-normal italic">
                “{current.quote}”
              </blockquote>

              <div className="mt-8 flex flex-col items-center gap-3">
                {current.client_photo_url && (
                  <img
                    src={current.client_photo_url}
                    alt={current.client_name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-[#FFA01C]"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FFA01C]">
                    {current.client_name}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#FAF8F5]/65 mt-1">
                    {current.event_type}
                    {current.client_role ? ` · ${current.client_role}` : ''}
                  </p>
                </div>

                {current.video_url && (
                  <button
                    type="button"
                    onClick={() => setVideoModalUrl(current.video_url)}
                    className="mt-3 inline-flex items-center gap-2 rounded-sm border border-[#FFA01C]/60 bg-[#FFA01C]/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Watch Video Testimonial</span>
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {testimonials.length > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#FFA01C]/40 text-[#FAF8F5] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs uppercase tracking-[0.2em] text-[#FFA01C]">
                {(index % testimonials.length) + 1} / {testimonials.length}
              </span>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#FFA01C]/40 text-[#FAF8F5] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
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
