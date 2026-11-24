import { motion } from 'framer-motion';
import { Compass, Crown, Landmark, Music2, Sparkles, Wand2 } from 'lucide-react';

const PROCESS_STAGES = [
  {
    step: '01',
    title: 'Vision Discovery',
    desc: 'Your unique story, traditions & aesthetic.',
    icon: Compass,
  },
  {
    step: '02',
    title: 'Venue Scoping',
    desc: 'Regal palaces, estates & spatial flow.',
    icon: Landmark,
  },
  {
    step: '03',
    title: 'Couture Decor',
    desc: 'Bespoke mandaps, florals & lighting.',
    icon: Wand2,
  },
  {
    step: '04',
    title: 'Dining & Acts',
    desc: 'Fine gastronomy & live artists.',
    icon: Music2,
  },
  {
    step: '05',
    title: 'Guest Care',
    desc: 'VIP concierge & luxury itineraries.',
    icon: Crown,
  },
  {
    step: '06',
    title: 'Showtime',
    desc: 'Invisible mastery & peace of mind.',
    icon: Sparkles,
  },
];

export function ProcessSection() {
  const row1 = PROCESS_STAGES.slice(0, 3);
  const row2 = PROCESS_STAGES.slice(3, 6);

  return (
    <section
      id="process"
      className="relative bg-[#08080A] text-[#FAF8F5] py-12 sm:py-16 border-t border-[#FFA01C]/15 overflow-hidden"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.3em] text-[#FFA01C] mb-2 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFA01C] animate-pulse" />
            <span>Step-By-Step Process</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight">
            Our Six-Stage <span className="gold-gradient-text italic font-serif">Methodology</span>
          </h2>
          <p className="mt-2 text-xs sm:text-[13px] text-[#FAF8F5]/70 font-light leading-relaxed">
            An unbroken, carefully orchestrated journey from your first creative consultation to flawless showtime.
          </p>
        </div>

        {/* Desktop & Tablet: Continuous Serpentine S-Curve Pipeline Track */}
        <div className="hidden md:block relative py-4">
          {/* Continuous Glowing Golden SVG S-Curve Path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 500"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pipelineGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFA01C" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#FFB84D" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#FFA01C" stopOpacity="0.4" />
              </linearGradient>
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Ambient Outer Path */}
            <path
              d="M 60 55 L 890 55 A 85 85 0 0 1 890 220 L 110 220 A 85 85 0 0 0 110 385 L 940 385"
              fill="none"
              stroke="#FFA01C"
              strokeWidth="6"
              strokeOpacity="0.25"
              filter="url(#goldGlow)"
            />

            {/* Core Golden Pathway */}
            <path
              d="M 60 55 L 890 55 A 85 85 0 0 1 890 220 L 110 220 A 85 85 0 0 0 110 385 L 940 385"
              fill="none"
              stroke="url(#pipelineGold)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Row 1 (Steps 1, 2, 3) */}
          <div className="grid grid-cols-3 gap-6 relative z-10 mb-20">
            {row1.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Circular Node Sitting Directly on the Pipeline Line */}
                  <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#FFA01C] bg-[#121217] shadow-[0_0_20px_rgba(255,160,28,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#FFB84D] group-hover:shadow-[0_0_30px_rgba(255,160,28,0.5)]">
                    <div className="absolute inset-1 rounded-full border border-[#FFA01C]/30 bg-[#08080A]/80" />
                    <Icon className="relative z-10 h-6 w-6 text-[#FFA01C] transition-transform duration-300 group-hover:scale-110" />

                    {/* Step Badge */}
                    <span className="absolute -top-2 bg-[#08080A] border border-[#FFA01C]/60 text-[#FFA01C] text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-full font-semibold shadow-md">
                      {stage.step}
                    </span>
                  </div>

                  {/* Clean, Uncluttered Step Title */}
                  <h3 className="font-serif text-base sm:text-lg font-normal text-[#FAF8F5] group-hover:text-[#FFA01C] transition-colors">
                    {stage.title}
                  </h3>

                  {/* Short, Meaningful Phrase (No Clutter) */}
                  <p className="mt-1 max-w-[200px] text-[11.5px] leading-relaxed text-[#FAF8F5]/70 font-light">
                    {stage.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Row 2 (Steps 4, 5, 6) */}
          <div className="grid grid-cols-3 gap-6 relative z-10">
            {row2.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (idx + 3) * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Circular Node Sitting Directly on the Pipeline Line */}
                  <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#FFA01C] bg-[#121217] shadow-[0_0_20px_rgba(255,160,28,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#FFB84D] group-hover:shadow-[0_0_30px_rgba(255,160,28,0.5)]">
                    <div className="absolute inset-1 rounded-full border border-[#FFA01C]/30 bg-[#08080A]/80" />
                    <Icon className="relative z-10 h-6 w-6 text-[#FFA01C] transition-transform duration-300 group-hover:scale-110" />

                    <span className="absolute -top-2 bg-[#08080A] border border-[#FFA01C]/60 text-[#FFA01C] text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-full font-semibold shadow-md">
                      {stage.step}
                    </span>
                  </div>

                  {/* Clean, Uncluttered Step Title */}
                  <h3 className="font-serif text-base sm:text-lg font-normal text-[#FAF8F5] group-hover:text-[#FFA01C] transition-colors">
                    {stage.title}
                  </h3>

                  {/* Short, Meaningful Phrase (No Clutter) */}
                  <p className="mt-1 max-w-[200px] text-[11.5px] leading-relaxed text-[#FAF8F5]/70 font-light">
                    {stage.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile View (< 768px): Vertical Pipeline Track */}
        <div className="md:hidden relative space-y-9 pl-6 border-l-2 border-[#FFA01C]/40 ml-4">
          {PROCESS_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="relative pl-6"
              >
                {/* Node on Vertical Track */}
                <div className="absolute -left-[45px] top-0 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#FFA01C] bg-[#121217] shadow-[0_0_15px_rgba(255,160,28,0.4)]">
                  <Icon className="h-6 w-6 text-[#FFA01C]" />
                </div>

                <div className="pt-1">
                  <span className="text-[10px] font-mono text-[#FFA01C] uppercase tracking-wider font-semibold">
                    Step {stage.step}
                  </span>
                  <h3 className="font-serif text-lg font-normal text-[#FAF8F5] mt-0.5">
                    {stage.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#FAF8F5]/70 font-light leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
