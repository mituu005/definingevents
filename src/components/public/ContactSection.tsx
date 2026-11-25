import { CheckCircle2, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';
import { submitEnquiry } from '@/lib/api';

export function ContactSection() {
  const { settings, services, preselectedEventType } = useSiteData();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('');
  const [note, setNote] = useState('');

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
      return 'Please enter your name.';
    }
    if (!phone.trim() || phone.trim().length < 6) {
      return 'Please provide a valid phone or WhatsApp number.';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!eventType.trim()) {
      return 'Please choose an event type.';
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
        event_date: null,
        event_location: null,
        guest_count: null,
        budget: null,
        requirements: note || null,
      });

      setSubmitted(true);
      setFullName('');
      setPhone('');
      setEmail('');
      setEventType('');
      setNote('');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Unable to submit enquiry right now. Please reach us directly via WhatsApp or phone.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const rawPhone = settings.contact_phone || '+91 98765 43210';
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');

  const rawWhatsapp = settings.contact_whatsapp || '919876543210';
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '');
  const whatsappHref = `https://wa.me/${cleanWhatsapp || '919876543210'}?text=${encodeURIComponent(
    `Hello ${settings.company_name || 'Defining Events'}, I would like to plan an event.`
  )}`;

  return (
    <section id="contact" className="relative bg-[#08080A] text-[#FAF8F5] py-12 sm:py-16 border-t border-[#FFA01C]/20 scroll-mt-20 sm:scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Consultation Column */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-1.5 text-[13.5px] uppercase tracking-[0.3em] text-[#FFA01C] mb-2 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFA01C]" />
              <span>Direct Concierge</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-[1.1]">
              Plan Your <span className="gold-gradient-text italic font-serif">Milestone</span>
            </h2>
            <p className="mt-3 text-xs sm:text-[16px] leading-relaxed text-[#FAF8F5]/80 font-light">
              Send a quick 30-second inquiry or connect directly with our event directors on WhatsApp.
            </p>

            <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 bg-[#121217]/60 hover:border-[#FFA01C]/50 transition-colors group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFA01C]/15 border border-[#FFA01C]/40 text-[#FFA01C] group-hover:bg-[#FFA01C] group-hover:text-[#08080A] transition-all">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[12.5px] uppercase tracking-[0.2em] text-[#FFA01C]">
                    Call Atelier Directly
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-[#FAF8F5] group-hover:text-[#FFA01C] transition-colors">
                    {rawPhone}
                  </p>
                </div>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-lg border border-[#FFA01C]/30 bg-[#121217]/80 hover:bg-[#FFA01C]/15 transition-colors group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFA01C] text-[#08080A]">
                  <MessageCircle className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[12.5px] uppercase tracking-[0.2em] text-[#FFA01C] font-semibold">
                    Instant WhatsApp Concierge
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-[#FAF8F5]">
                    Chat with an Event Director Now ➔
                  </p>
                </div>
              </a>

              {settings.contact_email && (
                <div className="flex items-center gap-3 px-3 py-1.5 text-xs text-[#FAF8F5]/60">
                  <Mail className="h-3.5 w-3.5 text-[#FFA01C]" />
                  <span>{settings.contact_email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Compact Form Card */}
          <div className="lg:col-span-7 rounded-xl border border-[#FFA01C]/30 bg-gradient-to-b from-[#14141D] to-[#0E0E14] p-5 sm:p-6 backdrop-blur-md shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#FFA01C]" />
                <h3 className="mt-4 font-serif text-2xl sm:text-3xl text-[#FAF8F5]">
                  Enquiry Received
                </h3>
                <p className="mt-2 text-sm text-[#FAF8F5]/80 max-w-sm mx-auto">
                  Thank you! An event director will review your details and contact you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded border border-[#FFA01C] px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[#FFA01C] hover:bg-[#FFA01C] hover:text-[#08080A] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="enq-name"
                      className="block text-[13.5px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-1.5 font-medium"
                    >
                      Your Name *
                    </label>
                    <input
                      id="enq-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full rounded border border-white/15 bg-[#1A1A24] px-3.5 py-2.5 text-sm text-[#FAF8F5] placeholder:text-white/30 focus:border-[#FFA01C] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enq-phone"
                      className="block text-[13.5px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-1.5 font-medium"
                    >
                      Phone / WhatsApp *
                    </label>
                    <input
                      id="enq-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded border border-white/15 bg-[#1A1A24] px-3.5 py-2.5 text-sm text-[#FAF8F5] placeholder:text-white/30 focus:border-[#FFA01C] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="enq-email"
                      className="block text-[13.5px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-1.5 font-medium"
                    >
                      Email Address *
                    </label>
                    <input
                      id="enq-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="eleanor@example.com"
                      className="w-full rounded border border-white/15 bg-[#1A1A24] px-3.5 py-2.5 text-sm text-[#FAF8F5] placeholder:text-white/30 focus:border-[#FFA01C] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enq-type"
                      className="block text-[13.5px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-1.5 font-medium"
                    >
                      Event Type *
                    </label>
                    <select
                      id="enq-type"
                      required
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full rounded border border-white/15 bg-[#1A1A24] px-3.5 py-2.5 text-sm text-[#FAF8F5] focus:border-[#FFA01C] focus:outline-none transition-colors"
                    >
                      <option value="" className="bg-[#1A1A24]">Select celebration type</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.title} className="bg-[#1A1A24]">
                          {s.title}
                        </option>
                      ))}
                      <option value="Destination Wedding" className="bg-[#1A1A24]">
                        Destination Wedding
                      </option>
                      <option value="Grand Gala / Soirée" className="bg-[#1A1A24]">
                        Grand Gala / Soirée
                      </option>
                      <option value="Other Bespoke Event" className="bg-[#1A1A24]">
                        Other Bespoke Event
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="enq-note"
                    className="block text-[13.5px] uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-1.5 font-medium"
                  >
                    Event Date, City or Vision (Optional)
                  </label>
                  <input
                    id="enq-note"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. November 2026 in Udaipur / ~250 guests"
                    className="w-full rounded border border-white/15 bg-[#1A1A24] px-3.5 py-2.5 text-sm text-[#FAF8F5] placeholder:text-white/30 focus:border-[#FFA01C] focus:outline-none transition-colors"
                  />
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="rounded border border-red-500/40 bg-red-950/60 px-3.5 py-2 text-xs text-red-200"
                  >
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2.5 rounded bg-gradient-to-r from-[#FFA01C] via-[#FFB84D] to-[#E68A00] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#08080A] shadow-[0_0_25px_rgba(255,160,28,0.4)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,160,28,0.6)] hover:scale-[1.01] disabled:opacity-60 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitting ? 'Transmitting Request...' : 'Check Availability & Request Quote'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
