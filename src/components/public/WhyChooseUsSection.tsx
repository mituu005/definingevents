import { motion } from 'framer-motion';
import {
  Compass,
  Crown,
  Gem,
  Layers,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';

const PILLARS = [
  {
    icon: Layers,
    title: 'End-to-End Turnkey Direction',
    desc: 'Unified creative scenography, technical production, international logistics, and hospitality under a single accountable command.',
  },
  {
    icon: Sparkles,
    title: 'Customised Event Concepts',
    desc: 'Zero templates. Every spatial layout, botanical installation, palette, and sensory cue is authored exclusively around your story.',
  },
  {
    icon: Compass,
    title: 'Professional Master Planning',
    desc: 'Disciplined critical-path timelines, 3D architectural plots, and contingency protocols engineered for complex international productions.',
  },
  {
    icon: Crown,
    title: 'Creative Scenography & Production',
    desc: 'Monumental staging, bespoke floral architecture, synchronized lighting choreography, and acoustic craftsmanship in seamless harmony.',
  },
  {
    icon: Wallet,
    title: 'Disciplined Budget Architecture',
    desc: 'Transparent financial modeling and strategic vendor procurement that maximize sensory impact per dollar invested.',
  },
  {
    icon: Users,
    title: 'Curated Master Artisans',
    desc: 'Direct access to Michelin-grade culinary directors, touring sound engineers, world-class floral architects, and premier luxury houses.',
  },
  {
    icon: ShieldCheck,
    title: 'Military-Grade On-Site Execution',
    desc: 'Calm, discreet show callers and technical directors orchestrating every single lighting cue, artist entrance, and transition backstage.',
  },
  {
    icon: Gem,
    title: 'Relentless Attention to Detail',
    desc: 'From custom stationery weight and signature fragrance diffusion to twilight lighting shifts—nothing is ever left to chance.',
  },
];

export function WhyChooseUsSection() {
  return (
    <section id="why-us" className="bg-[#08080A] text-[#FAF8F5] py-28 sm:py-36 border-t border-[#FFA01C]/15">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-[#FFA01C] mb-3 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFA01C]" />
            <span>The Agency Standard</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight">
            Why Discerning Hosts &amp; Global Brands{' '}
            <span className="gold-gradient-text italic font-serif">Trust Us</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#FFA01C]/20">
          {PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group border-r border-b border-[#FFA01C]/20 bg-[#121217]/50 p-7 sm:p-8 transition-all duration-300 hover:bg-[#121217] hover:border-[#FFA01C]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-[#FFA01C]/35 bg-[#FFA01C]/10 text-[#FFA01C] transition-colors group-hover:bg-[#FFA01C] group-hover:text-[#08080A]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-serif text-lg text-[#FFA01C]/60 font-semibold">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#FAF8F5] group-hover:text-[#FFA01C] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#FAF8F5]/70 font-light">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
