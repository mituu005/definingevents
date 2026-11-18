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
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded border border-[#FFA01C]/40 bg-[#08080A] p-0.5 shadow-md transition-all duration-300 group-hover:border-[#FFA01C] group-hover:shadow-[0_0_20px_rgba(255,160,28,0.35)]">
        <img
          src="/logo.png"
          alt="Defining Events Logo"
          className="h-full w-full object-contain"
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
          <span className={`text-[9.5px] font-medium tracking-[0.28em] uppercase mt-1 ${subColor}`}>
            Bespoke Event Production
          </span>
        )}
      </div>
    </div>
  );
}
