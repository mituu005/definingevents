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
      className="relative z-20 py-16 sm:py-20 bg-[#08080A] border-b border-white/5"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#121217]/90 p-7 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-[#FFA01C]/60 hover:shadow-[0_0_40px_rgba(255,160,28,0.25)] hover:-translate-y-1"
              >
                {/* Subtle top gold accent glow */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFA01C] to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center justify-end mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FFA01C]/30 bg-[#FFA01C]/10 text-[#FFA01C] transition-all group-hover:scale-110 group-hover:bg-[#FFA01C] group-hover:text-[#08080A]">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                {/* High-Impact Number - Bigger & Bolder */}
                <div className="font-serif text-6xl sm:text-7xl font-normal tracking-tight gold-gradient-text drop-shadow-[0_0_25px_rgba(255,160,28,0.35)]">
                  {stat.value}
                </div>

                <h2 className="mt-3.5 text-sm sm:text-base font-semibold uppercase tracking-[0.18em] text-[#FAF8F5]">
                  {stat.label}
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-[#FAF8F5]/75 font-light leading-relaxed">
                  {stat.sub}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Metrics Highlight Table: Perfectly Proportioned, Gold Highlighted & Clear Typography */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="group relative overflow-hidden mt-8 sm:mt-10 rounded-xl border border-[#FFA01C]/60 bg-[#121217]/95 py-7 sm:py-8 px-4 sm:px-8 backdrop-blur-xl shadow-[0_0_35px_rgba(255,160,28,0.2)] transition-all duration-300 hover:border-[#FFA01C] hover:shadow-[0_0_50px_rgba(255,160,28,0.35)]"
        >
          {/* Top radiant gold accent glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFA01C] to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

          {/* 4 Proportionally Divided Columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 lg:divide-[#FFA01C]/25 text-center">
            <div className="flex flex-col items-center justify-center py-4 sm:py-2 px-3 sm:px-6">
              <p className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight gold-gradient-text drop-shadow-[0_0_20px_rgba(255,160,28,0.3)]">
                100%
              </p>
              <h3 className="mt-2.5 text-xs sm:text-sm lg:text-[13px] font-semibold uppercase tracking-[0.2em] text-[#FAF8F5]">
                5-Star Rated
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center py-4 sm:py-2 px-3 sm:px-6">
              <p className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight gold-gradient-text drop-shadow-[0_0_20px_rgba(255,160,28,0.3)]">
                500+
              </p>
              <h3 className="mt-2.5 text-xs sm:text-sm lg:text-[13px] font-semibold uppercase tracking-[0.2em] text-[#FAF8F5]">
                Landmarks Produced
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center py-4 sm:py-2 px-3 sm:px-6">
              <p className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight gold-gradient-text drop-shadow-[0_0_20px_rgba(255,160,28,0.3)]">
                28+
              </p>
              <h3 className="mt-2.5 text-xs sm:text-sm lg:text-[13px] font-semibold uppercase tracking-[0.2em] text-[#FAF8F5]">
                World Capitals
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center py-4 sm:py-2 px-3 sm:px-6">
              <p className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight gold-gradient-text drop-shadow-[0_0_20px_rgba(255,160,28,0.3)]">
                Flawless
              </p>
              <h3 className="mt-2.5 text-xs sm:text-sm lg:text-[13px] font-semibold uppercase tracking-[0.2em] text-[#FAF8F5]">
                Run of Show
              </h3>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
