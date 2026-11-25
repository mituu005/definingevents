import { useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Before Transformation',
  afterLabel = 'Final Execution',
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative w-full overflow-hidden border border-[#B18A55]/30 select-none bg-[#14251F]">
      <div className="relative aspect-[16/9] w-full">
        <img
          src={afterUrl}
          alt={afterLabel}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={beforeUrl}
            alt={beforeLabel}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Labels */}
        <span className="absolute top-4 left-4 bg-[#14251F]/85 px-3 py-1 text-[13px] uppercase tracking-[0.22em] text-[#EAE4D8] border border-[#B18A55]/40">
          {beforeLabel}
        </span>
        <span className="absolute top-4 right-4 bg-[#14251F]/85 px-3 py-1 text-[13px] uppercase tracking-[0.22em] text-[#B18A55] border border-[#B18A55]/40">
          {afterLabel}
        </span>

        {/* Divider line & handle */}
        <div
          className="absolute inset-y-0 w-[1px] bg-[#B18A55] pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-[#B18A55] bg-[#14251F] text-[#B18A55]">
            <MoveHorizontal className="h-4 w-4" />
          </div>
        </div>

        <input
          type="range"
          min={5}
          max={95}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label="Compare before and after event transformation"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
    </div>
  );
}
