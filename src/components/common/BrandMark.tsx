import { useSiteData } from '@/contexts/SiteDataContext';

interface BrandMarkProps {
  tone?: 'light' | 'dark';
  compact?: boolean;
}

export function BrandMark({ tone = 'light', compact = false }: BrandMarkProps) {
  const { settings } = useSiteData();
  const textColor = tone === 'light' ? 'text-[#FAF8F5]' : 'text-[#08080A]';
  const subColor = tone === 'light' ? 'text-[#FFA01C]' : 'text-[#C84B31]';

  return (
    <div className="flex items-center gap-3 group">
      {/* Official Brand Logo Icon */}
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#FFA01C]/80 bg-gradient-to-b from-[#FAF8F5] via-[#F5EFE6] to-[#EAE0D0] p-1 shadow-[0_0_16px_rgba(255,160,28,0.3)] transition-all duration-300 group-hover:border-[#FFA01C] group-hover:shadow-[0_0_25px_rgba(255,160,28,0.5)]">
        <img
          src="/logo.png"
          alt="Defining Events Logo"
          className="relative z-10 h-full w-full object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
          onError={(e) => {
            // Fallback to stylized monogram if image path fails
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="hidden font-serif text-lg font-bold text-[#FFA01C]">D</span>
      </div>

      {/* Brand Typographic Identity */}
      <div className="flex flex-col leading-none whitespace-nowrap">
        <span
          className={`font-serif text-base xl:text-lg font-semibold tracking-[0.16em] uppercase ${textColor}`}
        >
          {settings.company_name || 'Defining Events'}
        </span>
        {!compact && (
          <span className={`text-[12.5px] font-medium tracking-[0.28em] uppercase mt-1 ${subColor}`}>
            Bespoke Event Production
          </span>
        )}
      </div>
    </div>
  );
}
