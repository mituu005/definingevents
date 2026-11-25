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
      className="relative overflow-hidden bg-[#08080A] text-[#FAF8F5] py-12 sm:py-16 border-t border-[#FFA01C]/15 scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-[#FFA01C]/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[500px] w-[500px] rounded-full bg-[#C84B31]/5 blur-[120px]" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
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

                {/* Top Golden Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11.5px] uppercase tracking-[0.22em] text-[#FAF8F5]/90 border-b border-[#FFA01C]/30 pb-2.5 bg-[#08080A]/40 backdrop-blur-sm px-2.5 rounded-sm">
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
                className="hidden sm:block absolute -bottom-6 -right-4 z-20 max-w-[200px] rounded-sm border border-[#FFA01C] bg-[#08080A]/95 p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md"
              >
                <div className="flex items-center gap-1.5 mb-1.5 text-[#FFA01C]">
                  <Crown className="h-3.5 w-3.5" />
                  <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">
                    The Signature
                  </span>
                </div>
                <p className="font-serif text-[14px] leading-snug text-[#FAF8F5]">
                  “Every gathering is an unrepeatable sensory work of art.”
                </p>
                <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.24em] text-[#FFA01C]/80">
                  Defining Events Atelier
                </p>
              </motion.div>

              {/* Decorative Background Frame */}
              <div className="hidden sm:block absolute -top-3 -left-3 h-full w-full border border-[#FFA01C]/25 -z-10 pointer-events-none" />
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
            <div className="inline-flex items-center gap-1.5 text-[12.5px] uppercase tracking-[0.3em] text-[#FFA01C] mb-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFA01C]" />
              <span>About Defining Events</span>
            </div>

            <h2 className="font-serif text-[26px] sm:text-[32px] lg:text-[42px] font-normal leading-[1.1] text-[#FAF8F5]">
              Turning Blank Spaces Into{' '}
              <span className="gold-gradient-text italic font-serif">
                Living Emotional Masterpieces.
              </span>
            </h2>

            <div className="my-4 h-[1px] w-20 bg-gradient-to-r from-[#FFA01C] to-transparent" />

            <p className="text-[14px] sm:text-[16px] leading-relaxed text-[#FAF8F5]/80 font-light">
              {settings.about_intro}
            </p>

            {/* Interactive Atelier Tabs */}
            <div className="mt-6 border-t border-[#FFA01C]/20 pt-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-[#FFA01C]/15 pb-4">
                {pillars.map((pillar) => {
                  const active = pillar.key === activeTab;
                  const Icon = pillar.icon;
                  return (
                    <button
                      key={pillar.key}
                      type="button"
                      onClick={() => setActiveTab(pillar.key)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-sm text-[14px] uppercase tracking-[0.18em] transition-all duration-300 relative ${
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
              <div className="mt-4 rounded-sm border border-[#FFA01C]/25 bg-[#121217]/80 p-4 sm:p-5 backdrop-blur-md">
                <p className="text-[13px] uppercase tracking-[0.22em] font-semibold text-[#FFA01C]">
                  {activePillar.title}
                </p>
                <p className="mt-2 font-serif text-[18px] sm:text-[20px] leading-relaxed text-[#FAF8F5] italic font-normal">
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
