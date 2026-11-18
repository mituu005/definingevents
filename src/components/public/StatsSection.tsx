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
      sub: 'Decades of Haute Scenography',
      icon: Award,
    },
    {
      label: 'Landmark Events Produced',
      value: settings.stat_events || '500+',
      sub: 'Royal, Arena & Private Occasions',
      icon: Sparkles,
    },
    {
      label: 'Discerning Global Clients',
      value: settings.stat_clients || '450+',
      sub: 'Celebrity, Corporate & Royalty',
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
      className="relative z-20 -mt-8 mx-auto max-w-7xl px-5 sm:px-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-sm border border-[#FFA01C]/25 bg-[#121217]/90 p-6 sm:p-7 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-[#FFA01C] hover:shadow-[0_0_35px_rgba(255,160,28,0.22)]"
            >
              {/* Subtle top gold accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFA01C]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.24em] font-medium text-[#FFA01C]">
                  0{index + 1}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FFA01C]/30 bg-[#FFA01C]/10 text-[#FFA01C] transition-colors group-hover:bg-[#FFA01C] group-hover:text-[#08080A]">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="font-serif text-4xl sm:text-5xl font-normal text-[#FAF8F5] tracking-tight group-hover:text-[#FFA01C] transition-colors">
                {stat.value}
              </div>

              <h2 className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F5]/90">
                {stat.label}
              </h2>

              <p className="mt-1 text-[11px] text-[#FAF8F5]/50 font-light">
                {stat.sub}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
