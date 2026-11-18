import { ArrowLeft, Calendar, Check, Film, Images, MapPin, Maximize2, Quote } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BeforeAfterSlider } from '@/components/common/BeforeAfterSlider';
import { LightboxGallery, type LightboxItem } from '@/components/common/LightboxGallery';
import { ScrollProgressAndUtilities } from '@/components/common/ScrollProgressAndUtilities';
import { Footer } from '@/components/public/Footer';
import { Navbar } from '@/components/public/Navbar';
import { useSiteData } from '@/contexts/SiteDataContext';
import { fetchPublishedEventBySlug } from '@/lib/api';
import type { EventRecord } from '@/types/database';

export function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { setPreselectedEventType } = useSiteData();

  const [event, setEvent] = useState<EventRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchPublishedEventBySlug(slug)
      .then((res) => {
        setEvent(res);
        if (res) {
          document.title = `${res.title} | Defining Events Portfolio`;
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load event.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const photos = useMemo(
    () => (event?.media || []).filter((m) => m.media_type === 'image'),
    [event]
  );
  const videos = useMemo(
    () => (event?.media || []).filter((m) => m.media_type === 'video'),
    [event]
  );

  const lightboxItems = useMemo<LightboxItem[]>(() => {
    if (!event) return [];
    const items: LightboxItem[] = [];
    if (event.resolved_cover_url) {
      items.push({
        id: 'cover',
        url: event.resolved_cover_url,
        type: 'image',
        caption: `${event.title} — Featured Cover`,
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
    return items;
  }, [event]);

  const handlePlanSimilar = () => {
    if (event) {
      setPreselectedEventType(event.category);
    }
    navigate('/#contact');
    window.setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-[#FAF8F5] selection:bg-[#FFA01C]/30 selection:text-[#FFA01C]">
      <Navbar />

      {loading && (
        <div className="pt-36 pb-28 mx-auto max-w-6xl px-6">
          <div className="h-12 w-72 bg-white/5 animate-pulse mb-6 rounded" />
          <div className="aspect-[16/9] w-full bg-white/5 animate-pulse rounded-lg" />
        </div>
      )}

      {!loading && (error || !event) && (
        <div className="pt-40 pb-32 mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#FFA01C] mb-3">
            Portfolio Archive
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#FAF8F5]">
            {error ? 'Unable to Load Event' : 'Event Not Found'}
          </h1>
          <p className="mt-4 text-sm text-[#FAF8F5]/70">
            {error || 'This portfolio case study may have been unpublished or moved.'}
          </p>
          <Link
            to="/#portfolio"
            className="mt-8 inline-flex items-center gap-2 border border-[#FFA01C] px-6 py-3 text-xs uppercase tracking-[0.22em] text-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      )}

      {!loading && event && (
        <main>
          {/* Editorial Hero Header */}
          <section className="relative bg-[#08080A] text-[#FAF8F5] pt-32 pb-16 sm:pb-24 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50_0%,rgba(255,160,28,0.1),transparent_70%)] pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
              <Link
                to="/#portfolio"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#FFA01C] hover:text-[#FAF8F5] transition-colors mb-8"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Portfolio</span>
              </Link>

              <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.22em] text-[#FAF8F5]/70 mb-4">
                <span className="border border-[#FFA01C]/50 bg-[#FFA01C]/10 px-3 py-1 text-[#FFA01C] rounded-full">
                  {event.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#FAF8F5]/80">
                  <MapPin className="h-3.5 w-3.5 text-[#FFA01C]" />
                  {event.location}
                </span>
                {event.event_date && (
                  <span className="inline-flex items-center gap-1.5 text-[#FAF8F5]/80">
                    <Calendar className="h-3.5 w-3.5 text-[#FFA01C]" />
                    {new Date(event.event_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.06] max-w-5xl text-[#FAF8F5]">
                {event.title}
              </h1>

              {event.resolved_cover_url && (
                <div className="mt-10 relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-[#121217] shadow-2xl">
                  <img
                    src={event.resolved_cover_url}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  {lightboxItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(0)}
                      className="absolute bottom-5 right-5 inline-flex items-center gap-2 border border-[#FFA01C]/60 bg-[#08080A]/90 backdrop-blur-md px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-[#FAF8F5] hover:bg-[#FFA01C] hover:text-[#08080A] transition-all rounded shadow-lg"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>Full-Screen Gallery ({lightboxItems.length})</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Narrative & Creative Concept */}
          <section className="py-20 bg-[#0D0D12] border-t border-white/5">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#FFA01C] mb-3 font-medium">
                    The Commission
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed text-[#FAF8F5]/85 whitespace-pre-line font-light">
                    {event.description}
                  </p>
                </div>

                {event.creative_concept && (
                  <div className="border-t border-white/10 pt-8">
                    <p className="text-xs uppercase tracking-[0.28em] text-[#FFA01C] mb-3 font-medium">
                      Creative Concept &amp; Direction
                    </p>
                    <p className="text-base leading-relaxed text-[#FAF8F5]/85 whitespace-pre-line font-light">
                      {event.creative_concept}
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5">
                <div className="border border-white/10 bg-[#121217] rounded-xl p-8 space-y-6 shadow-xl">
                  <h2 className="font-serif text-2xl text-[#FAF8F5]">Production Dossier</h2>

                  {event.services_provided && event.services_provided.length > 0 && (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#FFA01C] mb-3 font-medium">
                        Services Provided
                      </p>
                      <ul className="space-y-2.5">
                        {event.services_provided.map((srv) => (
                          <li key={srv} className="flex items-start gap-2.5 text-sm text-[#FAF8F5]/90">
                            <Check className="h-4 w-4 shrink-0 text-[#FFA01C] mt-0.5" />
                            <span>{srv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10 flex items-center gap-6 text-xs uppercase tracking-[0.18em] text-[#FAF8F5]/70">
                    <span className="inline-flex items-center gap-1.5">
                      <Images className="h-4 w-4 text-[#FFA01C]" />
                      {photos.length} Photographs
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Film className="h-4 w-4 text-[#FFA01C]" />
                      {videos.length} Videos
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handlePlanSimilar}
                    className="w-full bg-[#FFA01C] text-[#08080A] font-medium py-3.5 text-xs uppercase tracking-[0.22em] hover:bg-[#FFB247] shadow-[0_0_20px_rgba(255,160,28,0.3)] transition-all rounded"
                  >
                    Plan a Similar Event
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Before & After Transformation (Optional) */}
          {event.resolved_before_url && event.resolved_after_url && (
            <section className="py-16 bg-[#08080A] border-y border-white/5">
              <div className="mx-auto max-w-6xl px-6 sm:px-8">
                <p className="text-xs uppercase tracking-[0.28em] text-[#FFA01C] mb-2 font-medium">
                  Spatial Transformation
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] mb-8">
                  Before &amp; After Production
                </h2>
                <BeforeAfterSlider
                  beforeUrl={event.resolved_before_url}
                  afterUrl={event.resolved_after_url}
                />
              </div>
            </section>
          )}

          {/* Photo Gallery */}
          {photos.length > 0 && (
            <section className="py-20 bg-[#08080A]">
              <div className="mx-auto max-w-7xl px-6 sm:px-8">
                <p className="text-xs uppercase tracking-[0.28em] text-[#FFA01C] mb-2 font-medium">
                  Photographic Archive
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] mb-10">
                  Gallery
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photos.map((photo) => {
                    const url = photo.signed_url || photo.file_url;
                    const lbIdx = lightboxItems.findIndex((item) => item.id === photo.id);
                    return (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => setLightboxIndex(lbIdx >= 0 ? lbIdx : 0)}
                        className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-[#121217] text-left shadow-lg"
                      >
                        <img
                          src={url}
                          alt={photo.caption || event.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[#08080A]/0 group-hover:bg-[#08080A]/50 transition-colors flex items-end p-4">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase tracking-[0.22em] text-[#08080A] bg-[#FFA01C] font-medium px-2.5 py-1 rounded">
                            Expand
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <section className="py-20 bg-[#0D0D12] text-[#FAF8F5] border-t border-white/5">
              <div className="mx-auto max-w-7xl px-6 sm:px-8">
                <p className="text-xs uppercase tracking-[0.28em] text-[#FFA01C] mb-2 font-medium">
                  Motion &amp; Atmosphere
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl mb-10 text-[#FAF8F5]">Event Films</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {videos.map((vid) => (
                    <div key={vid.id} className="border border-white/10 bg-[#121217] p-3 rounded-lg shadow-lg">
                      <video
                        src={vid.signed_url || vid.file_url}
                        controls
                        playsInline
                        preload="metadata"
                        className="aspect-video w-full bg-black rounded"
                      />
                      {vid.caption && (
                        <p className="mt-3 px-2 text-xs text-[#FAF8F5]/80">{vid.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Optional Client Testimonial */}
          {event.client_testimonial && (
            <section className="py-20 bg-[#121217] text-[#FAF8F5] border-t border-white/10">
              <div className="mx-auto max-w-4xl px-6 text-center">
                <Quote className="mx-auto h-8 w-8 text-[#FFA01C] mb-6" />
                <blockquote className="font-serif text-2xl sm:text-3xl italic leading-relaxed text-[#FAF8F5]">
                  “{event.client_testimonial}”
                </blockquote>
                {event.client_testimonial_author && (
                  <p className="mt-6 text-xs uppercase tracking-[0.24em] text-[#FFA01C]">
                    — {event.client_testimonial_author}
                  </p>
                )}
              </div>
            </section>
          )}
        </main>
      )}

      <Footer />
      <ScrollProgressAndUtilities />

      <LightboxGallery
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </div>
  );
}
