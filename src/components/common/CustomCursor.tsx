import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    if (!media.matches) return;

    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'a, button, input, select, textarea, [role="button"], [data-cursor="expand"]'
      );
      setExpanded(Boolean(interactive));
    };

    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (!enabled || !visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block"
    >
      <div
        className="fixed top-0 left-0 rounded-full border border-[#FFA01C]/80 transition-transform duration-150 ease-out"
        style={{
          width: expanded ? 44 : 28,
          height: expanded ? 44 : 28,
          transform: `translate3d(${pos.x - (expanded ? 22 : 14)}px, ${pos.y - (expanded ? 22 : 14)}px, 0)`,
          backgroundColor: expanded ? 'rgba(255, 160, 28, 0.15)' : 'transparent',
        }}
      />
      <div
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-[#FFA01C]"
        style={{
          transform: `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`,
        }}
      />
    </div>
  );
}
