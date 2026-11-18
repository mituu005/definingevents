import { CheckCircle2, Plus, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSiteData } from '@/contexts/SiteDataContext';
import {
  deleteServiceAdmin,
  deleteTestimonialAdmin,
  fetchAllTestimonialsAdmin,
  fetchServices,
  updateWebsiteSettingsAdmin,
  upsertServiceAdmin,
  upsertTestimonialAdmin,
} from '@/lib/api';
import { DEFAULT_SERVICES } from '@/lib/defaults';
import { uploadMediaWithProgress, validateMediaFile } from '@/lib/media';
import type {
  ServiceRecord,
  TestimonialRecord,
  WebsiteSettings,
} from '@/types/database';

type ContentTab =
  | 'hero'
  | 'stats'
  | 'about'
  | 'services'
  | 'testimonials'
  | 'clients'
  | 'contact';

export function AdminContentPage() {
  const { settings, refreshSiteData } = useSiteData();
  const [tab, setTab] = useState<ContentTab>('hero');
  const [form, setForm] = useState<WebsiteSettings>(settings);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New Service form
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceShort, setNewServiceShort] = useState('');

  // New Testimonial form
  const [tName, setTName] = useState('');
  const [tRole, setTRole] = useState('');
  const [tEventType, setTEventType] = useState('');
  const [tQuote, setTQuote] = useState('');
  const [tPhotoUrl, setTPhotoUrl] = useState('');
  const [tVideoUrl, setTVideoUrl] = useState('');

  // New Client Logo / Gallery forms
  const [logoName, setLogoName] = useState('');
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('');

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const loadSubTables = async () => {
    try {
      const [srvs, tests] = await Promise.all([
        fetchServices(false),
        fetchAllTestimonialsAdmin().catch(() => []),
      ]);
      setServices(srvs);
      setTestimonials(tests);
    } catch {
      // ignore if empty
    }
  };

  useEffect(() => {
    loadSubTables();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await updateWebsiteSettingsAdmin(form);
      await refreshSiteData();
      setMessage('Website settings saved and published.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleAssetUpload = async (
    files: FileList | null,
    expected: 'image' | 'video',
    folder: string,
    onDone: (url: string) => void
  ) => {
    const file = files?.[0];
    if (!file) return;
    setError(null);

    const check = validateMediaFile(file, expected);
    if (!check.valid) {
      setError(check.error || 'Unsupported file.');
      return;
    }

    try {
      const res = await uploadMediaWithProgress(file, 'site-assets', folder);
      onDone(res.publicUrl);
      setMessage('Media uploaded. Remember to click Save Settings if editing site fields.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Asset upload failed.');
    }
  };

  const handleSeedDefaultServices = async () => {
    setSaving(true);
    setError(null);
    try {
      for (const s of DEFAULT_SERVICES) {
        await upsertServiceAdmin({
          title: s.title,
          slug: s.slug,
          short_description: s.short_description,
          full_description: s.full_description,
          highlights: s.highlights,
          cover_image_url: s.cover_image_url,
          display_order: s.display_order,
          is_active: true,
        });
      }
      await loadSubTables();
      await refreshSiteData();
      setMessage('Imported default 10 luxury services into database.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import services.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim() || !newServiceShort.trim()) {
      setError('Service title and description are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await upsertServiceAdmin({
        title: newServiceTitle,
        short_description: newServiceShort,
        display_order: services.length + 1,
        is_active: true,
      });
      setNewServiceTitle('');
      setNewServiceShort('');
      await loadSubTables();
      await refreshSiteData();
      setMessage('Service added.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add service.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tEventType.trim() || !tQuote.trim()) {
      setError('Client name, event type, and quote are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await upsertTestimonialAdmin({
        client_name: tName,
        client_role: tRole || null,
        event_type: tEventType,
        quote: tQuote,
        client_photo_url: tPhotoUrl || null,
        video_url: tVideoUrl || null,
        is_published: true,
      });
      setTName('');
      setTRole('');
      setTEventType('');
      setTQuote('');
      setTPhotoUrl('');
      setTVideoUrl('');
      await loadSubTables();
      await refreshSiteData();
      setMessage('Testimonial published.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const tabs: Array<{ id: ContentTab; label: string }> = [
    { id: 'hero', label: 'Brand & Hero' },
    { id: 'stats', label: 'Statistics' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'clients', label: 'Client Logos & Gallery' },
    { id: 'contact', label: 'Contact & Socials' },
  ];

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-[#B18A55]">Editorial CMS</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#14251F] mt-1">
            Website Content Management
          </h1>
        </div>
        {tab !== 'services' && tab !== 'testimonials' && (
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveSettings}
            className="border border-[#14251F] bg-[#14251F] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#F8F6F0] hover:bg-[#B18A55] hover:border-[#B18A55] hover:text-[#14251F] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Website Settings'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#14251F]/15 pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.18em] border transition-colors ${
              tab === t.id
                ? 'border-[#14251F] bg-[#14251F] text-[#F8F6F0]'
                : 'border-[#14251F]/15 bg-[#EAE4D8]/50 text-[#263C32] hover:border-[#B18A55]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="border border-red-700/30 bg-red-50 p-4 text-sm text-red-900">{error}</div>
      )}
      {message && (
        <div className="flex items-center gap-2 border border-emerald-700/30 bg-emerald-50 p-4 text-sm text-emerald-900">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* TAB 1: BRAND & HERO */}
      {tab === 'hero' && (
        <div className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                Company Name / Wordmark
              </label>
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={form.tagline || ''}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
              Company Logo (Optional)
            </label>
            <div className="flex flex-wrap items-center gap-4">
              {form.logo_url && (
                <img
                  src={form.logo_url}
                  alt="Company logo"
                  className="h-12 bg-[#14251F] p-2 object-contain"
                />
              )}
              <label className="inline-flex items-center gap-2 border border-[#14251F] px-4 py-2 text-xs uppercase tracking-wider cursor-pointer bg-[#F8F6F0]">
                <Upload className="h-3.5 w-3.5" />
                Upload Logo
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) =>
                    handleAssetUpload(e.target.files, 'image', 'branding', (url) =>
                      setForm((prev) => ({ ...prev, logo_url: url }))
                    )
                  }
                  className="hidden"
                />
              </label>
              {form.logo_url && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, logo_url: null })}
                  className="text-xs text-red-800 underline"
                >
                  Remove Logo
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
              Hero Headline
            </label>
            <input
              type="text"
              value={form.hero_headline}
              onChange={(e) => setForm({ ...form, hero_headline: e.target.value })}
              className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
              Hero Subtitle
            </label>
            <textarea
              rows={3}
              value={form.hero_subtitle}
              onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
              className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                Hero &amp; Showreel Video (MP4 URL, YouTube, Vimeo, or Upload)
              </label>
              <input
                type="text"
                value={form.hero_video_url || ''}
                onChange={(e) => setForm({ ...form, hero_video_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=... or /showreel.mp4"
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-2.5 text-sm mb-2"
              />
              <label className="inline-flex items-center gap-2 border border-[#14251F]/30 px-4 py-2 text-xs uppercase tracking-wider cursor-pointer bg-[#F8F6F0]">
                <Upload className="h-3.5 w-3.5" />
                Upload Hero MP4
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={(e) =>
                    handleAssetUpload(e.target.files, 'video', 'hero', (url) =>
                      setForm((prev) => ({ ...prev, hero_video_url: url }))
                    )
                  }
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                Hero Poster Image (Fallback)
              </label>
              <input
                type="url"
                value={form.hero_poster_url || ''}
                onChange={(e) => setForm({ ...form, hero_poster_url: e.target.value })}
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-2.5 text-sm mb-2"
              />
              <label className="inline-flex items-center gap-2 border border-[#14251F]/30 px-4 py-2 text-xs uppercase tracking-wider cursor-pointer bg-[#F8F6F0]">
                <Upload className="h-3.5 w-3.5" />
                Upload Poster Image
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) =>
                    handleAssetUpload(e.target.files, 'image', 'hero', (url) =>
                      setForm((prev) => ({ ...prev, hero_poster_url: url }))
                    )
                  }
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STATISTICS */}
      {tab === 'stats' && (
        <div className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#14251F]/12 pb-4">
            <div>
              <h2 className="font-serif text-2xl text-[#14251F]">Trust &amp; Credibility Metrics</h2>
              <p className="text-xs text-[#263C32]/75 mt-1">
                Enter verified numbers only, or toggle visibility off until verified figures are
                available.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer">
              <input
                type="checkbox"
                checked={form.show_stats}
                onChange={(e) => setForm({ ...form, show_stats: e.target.checked })}
                className="h-4 w-4 accent-[#14251F]"
              />
              Show Section on Website
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              ['Years of Experience', 'stat_years', 'e.g., 12+'],
              ['Events Successfully Executed', 'stat_events', 'e.g., 340+'],
              ['Happy Clients', 'stat_clients', 'e.g., 280+'],
              ['Cities Covered', 'stat_cities', 'e.g., 24'],
            ].map(([label, field, placeholder]) => (
              <div key={field}>
                <label className="block text-[11px] uppercase tracking-[0.18em] mb-2">
                  {label}
                </label>
                <input
                  type="text"
                  value={(form[field as keyof WebsiteSettings] as string) || ''}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ABOUT US */}
      {tab === 'about' && (
        <div className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
              About Headline
            </label>
            <input
              type="text"
              value={form.about_headline}
              onChange={(e) => setForm({ ...form, about_headline: e.target.value })}
              className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
              Company Introduction
            </label>
            <textarea
              rows={3}
              value={form.about_intro || ''}
              onChange={(e) => setForm({ ...form, about_intro: e.target.value })}
              className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                Our Vision
              </label>
              <textarea
                rows={3}
                value={form.about_vision || ''}
                onChange={(e) => setForm({ ...form, about_vision: e.target.value })}
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                Our Mission
              </label>
              <textarea
                rows={3}
                value={form.about_mission || ''}
                onChange={(e) => setForm({ ...form, about_mission: e.target.value })}
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                Our Philosophy
              </label>
              <textarea
                rows={3}
                value={form.about_philosophy || ''}
                onChange={(e) => setForm({ ...form, about_philosophy: e.target.value })}
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                Why Clients Choose Us
              </label>
              <textarea
                rows={3}
                value={form.about_why_us || ''}
                onChange={(e) => setForm({ ...form, about_why_us: e.target.value })}
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
              About Editorial Photograph
            </label>
            <div className="flex flex-wrap items-center gap-4">
              {form.about_image_url && (
                <img
                  src={form.about_image_url}
                  alt="About editorial"
                  className="h-24 w-20 object-cover border border-[#14251F]/20"
                />
              )}
              <label className="inline-flex items-center gap-2 border border-[#14251F] px-4 py-2 text-xs uppercase tracking-wider cursor-pointer bg-[#F8F6F0]">
                <Upload className="h-3.5 w-3.5" />
                Upload About Photograph
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) =>
                    handleAssetUpload(e.target.files, 'image', 'about', (url) =>
                      setForm((prev) => ({ ...prev, about_image_url: url }))
                    )
                  }
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SERVICES */}
      {tab === 'services' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6">
            <div>
              <h2 className="font-serif text-2xl text-[#14251F]">Service Categories</h2>
              <p className="text-xs text-[#263C32]/75 mt-1">
                Manage the services displayed on the public website and enquiry selector.
              </p>
            </div>
            {services.length === 0 && (
              <button
                type="button"
                disabled={saving}
                onClick={handleSeedDefaultServices}
                className="border border-[#14251F] bg-[#14251F] px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-[#F8F6F0]"
              >
                Import 10 Default Services
              </button>
            )}
          </div>

          <form
            onSubmit={handleAddService}
            className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          >
            <div className="md:col-span-4">
              <label className="block text-[11px] uppercase tracking-[0.18em] mb-1.5">
                New Service Title
              </label>
              <input
                type="text"
                value={newServiceTitle}
                onChange={(e) => setNewServiceTitle(e.target.value)}
                placeholder="e.g., Luxury Fashion Shows"
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-3 py-2.5 text-sm"
              />
            </div>
            <div className="md:col-span-6">
              <label className="block text-[11px] uppercase tracking-[0.18em] mb-1.5">
                Short Description
              </label>
              <input
                type="text"
                value={newServiceShort}
                onChange={(e) => setNewServiceShort(e.target.value)}
                placeholder="Concise editorial summary..."
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-3 py-2.5 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-1.5 border border-[#14251F] bg-[#14251F] py-2.5 text-xs uppercase tracking-[0.18em] text-[#F8F6F0]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  {srv.cover_image_url && (
                    <img
                      src={srv.cover_image_url}
                      alt={srv.title}
                      className="h-16 w-24 object-cover border border-[#14251F]/15 shrink-0"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={srv.title}
                      onChange={(e) =>
                        setServices((prev) =>
                          prev.map((s) => (s.id === srv.id ? { ...s, title: e.target.value } : s))
                        )
                      }
                      className="font-serif text-xl bg-transparent border-b border-transparent focus:border-[#B18A55] focus:outline-none w-full"
                    />
                    <input
                      type="text"
                      value={srv.short_description}
                      onChange={(e) =>
                        setServices((prev) =>
                          prev.map((s) =>
                            s.id === srv.id ? { ...s, short_description: e.target.value } : s
                          )
                        )
                      }
                      className="text-xs text-[#263C32] bg-transparent border-b border-transparent focus:border-[#B18A55] focus:outline-none w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="border border-[#14251F]/25 bg-[#F8F6F0] px-3 py-1.5 text-[11px] uppercase tracking-wider cursor-pointer">
                    Cover Image
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) =>
                        handleAssetUpload(e.target.files, 'image', 'services', async (url) => {
                          await upsertServiceAdmin({ ...srv, cover_image_url: url });
                          await loadSubTables();
                          await refreshSiteData();
                        })
                      }
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={async () => {
                      await upsertServiceAdmin(srv);
                      await refreshSiteData();
                      setMessage(`Saved "${srv.title}".`);
                    }}
                    className="border border-[#14251F] bg-[#14251F] px-3.5 py-1.5 text-[11px] uppercase tracking-wider text-[#F8F6F0]"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm(`Delete service "${srv.title}"?`)) return;
                      await deleteServiceAdmin(srv.id, srv.title);
                      await loadSubTables();
                      await refreshSiteData();
                    }}
                    className="border border-red-800/35 px-2.5 py-1.5 text-red-800"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TESTIMONIALS */}
      {tab === 'testimonials' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddTestimonial}
            className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6 space-y-4"
          >
            <h2 className="font-serif text-2xl text-[#14251F]">Add Genuine Client Testimonial</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                value={tName}
                onChange={(e) => setTName(e.target.value)}
                placeholder="Client Name *"
                className="border border-[#14251F]/20 bg-[#F8F6F0] px-3 py-2.5 text-sm"
              />
              <input
                type="text"
                value={tRole}
                onChange={(e) => setTRole(e.target.value)}
                placeholder="Role / Title (optional)"
                className="border border-[#14251F]/20 bg-[#F8F6F0] px-3 py-2.5 text-sm"
              />
              <input
                type="text"
                value={tEventType}
                onChange={(e) => setTEventType(e.target.value)}
                placeholder="Event Type (e.g., Destination Wedding) *"
                className="border border-[#14251F]/20 bg-[#F8F6F0] px-3 py-2.5 text-sm"
              />
            </div>
            <textarea
              rows={3}
              value={tQuote}
              onChange={(e) => setTQuote(e.target.value)}
              placeholder="Client testimonial quote *"
              className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-3 py-2.5 text-sm"
            />
            <div className="flex flex-wrap items-center gap-4">
              <label className="border border-[#14251F]/25 bg-[#F8F6F0] px-4 py-2 text-xs uppercase tracking-wider cursor-pointer">
                {tPhotoUrl ? 'Client Photo Uploaded ✓' : 'Optional Client Photo'}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) =>
                    handleAssetUpload(e.target.files, 'image', 'testimonials', setTPhotoUrl)
                  }
                  className="hidden"
                />
              </label>
              <label className="border border-[#14251F]/25 bg-[#F8F6F0] px-4 py-2 text-xs uppercase tracking-wider cursor-pointer">
                {tVideoUrl ? 'Video Uploaded ✓' : 'Optional Video Testimonial (MP4)'}
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={(e) =>
                    handleAssetUpload(e.target.files, 'video', 'testimonials', setTVideoUrl)
                  }
                  className="hidden"
                />
              </label>
              <button
                type="submit"
                disabled={saving}
                className="ml-auto border border-[#14251F] bg-[#14251F] px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-[#F8F6F0]"
              >
                Publish Testimonial
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="font-serif text-lg italic text-[#14251F]">“{t.quote}”</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#B18A55]">
                    {t.client_name} · {t.event_type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm(`Delete testimonial from ${t.client_name}?`)) return;
                    await deleteTestimonialAdmin(t.id, t.client_name);
                    await loadSubTables();
                    await refreshSiteData();
                  }}
                  className="text-red-800 p-1.5"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CLIENT LOGOS & GALLERY */}
      {tab === 'clients' && (
        <div className="space-y-8">
          <div className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6 space-y-5">
            <h2 className="font-serif text-2xl text-[#14251F]">
              Genuine Client &amp; Brand Partner Logos
            </h2>
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                value={logoName}
                onChange={(e) => setLogoName(e.target.value)}
                placeholder="Partner / Brand Name"
                className="border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-2.5 text-sm"
              />
              <label className="inline-flex items-center gap-2 border border-[#14251F] bg-[#14251F] px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-[#F8F6F0] cursor-pointer">
                <Upload className="h-3.5 w-3.5" />
                Upload &amp; Add Logo
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) =>
                    handleAssetUpload(e.target.files, 'image', 'client-logos', (url) => {
                      const next = [
                        ...(form.client_logos || []),
                        {
                          id: `${Date.now()}`,
                          name: logoName.trim() || 'Partner Brand',
                          logo_url: url,
                        },
                      ];
                      setForm((prev) => ({ ...prev, client_logos: next }));
                      setLogoName('');
                    })
                  }
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(form.client_logos || []).map((logo) => (
                <div
                  key={logo.id}
                  className="border border-[#14251F]/15 bg-[#F8F6F0] p-4 flex flex-col items-center gap-3"
                >
                  <img src={logo.logo_url} alt={logo.name} className="h-12 object-contain" />
                  <p className="text-xs text-[#14251F]">{logo.name}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        client_logos: prev.client_logos.filter((l) => l.id !== logo.id),
                      }))
                    }
                    className="text-[11px] text-red-800 underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6 space-y-5">
            <h2 className="font-serif text-2xl text-[#14251F]">Website Highlights Gallery</h2>
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                value={galleryTitle}
                onChange={(e) => setGalleryTitle(e.target.value)}
                placeholder="Image Caption / Title"
                className="border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-2.5 text-sm"
              />
              <input
                type="text"
                value={galleryCategory}
                onChange={(e) => setGalleryCategory(e.target.value)}
                placeholder="Category (optional)"
                className="border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-2.5 text-sm"
              />
              <label className="inline-flex items-center gap-2 border border-[#14251F] bg-[#14251F] px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-[#F8F6F0] cursor-pointer">
                <Upload className="h-3.5 w-3.5" />
                Add Gallery Image
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) =>
                    handleAssetUpload(e.target.files, 'image', 'gallery', (url) => {
                      const next = [
                        ...(form.website_gallery || []),
                        {
                          id: `${Date.now()}`,
                          title: galleryTitle.trim() || 'Studio Highlight',
                          category: galleryCategory.trim() || '',
                          image_url: url,
                        },
                      ];
                      setForm((prev) => ({ ...prev, website_gallery: next }));
                      setGalleryTitle('');
                      setGalleryCategory('');
                    })
                  }
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(form.website_gallery || []).map((g) => (
                <div key={g.id} className="border border-[#14251F]/15 bg-[#F8F6F0] p-2">
                  <img src={g.image_url} alt={g.title} className="aspect-square w-full object-cover" />
                  <div className="mt-2 flex items-center justify-between text-xs px-1">
                    <span className="truncate">{g.title}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          website_gallery: prev.website_gallery.filter((x) => x.id !== g.id),
                        }))
                      }
                      className="text-red-800"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: CONTACT & SOCIALS */}
      {tab === 'contact' && (
        <div className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={form.contact_phone || ''}
                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                placeholder="+1 555 234 5678"
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                WhatsApp Number (with country code)
              </label>
              <input
                type="text"
                value={form.contact_whatsapp || ''}
                onChange={(e) => setForm({ ...form, contact_whatsapp: e.target.value })}
                placeholder="+15552345678"
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                Company Email
              </label>
              <input
                type="email"
                value={form.contact_email || ''}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                placeholder="concierge@definingevents.com"
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                Google Maps Link
              </label>
              <input
                type="url"
                value={form.google_maps_url || ''}
                onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
              Studio Address
            </label>
            <input
              type="text"
              value={form.contact_address || ''}
              onChange={(e) => setForm({ ...form, contact_address: e.target.value })}
              placeholder="Street, Suite, City, Country"
              className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={form.instagram_url || ''}
                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={form.facebook_url || ''}
                onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={form.linkedin_url || ''}
                onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
