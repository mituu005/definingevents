import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Film, Images, MapPin, Maximize2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BeforeAfterSlider } from '@/components/common/BeforeAfterSlider';
import { LightboxGallery, type LightboxItem } from '@/components/common/LightboxGallery';
import { useSiteData } from '@/contexts/SiteDataContext';
import { EVENT_CATEGORIES, type EventRecord } from '@/types/database';

export function PortfolioSection() {
  const { events, settings, loading } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);

  const categories = ['All', ...EVENT_CATEGORIES];

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'All') return events;
    return events.filter((ev) => ev.category === selectedCategory);
  }, [events, selectedCategory]);

  const transformationEvent = useMemo(
    () => events.find((ev) => ev.resolved_before_url && ev.resolved_after_url),
    [events]
  );

  const openEventLightbox = (event: EventRecord) => {
    const items: LightboxItem[] = [];
    if (event.resolved_cover_url) {
      items.push({
        id: `${event.id}-cover`,
        url: event.resolved_cover_url,
        type: 'image',
        caption: `${event.title} — ${event.location}`,
      });
    }
    for (const m of event.media || []) {
      const url = m.signed_url || m.file_url;
      if (!url) continue;
      items.push({
        id: m.id,
        url,
        type: m.media_type,
        caption: m.caption || event.title,
      });
    }
    if (items.length > 0) {
      setLightboxItems(items);
      setLightboxIndex(0);
    }
  };

  return (
    <section id="portfolio" className="bg-[#08080A] text-[#FAF8F5] py-12 sm:py-16 border-t border-[#FFA01C]/15 scroll-mt-20 sm:scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 pb-5 border-b border-[#FFA01C]/20">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[13.5px] uppercase tracking-[0.3em] text-[#FFA01C] mb-2 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFA01C]" />
              <span>Selected Commissions</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight">
              Featured Event <span className="gold-gradient-text italic font-serif">Portfolio</span>
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-[16px] leading-relaxed text-[#FAF8F5]/75 font-light">
            Every celebration in our archive is dynamically published from our studio database—tailored
            exclusively to its architecture, venue, and host.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-8">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-[13px] uppercase tracking-[0.2em] rounded-sm transition-all duration-300 font-medium ${
                  active
                    ? 'border border-[#FFA01C] bg-[#FFA01C] text-[#08080A] shadow-[0_0_15px_rgba(255,160,28,0.4)]'
                    : 'border border-[#FFA01C]/25 bg-[#121217]/60 text-[#FAF8F5]/70 hover:border-[#FFA01C] hover:text-[#FFA01C]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 aspect-[16/10] bg-[#121217] animate-pulse rounded-sm border border-[#FFA01C]/15" />
            <div className="md:col-span-5 aspect-[4/5] bg-[#121217] animate-pulse rounded-sm border border-[#FFA01C]/15" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEvents.length === 0 && (
          <div className="rounded-sm border border-[#FFA01C]/25 bg-[#121217]/80 p-12 sm:p-16 text-center backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.28em] text-[#FFA01C] font-semibold mb-3">
              Portfolio Archive
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5]">
              {selectedCategory === 'All'
                ? 'Published events will appear here automatically.'
                : `No published events in "${selectedCategory}" yet.`}
            </h3>
            <p className="mt-3 max-w-lg mx-auto text-sm text-[#FAF8F5]/70 font-light">
              Once you log into the Admin Dashboard and publish a portfolio event with photographs and videos, it immediately showcases here in real time.
            </p>
            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="mt-6 border border-[#FFA01C] px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
              >
                View All Categories
              </button>
            )}
          </div>
        )}

        {/* Asymmetrical Editorial Grid */}
        {!loading && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {filteredEvents.map((event, idx) => {
              const patternIndex = idx % 4;
              const colSpanClass =
                patternIndex === 0 || patternIndex === 3 ? 'lg:col-span-7' : 'lg:col-span-5';
              const aspectClass =
                patternIndex === 0 || patternIndex === 3
                  ? 'aspect-[16/10]'
                  : 'aspect-[4/4.3]';

              const mediaList = event.media || [];
              const firstVideo = mediaList.find((m) => m.media_type === 'video');
              const photoCount = mediaList.filter((m) => m.media_type === 'image').length;
              const videoCount = mediaList.filter((m) => m.media_type === 'video').length;
              const coverSrc =
                event.resolved_cover_url ||
                mediaList.find((m) => m.media_type === 'image')?.signed_url ||
                '';

              return (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.65, delay: Math.min(idx * 0.06, 0.25) }}
                  onMouseEnter={() => firstVideo && setHoveredVideoId(event.id)}
                  onMouseLeave={() => setHoveredVideoId(null)}
                  className={`${colSpanClass} group flex flex-col rounded-sm border border-[#FFA01C]/20 bg-[#121217]/70 backdrop-blur-md transition-all duration-300 hover:border-[#FFA01C] hover:shadow-[0_10px_40px_rgba(255,160,28,0.2)]`}
                >
                  <div className={`relative ${aspectClass} overflow-hidden bg-[#08080A]`}>
                    {hoveredVideoId === event.id && firstVideo?.signed_url ? (
                      <video
                        src={firstVideo.signed_url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : coverSrc ? (
                      <img
                        src={coverSrc}
                        alt={event.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#121217] text-xs uppercase tracking-widest text-[#FFA01C]">
                        {event.category}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080A]/85 via-transparent to-transparent opacity-80" />

                    {/* Category Pill */}
                    <span className="absolute top-4 left-4 rounded-sm bg-[#08080A]/90 backdrop-blur-sm border border-[#FFA01C]/50 px-3 py-1 text-[13px] uppercase tracking-[0.22em] text-[#FFA01C] font-semibold">
                      {event.category}
                    </span>

                    {/* Media indicators & quick lightbox */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      {photoCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-sm bg-[#08080A]/90 border border-[#FFA01C]/30 px-2.5 py-1 text-[13px] text-[#FAF8F5]">
                          <Images className="h-3 w-3 text-[#FFA01C]" />
                          {photoCount}
                        </span>
                      )}
                      {videoCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-sm bg-[#08080A]/90 border border-[#FFA01C]/30 px-2.5 py-1 text-[13px] text-[#FAF8F5]">
                          <Film className="h-3 w-3 text-[#FFA01C]" />
                          {videoCount}
                        </span>
                      )}
                      {(coverSrc || mediaList.length > 0) && (
                        <button
                          type="button"
                          onClick={() => openEventLightbox(event)}
                          aria-label={`Open gallery for ${event.title}`}
                          className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#08080A]/90 border border-[#FFA01C]/50 text-[#FAF8F5] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                    <div>
                      <div className="flex flex-wrap items-center gap-4 text-[14px] uppercase tracking-[0.18em] text-[#FAF8F5]/65">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#FFA01C]" />
                          {event.location}
                        </span>
                        {event.event_date && (
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#FFA01C]" />
                            {new Date(event.event_date).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>

                      <Link to={`/events/${event.slug}`} className="block mt-3">
                        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#FAF8F5] group-hover:text-[#FFA01C] transition-colors">
                          {event.title}
                        </h3>
                      </Link>

                      <p className="mt-3 text-sm leading-relaxed text-[#FAF8F5]/75 line-clamp-2 font-light">
                        {event.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#FFA01C]/15 flex items-center justify-between">
                      <Link
                        to={`/events/${event.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#FFA01C] hover:text-[#FAF8F5] transition-colors"
                      >
                        <span>Explore Case Study</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Optional Before & After Transformation */}
        {transformationEvent &&
          transformationEvent.resolved_before_url &&
          transformationEvent.resolved_after_url && (
            <div className="mt-20 pt-16 border-t border-[#FFA01C]/20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#FFA01C] font-semibold mb-2">
                    Spatial Alchemy
                  </p>
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5]">
                    Venue Transformation: {transformationEvent.title}
                  </h3>
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#FAF8F5]/60">
                  Drag slider to inspect production build
                </p>
              </div>
              <BeforeAfterSlider
                beforeUrl={transformationEvent.resolved_before_url}
                afterUrl={transformationEvent.resolved_after_url}
              />
            </div>
          )}

        {/* Optional Website Highlights Gallery */}
        {settings.website_gallery && settings.website_gallery.length > 0 && (
          <div className="mt-20 pt-16 border-t border-[#FFA01C]/20">
            <p className="text-xs uppercase tracking-[0.28em] text-[#FFA01C] font-semibold mb-2">
              Studio Highlights
            </p>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] mb-8">
              Curated Visual Moments
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {settings.website_gallery.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setLightboxItems(
                      settings.website_gallery.map((g) => ({
                        id: g.id,
                        url: g.image_url,
                        type: 'image',
                        caption: `${g.title}${g.category ? ` — ${g.category}` : ''}`,
                      }))
                    );
                    setLightboxIndex(idx);
                  }}
                  className="group relative aspect-square overflow-hidden rounded-sm border border-[#FFA01C]/25 bg-[#121217]"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#08080A]/0 group-hover:bg-[#08080A]/50 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <LightboxGallery
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </section>
  );
}
