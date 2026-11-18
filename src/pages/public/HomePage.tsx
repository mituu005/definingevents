import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IntroPreloader } from '@/components/common/IntroPreloader';
import { ScrollProgressAndUtilities } from '@/components/common/ScrollProgressAndUtilities';
import { AboutSection } from '@/components/public/AboutSection';
import { ClientLogosSection } from '@/components/public/ClientLogosSection';
import { ContactSection } from '@/components/public/ContactSection';
import { Footer } from '@/components/public/Footer';
import { HeroSection } from '@/components/public/HeroSection';
import { Navbar } from '@/components/public/Navbar';
import { PortfolioSection } from '@/components/public/PortfolioSection';
import { ProcessSection } from '@/components/public/ProcessSection';
import { ServicesSection } from '@/components/public/ServicesSection';
import { StatsSection } from '@/components/public/StatsSection';
import { TestimonialsSection } from '@/components/public/TestimonialsSection';
import { WhyChooseUsSection } from '@/components/public/WhyChooseUsSection';

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-[#08080A] text-[#FAF8F5] selection:bg-[#FFA01C]/30 selection:text-[#FFA01C]">
      <IntroPreloader />
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <WhyChooseUsSection />
        <ProcessSection />
        <TestimonialsSection />
        <ClientLogosSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollProgressAndUtilities />
    </div>
  );
}
