import { CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';
import { submitEnquiry } from '@/lib/api';

const BUDGET_OPTIONS = [
  'Under $25,000',
  '$25,000 – $75,000',
  '$75,000 – $150,000',
  '$150,000 – $350,000',
  '$350,000+',
  'Custom / Bespoke Commission',
];

export function ContactSection() {
  const { settings, services, preselectedEventType } = useSiteData();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [budget, setBudget] = useState('');
  const [requirements, setRequirements] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedEventType) {
      setEventType(preselectedEventType);
    }
  }, [preselectedEventType]);

  const validate = () => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      return 'Please enter your full name.';
    }
    if (!phone.trim() || phone.trim().length < 6) {
      return 'Please provide a valid phone or WhatsApp number.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!eventType.trim()) {
      return 'Please select an event type.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await submitEnquiry({
        full_name: fullName,
        phone,
        email,
        event_type: eventType,
        event_date: eventDate || null,
        event_location: eventLocation || null,
        guest_count: guestCount || null,
        budget: budget || null,
        requirements: requirements || null,
      });

      setSubmitted(true);
      setFullName('');
      setPhone('');
      setEmail('');
      setEventType('');
      setEventDate('');
      setEventLocation('');
      setGuestCount('');
      setBudget('');
      setRequirements('');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Unable to submit enquiry right now. Please contact us via WhatsApp or email.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const cleanWhatsapp = (settings.contact_whatsapp || '').replace(/[^0-9]/g, '');
  const whatsappHref = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        `Hello ${settings.company_name}, I would like to discuss an upcoming event.`
      )}`
    : null;

  return (
    <section id="contact" className="bg-[#08080A] text-[#FAF8F5] py-28 sm:py-36 border-t border-[#FFA01C]/15">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Editorial Consultation Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-[#FFA01C] mb-3 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFA01C]" />
                <span>Private Consultation</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-[1.1]">
                Your Vision Deserves an{' '}
                <span className="gold-gradient-text italic font-serif">
                  Extraordinary Execution.
                </span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#FAF8F5]/80 font-light">
                Tell us about your upcoming occasion. Let&apos;s create something truly monumental together.
              </p>

              <div className="mt-10 space-y-6 border-t border-[#FFA01C]/20 pt-8">
                {settings.contact_phone && (
                  <a
                    href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`}
                    className="flex items-start gap-4 group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#FFA01C]/40 bg-[#121217] text-[#FFA01C] group-hover:bg-[#FFA01C] group-hover:text-[#08080A] transition-colors">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10.5px] uppercase tracking-[0.2em] text-[#FFA01C]">
                        Direct Atelier Line
                      </p>
                      <p className="text-base font-medium text-[#FAF8F5] group-hover:text-[#FFA01C] transition-colors mt-0.5">
                        {settings.contact_phone}
                      </p>
                    </div>
                  </a>
                )}

                {settings.contact_email && (
                  <a href={`mailto:${settings.contact_email}`} className="flex items-start gap-4 group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#FFA01C]/40 bg-[#121217] text-[#FFA01C] group-hover:bg-[#FFA01C] group-hover:text-[#08080A] transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10.5px] uppercase tracking-[0.2em] text-[#FFA01C]">
                        Studio Enquiries
                      </p>
                      <p className="text-base font-medium text-[#FAF8F5] group-hover:text-[#FFA01C] transition-colors mt-0.5">
                        {settings.contact_email}
                      </p>
                    </div>
                  </a>
                )}

                {settings.contact_address && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#FFA01C]/40 bg-[#121217] text-[#FFA01C]">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10.5px] uppercase tracking-[0.2em] text-[#FFA01C]">
                        Atelier &amp; Global Hub
                      </p>
                      <p className="text-base text-[#FAF8F5] mt-0.5">{settings.contact_address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-sm border border-[#FFA01C] bg-[#121217] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] shadow-[0_0_20px_rgba(255,160,28,0.2)] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-[#FFA01C]" />
                  <span>Message on WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 rounded-sm border border-[#FFA01C]/30 bg-[#121217]/90 p-7 sm:p-11 backdrop-blur-md shadow-2xl">
            {submitted ? (
              <div className="py-16 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#FFA01C]" />
                <h3 className="mt-5 font-serif text-3xl text-[#FAF8F5]">
                  Enquiry Received With Gratitude
                </h3>
                <p className="mt-3 max-w-md mx-auto text-sm leading-relaxed text-[#FAF8F5]/80">
                  Thank you for sharing your vision with {settings.company_name}. A senior event
                  director will review your brief and reach out promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-8 rounded-sm border border-[#FFA01C] px-6 py-3 text-xs uppercase tracking-[0.22em] text-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="enq-name"
                      className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-2 font-medium"
                    >
                      Full Name *
                    </label>
                    <input
                      id="enq-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-sm border border-[#FFA01C]/25 bg-[#181820] px-4 py-3 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/35 focus:border-[#FFA01C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enq-phone"
                      className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-2 font-medium"
                    >
                      Phone / WhatsApp *
                    </label>
                    <input
                      id="enq-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-sm border border-[#FFA01C]/25 bg-[#181820] px-4 py-3 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/35 focus:border-[#FFA01C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="enq-email"
                      className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-2 font-medium"
                    >
                      Email Address *
                    </label>
                    <input
                      id="enq-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-sm border border-[#FFA01C]/25 bg-[#181820] px-4 py-3 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/35 focus:border-[#FFA01C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enq-type"
                      className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-2 font-medium"
                    >
                      Event Type *
                    </label>
                    <select
                      id="enq-type"
                      required
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full rounded-sm border border-[#FFA01C]/25 bg-[#181820] px-4 py-3 text-sm text-[#FAF8F5] focus:border-[#FFA01C] focus:outline-none"
                    >
                      <option value="" className="bg-[#181820]">Select an event category</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.title} className="bg-[#181820]">
                          {s.title}
                        </option>
                      ))}
                      <option value="Other / Bespoke Commission" className="bg-[#181820]">
                        Other / Bespoke Commission
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="enq-date"
                      className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-2 font-medium"
                    >
                      Preferred Event Date
                    </label>
                    <input
                      id="enq-date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full rounded-sm border border-[#FFA01C]/25 bg-[#181820] px-4 py-3 text-sm text-[#FAF8F5] focus:border-[#FFA01C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enq-location"
                      className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-2 font-medium"
                    >
                      Event Location / Destination
                    </label>
                    <input
                      id="enq-location"
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="e.g. Lake Como, Paris, or Private Estate"
                      className="w-full rounded-sm border border-[#FFA01C]/25 bg-[#181820] px-4 py-3 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/35 focus:border-[#FFA01C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="enq-guests"
                      className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-2 font-medium"
                    >
                      Expected Guest Count
                    </label>
                    <input
                      id="enq-guests"
                      type="text"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      placeholder="e.g. 150 – 300 guests"
                      className="w-full rounded-sm border border-[#FFA01C]/25 bg-[#181820] px-4 py-3 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/35 focus:border-[#FFA01C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enq-budget"
                      className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-2 font-medium"
                    >
                      Approximate Event Budget
                    </label>
                    <select
                      id="enq-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full rounded-sm border border-[#FFA01C]/25 bg-[#181820] px-4 py-3 text-sm text-[#FAF8F5] focus:border-[#FFA01C] focus:outline-none"
                    >
                      <option value="" className="bg-[#181820]">Select estimated range</option>
                      {BUDGET_OPTIONS.map((b) => (
                        <option key={b} value={b} className="bg-[#181820]">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="enq-req"
                    className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-2 font-medium"
                  >
                    Additional Vision &amp; Requirements
                  </label>
                  <textarea
                    id="enq-req"
                    rows={4}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Share your aesthetic ideas, multi-day programming, entertainment aspirations, or special requests..."
                    className="w-full rounded-sm border border-[#FFA01C]/25 bg-[#181820] px-4 py-3 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/35 focus:border-[#FFA01C] focus:outline-none"
                  />
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="rounded-sm border border-red-500/40 bg-red-950/60 px-4 py-3 text-xs text-red-200"
                  >
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-sm bg-gradient-to-r from-[#FFA01C] via-[#FFB84D] to-[#E68A00] px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#08080A] shadow-[0_0_30px_rgba(255,160,28,0.4)] transition-all duration-300 hover:shadow-[0_0_45px_rgba(255,160,28,0.65)] hover:scale-[1.01] disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Transmitting Enquiry...' : 'Submit Private Consultation Enquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
