import { useSiteData } from '@/contexts/SiteDataContext';

export function ClientLogosSection() {
  const { settings } = useSiteData();
  const logos = settings.client_logos || [];

  // Strictly hide if no genuine client/partner logos have been added
  if (logos.length === 0) return null;

  return (
    <section
      aria-label="Clients and Brand Associations"
      className="border-y border-white/5 bg-[#0D0D12] py-16 text-[#FAF8F5]"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <p className="text-center text-[14px] uppercase tracking-[0.35em] text-[#FFA01C]/80 mb-10 font-medium">
          Trusted By Leading Private Clients &amp; Global Houses
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {logos.map((logo) => (
            <div
              key={logo.id}
              className="flex h-16 w-full items-center justify-center px-4 opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(255,160,28,0.3)]"
            >
              <img
                src={logo.logo_url}
                alt={logo.name}
                loading="lazy"
                className="max-h-12 w-auto object-contain brightness-90 hover:brightness-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
