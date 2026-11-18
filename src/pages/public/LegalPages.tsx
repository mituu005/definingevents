import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/public/Footer';
import { Navbar } from '@/components/public/Navbar';
import { useSiteData } from '@/contexts/SiteDataContext';

export function PrivacyPolicyPage() {
  const { settings } = useSiteData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#08080A] text-[#FAF8F5]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pt-36 pb-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#FFA01C] hover:text-[#FAF8F5] transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return Home</span>
        </Link>
        <h1 className="font-serif text-4xl sm:text-5xl mb-8 text-[#FAF8F5]">Privacy Policy</h1>
        <div className="space-y-6 text-sm leading-relaxed text-[#FAF8F5]/80">
          <p>
            {settings.company_name} respects the privacy and confidentiality of every client,
            partner, and visitor. Information submitted through our private enquiry form—including
            your name, contact details, event date, location, and budget preferences—is used
            exclusively to respond to your consultation request and plan your event.
          </p>
          <p>
            Enquiry records are stored securely in our private database protected by Row Level
            Security policies and are accessible only to authorised studio administrators. We never
            sell, rent, or distribute client information to third-party marketers.
          </p>
          <p>
            For questions regarding your data or to request deletion of an enquiry, please contact us
            directly{settings.contact_email ? ` at ${settings.contact_email}` : ''}.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function TermsPage() {
  const { settings } = useSiteData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#08080A] text-[#FAF8F5]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pt-36 pb-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#FFA01C] hover:text-[#FAF8F5] transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return Home</span>
        </Link>
        <h1 className="font-serif text-4xl sm:text-5xl mb-8 text-[#FAF8F5]">Terms &amp; Conditions</h1>
        <div className="space-y-6 text-sm leading-relaxed text-[#FAF8F5]/80">
          <p>
            All portfolio photography, architectural concepts, films, and written material on this
            website are the intellectual property of {settings.company_name} or our respective
            commissioned photographers and clients.
          </p>
          <p>
            Submitting an event enquiry via this website initiates a preliminary consultation and
            does not constitute a binding production contract or date hold until a formal Master
            Services Agreement and retainer are executed.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
