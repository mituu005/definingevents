import { motion } from 'framer-motion';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Share Your Vision',
    desc: 'An intimate creative dialogue exploring your occasion, desired emotional resonance, guest journey, and destination buyouts.',
  },
  {
    step: '02',
    title: 'Feasibility & Master Roadmap',
    desc: 'Rigorous venue feasibility, 3D spatial scoping, vendor procurement, and comprehensive production roadmap modeling.',
  },
  {
    step: '03',
    title: 'Creative Concept & Scenography',
    desc: 'Bespoke mood architecture, 3D architectural renders, floral palettes, lighting plots, and bespoke tablescape direction.',
  },
  {
    step: '04',
    title: 'Engineering & Guest Concierge',
    desc: 'Contracting master artisans, technical rider management, private guest travel logistics, and minute-by-minute show calling plots.',
  },
  {
    step: '05',
    title: 'On-Site Execution Command',
    desc: 'White-glove load-in, custom set fabrication, comprehensive sound and light rehearsals, and calm discreet on-site mastery.',
  },
  {
    step: '06',
    title: 'The Grand Experience',
    desc: 'You remain completely immersed with your guests while every single cue, reveal, and performance unfolds with effortless grace.',
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="bg-[#08080A] text-[#FAF8F5] py-28 sm:py-36 border-t border-[#FFA01C]/15">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#FFA01C]/20">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-[#FFA01C] mb-3 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFA01C]" />
              <span>Production Methodology</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal">
              Our Six-Stage <span className="gold-gradient-text italic font-serif">Process</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#FAF8F5]/75 font-light">
            Architectural clarity paired with creative passion—guaranteeing complete host serenity from first consultation to final guest departure.
          </p>
        </div>

        {/* Connected Timeline */}
        <div className="relative">
          {/* Desktop Connecting Golden Line */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-10 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFA01C]/50 to-transparent"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {PROCESS_STEPS.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
                className="relative pt-4 lg:pt-14 border-l lg:border-l-0 border-[#FFA01C]/40 pl-6 lg:pl-0"
              >
                {/* Node Pill */}
                <div className="lg:absolute lg:top-6 lg:left-0 mb-4 lg:mb-0 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-[#FFA01C] bg-[#08080A] text-xs font-semibold text-[#FFA01C] shadow-[0_0_15px_rgba(255,160,28,0.25)]">
                  {item.step}
                </div>

                <h3 className="font-serif text-2xl sm:text-[1.7rem] font-normal text-[#FAF8F5] mt-2">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#FAF8F5]/75 font-light">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
