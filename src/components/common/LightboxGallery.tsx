import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect } from 'react';

export interface LightboxItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string | null;
}

interface LightboxGalleryProps {
  items: LightboxItem[];
  currentIndex: number | null;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export function LightboxGallery({
  items,
  currentIndex,
  onClose,
  onChangeIndex,
}: LightboxGalleryProps) {
  const isOpen = currentIndex !== null && items[currentIndex] !== undefined;

  useEffect(() => {
    if (!isOpen || currentIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChangeIndex((currentIndex + 1) % items.length);
      if (e.key === 'ArrowLeft') onChangeIndex((currentIndex - 1 + items.length) % items.length);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, currentIndex, items.length, onClose, onChangeIndex]);

  if (!isOpen || currentIndex === null) return null;

  const active = items[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#0C1713]/96 backdrop-blur-md p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Media gallery viewer"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-[#F8F6F0]">
        <span className="text-xs uppercase tracking-[0.25em] text-[#B18A55]">
          {currentIndex + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="flex h-10 w-10 items-center justify-center border border-[#B18A55]/40 text-[#F8F6F0] transition-colors hover:border-[#B18A55] hover:bg-[#B18A55] hover:text-[#14251F]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Media */}
      <div className="relative flex flex-1 items-center justify-center my-4 overflow-hidden">
        {items.length > 1 && (
          <button
            type="button"
            onClick={() => onChangeIndex((currentIndex - 1 + items.length) % items.length)}
            aria-label="Previous item"
            className="absolute left-2 sm:left-4 z-10 flex h-11 w-11 items-center justify-center border border-[#B18A55]/40 bg-[#14251F]/80 text-[#F8F6F0] transition-colors hover:bg-[#B18A55] hover:text-[#14251F]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <div className="max-h-[75vh] max-w-5xl w-full flex flex-col items-center justify-center">
          {active.type === 'video' ? (
            <video
              key={active.url}
              src={active.url}
              controls
              autoPlay
              playsInline
              className="max-h-[70vh] w-auto max-w-full border border-[#B18A55]/30 bg-black"
            />
          ) : (
            <img
              key={active.url}
              src={active.url}
              alt={active.caption || 'Event photograph'}
              className="max-h-[70vh] w-auto max-w-full object-contain border border-[#B18A55]/25"
            />
          )}
          {active.caption && (
            <p className="mt-4 text-center text-sm text-[#EAE4D8]/85 max-w-2xl">
              {active.caption}
            </p>
          )}
        </div>

        {items.length > 1 && (
          <button
            type="button"
            onClick={() => onChangeIndex((currentIndex + 1) % items.length)}
            aria-label="Next item"
            className="absolute right-2 sm:right-4 z-10 flex h-11 w-11 items-center justify-center border border-[#B18A55]/40 bg-[#14251F]/80 text-[#F8F6F0] transition-colors hover:bg-[#B18A55] hover:text-[#14251F]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeIndex(idx)}
              className={`relative h-14 w-20 shrink-0 overflow-hidden border transition-all ${
                idx === currentIndex
                  ? 'border-[#B18A55] opacity-100'
                  : 'border-white/15 opacity-50 hover:opacity-85'
              }`}
            >
              {item.type === 'video' ? (
                <div className="flex h-full w-full items-center justify-center bg-[#263C32] text-[10px] uppercase tracking-wider text-[#F8F6F0]">
                  Video
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.caption || `Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
