import { motion } from 'framer-motion';
import { ArrowRight, Compass, Crown, Landmark, Music2, Sparkles, Wand2 } from 'lucide-react';

const PROCESS_STAGES = [
  {
    title: 'Vision Discovery',
    desc: 'Capturing your unique story, traditions, and emotional aesthetic.',
    icon: Compass,
  },
  {
    title: 'Venue Scoping',
    desc: 'Securing regal palaces, private estates, and 3D spatial flow.',
    icon: Landmark,
  },
  {
    title: 'Couture Decor',
    desc: 'Bespoke mandaps, architectural florals, and immersive lighting.',
    icon: Wand2,
  },
  {
    title: 'Dining & Acts',
    desc: 'Celebrated culinary curation and world-class live artists.',
    icon: Music2,
  },
  {
    title: 'Guest Care',
    desc: 'White-glove itineraries, VIP transfers, and 24/7 hospitality.',
    icon: Crown,
  },
  {
    title: 'Flawless Showtime',
    desc: 'Invisible on-ground direction so you celebrate stress-free.',
    icon: Sparkles,
  },
];

export function ProcessSection() {
  return (
    <section
      id="process"
      className="relative bg-[#08080A] text-[#FAF8F5] py-12 sm:py-16 border-t border-[#FFA01C]/15 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header: Compact & Slick */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.28em] text-[#FFA01C] mb-1 font-semibold">
              <Sparkles className="h-3 w-3 text-[#FFA01C]" />
              <span>Production Pipeline</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight">
              Our Six-Stage <span className="gold-gradient-text italic font-serif">Methodology</span>
            </h2>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-[#FAF8F5]/65 font-light">
            An unbroken architectural chain from venue buyout to showtime—engineered for zero stress and complete host serenity.
          </p>
        </div>

        {/* 6 Stages in ONE SINGLE ROW on Desktop */}
        <div className="relative">
          {/* Subtle horizontal connecting beam */}
          <div className="hidden lg:block absolute top-7 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#FFA01C]/35 to-transparent z-0 pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 relative z-10">
            {PROCESS_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="group relative flex flex-col justify-between rounded-lg border border-[#FFA01C]/20 bg-gradient-to-b from-[#14141E] to-[#0A0A0F] p-4 backdrop-blur-md transition-all duration-300 hover:border-[#FFA01C] hover:shadow-[0_0_20px_rgba(255,160,28,0.2)] hover:-translate-y-1 min-h-[175px]"
                >
                  <div>
                    {/* Glowing Icon & Next Arrow Indicator */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFA01C]/10 border border-[#FFA01C]/40 text-[#FFA01C] group-hover:scale-110 group-hover:border-[#FFA01C] group-hover:bg-[#FFA01C]/20 transition-all shadow-[0_0_12px_rgba(255,160,28,0.15)]">
                        <Icon className="h-4 w-4" />
                      </div>
                      {idx < PROCESS_STAGES.length - 1 ? (
                        <ArrowRight className="hidden lg:block h-3.5 w-3.5 text-[#FFA01C]/30 group-hover:text-[#FFA01C] group-hover:translate-x-0.5 transition-all" />
                      ) : (
                        <span className="hidden lg:inline-block text-[9px] uppercase tracking-wider text-[#FFA01C]/50 font-mono">
                          Finale
                        </span>
                      )}
                    </div>

                    {/* Stage Title */}
                    <h3 className="font-serif text-sm sm:text-base font-normal text-[#FAF8F5] leading-snug group-hover:text-[#FFA01C] transition-colors">
                      {stage.title}
                    </h3>

                    {/* Meaningful, concise copy (no excessive text, no overflow) */}
                    <p className="mt-1.5 text-[11px] leading-relaxed text-[#FAF8F5]/70 font-light">
                      {stage.desc}
                    </p>
                  </div>

                  {/* Bottom smooth link indicator (no numbers) */}
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] uppercase tracking-widest text-[#FFA01C]/60">
                    <span>Chain Link</span>
                    <span className="text-[#FFA01C]">✦</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
