import { motion } from 'framer-motion';
import { Compass, Crown, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';
import { DEFAULT_ABOUT_IMAGE } from '@/lib/defaults';

type PillarKey = 'vision' | 'mission' | 'philosophy' | 'why';

export function AboutSection() {
  const { settings } = useSiteData();
  const [activeTab, setActiveTab] = useState<PillarKey>('vision');

  const pillars: Array<{
    key: PillarKey;
    label: string;
    icon: typeof Sparkles;
    title: string;
    text: string;
  }> = [
    {
      key: 'vision',
      label: 'Vision',
      icon: Sparkles,
      title: 'Architecting Enduring Cultural Memories',
      text:
        settings.about_vision ||
        'To elevate every gathering into an enduring cultural memory—where spatial design, sensory storytelling, and effortless hospitality converge into pure magic.',
    },
    {
      key: 'mission',
      label: 'Mission',
      icon: Compass,
      title: 'Flawless International Execution',
      text:
        settings.about_mission ||
        'To partner closely with discerning hosts and global brands, delivering end-to-end curation, disciplined budgeting, and calm on-site mastery across every continent.',
    },
    {
      key: 'philosophy',
      label: 'Philosophy',
      icon: Crown,
      title: 'Proportion, Atmosphere & Restraint',
      text:
        settings.about_philosophy ||
        'True luxury resides in proportion, atmosphere, and invisibly seamless execution. Every texture, light cue, and culinary cadence is custom-composed around your distinct story.',
    },
    {
      key: 'why',
      label: 'Why Us',
      icon: ShieldCheck,
      title: 'Atelier Artistry Meets Engineering',
      text:
        settings.about_why_us ||
        'Clients entrust us with their most consequential milestones because we unite atelier-level creative direction with battle-tested, military-grade production engineering.',
    },
  ];

  const activePillar = pillars.find((p) => p.key === activeTab) || pillars[0];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#08080A] text-[#FAF8F5] py-28 sm:py-36 border-t border-[#FFA01C]/15"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-[#FFA01C]/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[500px] w-[500px] rounded-full bg-[#C84B31]/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Layered Visual Stack */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative">
              {/* Main Editorial Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[#FFA01C]/35 bg-[#121217] shadow-2xl">
                <img
                  src={settings.about_image_url || DEFAULT_ABOUT_IMAGE}
                  alt="Haute couture luxury event production and tablescape"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080A]/90 via-transparent to-transparent" />

                {/* Corner Golden Badge */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[10.5px] uppercase tracking-[0.24em] text-[#FAF8F5]/90 border-t border-[#FFA01C]/30 pt-3">
                  <span className="font-medium text-[#FFA01C]">Atelier Scenography</span>
                  <span>Global Hub</span>
                </div>
              </div>

              {/* Overlaid Floating Gold Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="hidden sm:block absolute -bottom-8 -right-6 z-20 max-w-[240px] rounded-sm border border-[#FFA01C] bg-[#08080A]/95 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md"
              >
                <div className="flex items-center gap-2 mb-2 text-[#FFA01C]">
                  <Crown className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-[0.22em] font-semibold">
                    The Signature
                  </span>
                </div>
                <p className="font-serif text-sm leading-snug text-[#FAF8F5]">
                  “Every gathering is an unrepeatable sensory work of art.”
                </p>
                <p className="mt-2 text-[9px] uppercase tracking-[0.26em] text-[#FFA01C]/80">
                  Defining Events Atelier
                </p>
              </motion.div>

              {/* Decorative Background Frame */}
              <div className="hidden sm:block absolute -top-4 -left-4 h-full w-full border border-[#FFA01C]/25 -z-10 pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Editorial Story & Interactive Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-[#FFA01C] mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFA01C]" />
              <span>About Defining Events</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-normal leading-[1.08] text-[#FAF8F5]">
              Turning Blank Spaces Into{' '}
              <span className="gold-gradient-text italic font-serif">
                Living Emotional Masterpieces.
              </span>
            </h2>

            <div className="my-6 h-[1px] w-24 bg-gradient-to-r from-[#FFA01C] to-transparent" />

            <p className="text-base sm:text-lg leading-relaxed text-[#FAF8F5]/80 font-light">
              {settings.about_intro}
            </p>

            {/* Interactive Atelier Tabs */}
            <div className="mt-10 border-t border-[#FFA01C]/20 pt-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-[#FFA01C]/15 pb-4">
                {pillars.map((pillar) => {
                  const active = pillar.key === activeTab;
                  const Icon = pillar.icon;
                  return (
                    <button
                      key={pillar.key}
                      type="button"
                      onClick={() => setActiveTab(pillar.key)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-sm text-xs uppercase tracking-[0.18em] transition-all duration-300 relative ${
                        active
                          ? 'border border-[#FFA01C] bg-[#FFA01C]/15 text-[#FFA01C] font-semibold shadow-[0_0_15px_rgba(255,160,28,0.2)]'
                          : 'border border-transparent text-[#FAF8F5]/60 hover:text-[#FAF8F5] hover:border-[#FFA01C]/30'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{pillar.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Pillar Card */}
              <div className="mt-6 rounded-sm border border-[#FFA01C]/25 bg-[#121217]/80 p-6 sm:p-7 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.24em] font-semibold text-[#FFA01C]">
                  {activePillar.title}
                </p>
                <p className="mt-3 font-serif text-xl sm:text-2xl leading-relaxed text-[#FAF8F5] italic font-normal">
                  “{activePillar.text}”
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
