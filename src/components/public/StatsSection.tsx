import { motion } from 'framer-motion';
import { Award, Compass, Globe, Sparkles } from 'lucide-react';
import { useSiteData } from '@/contexts/SiteDataContext';

export function StatsSection() {
  const { settings } = useSiteData();

  if (!settings.show_stats) return null;

  const stats = [
    {
      label: 'Years of Atelier Mastery',
      value: settings.stat_years || '12+',
      sub: 'Decades of Bespoke Production',
      icon: Award,
    },
    {
      label: 'Landmark Events Produced',
      value: settings.stat_events || '500+',
      sub: 'Royal, Destination & Private Occasions',
      icon: Sparkles,
    },
    {
      label: 'Discerning Global Clients',
      value: settings.stat_clients || '450+',
      sub: 'Private Families & Notable Hosts',
      icon: Compass,
    },
    {
      label: 'Iconic Cities & Destinations',
      value: settings.stat_cities || '28',
      sub: 'Palatial Buyouts Worldwide',
      icon: Globe,
    },
  ];

  return (
    <section
      id="stats"
      aria-label="Agency Credentials"
      className="relative z-20 py-12 sm:py-16 bg-[#08080A] border-b border-white/5"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#121217]/90 p-5 sm:p-6 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-end mb-3.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FFA01C]/30 bg-[#FFA01C]/10 text-[#FFA01C] transition-all">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Elegant Luxury Number */}
                <div className="font-serif text-4xl sm:text-5xl font-light tracking-tight gold-gradient-text drop-shadow-[0_0_18px_rgba(255,160,28,0.3)]">
                  {stat.value}
                </div>

                <h2 className="mt-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F5]">
                  {stat.label}
                </h2>

                <p className="mt-1 text-[11px] sm:text-xs text-[#FAF8F5]/65 font-light leading-relaxed">
                  {stat.sub}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Metrics Highlight Table: Perfectly Proportioned, Crisp Typography */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="group relative overflow-hidden mt-6 sm:mt-7 rounded-xl border border-[#FFA01C]/50 bg-[#121217]/95 py-4 sm:py-5 px-3 sm:px-6 backdrop-blur-xl shadow-[0_0_30px_rgba(255,160,28,0.18)]"
        >
          {/* Top radiant gold accent glow */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFA01C] to-transparent opacity-80" />

          {/* 4 Proportionally Divided Columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 lg:divide-[#FFA01C]/25 text-center">
            <div className="flex flex-col items-center justify-center py-2 sm:py-1 px-2 sm:px-4">
              <p className="font-serif text-3xl sm:text-4xl font-light tracking-tight gold-gradient-text drop-shadow-[0_0_15px_rgba(255,160,28,0.3)]">
                100%
              </p>
              <h3 className="mt-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FAF8F5]">
                5-Star Rated
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center py-2 sm:py-1 px-2 sm:px-4">
              <p className="font-serif text-3xl sm:text-4xl font-light tracking-tight gold-gradient-text drop-shadow-[0_0_15px_rgba(255,160,28,0.3)]">
                500+
              </p>
              <h3 className="mt-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FAF8F5]">
                Landmarks Produced
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center py-2 sm:py-1 px-2 sm:px-4">
              <p className="font-serif text-3xl sm:text-4xl font-light tracking-tight gold-gradient-text drop-shadow-[0_0_15px_rgba(255,160,28,0.3)]">
                28+
              </p>
              <h3 className="mt-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FAF8F5]">
                World Capitals
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center py-2 sm:py-1 px-2 sm:px-4">
              <p className="font-serif text-3xl sm:text-4xl font-light tracking-tight gold-gradient-text drop-shadow-[0_0_15px_rgba(255,160,28,0.3)]">
                Flawless
              </p>
              <h3 className="mt-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FAF8F5]">
                Run of Show
              </h3>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
