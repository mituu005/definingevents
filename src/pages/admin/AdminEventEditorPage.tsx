import {
  ArrowLeft,
  CheckCircle2,
  Film,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSiteData } from '@/contexts/SiteDataContext';
import {
  createMediaRecordAdmin,
  deleteMediaRecordAdmin,
  fetchEventByIdAdmin,
  saveEventAdmin,
} from '@/lib/api';
import { formatBytes, uploadMediaWithProgress, validateMediaFile } from '@/lib/media';
import {
  EVENT_CATEGORIES,
  type EventMedia,
  type EventStatus,
} from '@/types/database';

interface UploadTask {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  error?: string;
}

export function AdminEventEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { services, refreshSiteData } = useSiteData();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Event fields
  const [eventId, setEventId] = useState<string | undefined>(id);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(EVENT_CATEGORIES[0]);
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  const [creativeConcept, setCreativeConcept] = useState('');
  const [servicesProvided, setServicesProvided] = useState<string[]>([]);
  const [customService, setCustomService] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<EventStatus>('draft');
  const [clientTestimonial, setClientTestimonial] = useState('');
  const [clientTestimonialAuthor, setClientTestimonialAuthor] = useState('');

  // Cover & Transformation images
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverPath, setCoverPath] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverProgress, setCoverProgress] = useState<number | null>(null);

  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [beforePath, setBeforePath] = useState<string | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);

  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [afterPath, setAfterPath] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);

  // Gallery photos & videos
  const [mediaItems, setMediaItems] = useState<EventMedia[]>([]);
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);

  // Queued files if admin selects photos/videos before first save
  const [queuedMediaFiles, setQueuedMediaFiles] = useState<
    Array<{ file: File; type: 'image' | 'video'; localPreview: string }>
  >([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchEventByIdAdmin(id)
      .then((ev) => {
        if (!ev) {
          setError('Event not found.');
          return;
        }
        setEventId(ev.id);
        setTitle(ev.title);
        setCategory(ev.category);
        setLocation(ev.location);
        setEventDate(ev.event_date || '');
        setDescription(ev.description);
        setCreativeConcept(ev.creative_concept || '');
        setServicesProvided(ev.services_provided || []);
        setFeatured(ev.featured);
        setStatus(ev.status);
        setClientTestimonial(ev.client_testimonial || '');
        setClientTestimonialAuthor(ev.client_testimonial_author || '');

        setCoverUrl(ev.cover_image_url);
        setCoverPath(ev.cover_image_path);
        setCoverPreview(ev.resolved_cover_url || ev.cover_image_url);

        setBeforeUrl(ev.before_image_url);
        setBeforePath(ev.before_image_path);
        setBeforePreview(ev.resolved_before_url || ev.before_image_url);

        setAfterUrl(ev.after_image_url);
        setAfterPath(ev.after_image_path);
        setAfterPreview(ev.resolved_after_url || ev.after_image_url);

        setMediaItems(ev.media || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load event.'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleServiceTag = (srvTitle: string) => {
    setServicesProvided((prev) =>
      prev.includes(srvTitle) ? prev.filter((s) => s !== srvTitle) : [...prev, srvTitle]
    );
  };

  const addCustomServiceTag = () => {
    const clean = customService.trim();
    if (!clean) return;
    if (!servicesProvided.includes(clean)) {
      setServicesProvided((prev) => [...prev, clean]);
    }
    setCustomService('');
  };

  const handleCoverUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setError(null);

    const validation = validateMediaFile(file, 'image');
    if (!validation.valid) {
      setError(validation.error || 'Invalid cover image.');
      return;
    }

    const localObjUrl = URL.createObjectURL(file);
    setCoverPreview(localObjUrl);
    setCoverProgress(0);

    try {
      const uploaded = await uploadMediaWithProgress(file, 'event-images', 'covers', (pct) => {
        setCoverProgress(pct);
      });
      setCoverUrl(uploaded.publicUrl);
      setCoverPath(uploaded.path);
      setCoverProgress(null);
      setSuccessMsg('Cover image uploaded successfully.');
    } catch (err) {
      setCoverProgress(null);
      setError(err instanceof Error ? err.message : 'Cover upload failed.');
    }
  };

  const handleTransformationUpload = async (
    files: FileList | null,
    kind: 'before' | 'after'
  ) => {
    const file = files?.[0];
    if (!file) return;
    setError(null);

    const validation = validateMediaFile(file, 'image');
    if (!validation.valid) {
      setError(validation.error || 'Invalid image.');
      return;
    }

    const localUrl = URL.createObjectURL(file);
    if (kind === 'before') setBeforePreview(localUrl);
    else setAfterPreview(localUrl);

    try {
      const uploaded = await uploadMediaWithProgress(
        file,
        'event-images',
        `transformations/${kind}`
      );
      if (kind === 'before') {
        setBeforeUrl(uploaded.publicUrl);
        setBeforePath(uploaded.path);
      } else {
        setAfterUrl(uploaded.publicUrl);
        setAfterPath(uploaded.path);
      }
      setSuccessMsg(`Uploaded ${kind} transformation image.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transformation image upload failed.');
    }
  };

  const uploadBatchToEvent = async (
    targetEventId: string,
    files: Array<{ file: File; type: 'image' | 'video' }>
  ) => {
    const created: EventMedia[] = [];
    for (let i = 0; i < files.length; i++) {
      const { file, type } = files[i];
      const taskId = `${Date.now()}-${i}-${file.name}`;
      setUploadTasks((prev) => [
        ...prev,
        { id: taskId, fileName: file.name, progress: 0, status: 'uploading' },
      ]);

      try {
        const bucket = type === 'video' ? 'event-videos' : 'event-images';
        const uploaded = await uploadMediaWithProgress(
          file,
          bucket,
          `events/${targetEventId}`,
          (pct) => {
            setUploadTasks((prev) =>
              prev.map((t) => (t.id === taskId ? { ...t, progress: pct } : t))
            );
          }
        );

        const record = await createMediaRecordAdmin({
          event_id: targetEventId,
          media_type: type,
          file_name: uploaded.fileName,
          file_url: uploaded.publicUrl,
          storage_path: uploaded.path,
          storage_bucket: uploaded.bucket,
          file_size: uploaded.fileSize,
          mime_type: uploaded.mimeType,
          display_order: mediaItems.length + i,
          usage_scope: 'event',
        });

        created.push(record);
        setUploadTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, progress: 100, status: 'done' } : t))
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        setUploadTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: 'error', error: msg } : t))
        );
        setError(`Failed uploading ${file.name}: ${msg}`);
      }
    }

    if (created.length > 0) {
      setMediaItems((prev) => [...prev, ...created]);
      setSuccessMsg(`Uploaded ${created.length} file(s) successfully.`);
    }
  };

  const handleMultiMediaSelect = async (
    fileList: FileList | null,
    expected: 'image' | 'video'
  ) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setSuccessMsg(null);

    const validFiles: Array<{ file: File; type: 'image' | 'video' }> = [];
    for (const file of Array.from(fileList)) {
      const check = validateMediaFile(file, expected);
      if (!check.valid || !check.mediaType) {
        setError(check.error || 'Unsupported file.');
        return;
      }
      validFiles.push({ file, type: check.mediaType });
    }

    if (eventId) {
      await uploadBatchToEvent(eventId, validFiles);
    } else {
      // Queue files until event row is created on first Save/Publish
      const queued = validFiles.map((item) => ({
        ...item,
        localPreview: URL.createObjectURL(item.file),
      }));
      setQueuedMediaFiles((prev) => [...prev, ...queued]);
      setSuccessMsg(
        `${validFiles.length} ${expected}(s) queued. Click "Save as Draft" or "Publish Event" to upload and save.`
      );
    }
  };

  const handleRemoveExistingMedia = async (item: EventMedia) => {
    try {
      await deleteMediaRecordAdmin(item);
      setMediaItems((prev) => prev.filter((m) => m.id !== item.id));
      setSuccessMsg(`Removed ${item.file_name}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to remove media.');
    }
  };

  const handleSubmit = async (targetStatus: EventStatus) => {
    setError(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setError('Event title is required.');
      return;
    }
    if (!location.trim()) {
      setError('Event location is required.');
      return;
    }
    if (!description.trim()) {
      setError('Event description is required.');
      return;
    }

    setSaving(true);
    try {
      const saved = await saveEventAdmin({
        id: eventId,
        title,
        category,
        location,
        event_date: eventDate || null,
        description,
        creative_concept: creativeConcept || null,
        services_provided: servicesProvided,
        cover_image_url: coverUrl,
        cover_image_path: coverPath,
        before_image_url: beforeUrl,
        before_image_path: beforePath,
        after_image_url: afterUrl,
        after_image_path: afterPath,
        client_testimonial: clientTestimonial || null,
        client_testimonial_author: clientTestimonialAuthor || null,
        status: targetStatus,
        featured,
      });

      setEventId(saved.id);
      setStatus(saved.status);

      if (queuedMediaFiles.length > 0) {
        const filesToUpload = queuedMediaFiles.map(({ file, type }) => ({ file, type }));
        setQueuedMediaFiles([]);
        await uploadBatchToEvent(saved.id, filesToUpload);
      }

      await refreshSiteData();
      setSuccessMsg(
        targetStatus === 'published'
          ? 'Event published! It is now live on the public portfolio.'
          : `Event saved as ${targetStatus}.`
      );

      if (!isEditing) {
        navigate(`/admin/events/${saved.id}/edit`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-64 bg-[#EAE4D8] animate-pulse" />;
  }

  const photos = mediaItems.filter((m) => m.media_type === 'image');
  const videos = mediaItems.filter((m) => m.media_type === 'video');

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B18A55] mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Events</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#14251F]">
            {isEditing ? 'Edit Portfolio Event' : 'Create New Event'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit('draft')}
            className="border border-[#14251F] px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[#14251F] hover:bg-[#EAE4D8] disabled:opacity-50"
          >
            Save as Draft
          </button>

          {status === 'published' && (
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit('unpublished')}
              className="border border-stone-500 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-stone-700 hover:bg-stone-200 disabled:opacity-50"
            >
              Unpublish
            </button>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit('published')}
            className="border border-[#14251F] bg-[#14251F] px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-[#F8F6F0] hover:bg-[#B18A55] hover:border-[#B18A55] hover:text-[#14251F] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : status === 'published' ? 'Update Published Event' : 'Publish Event'}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="border border-red-700/35 bg-red-50 p-4 text-sm text-red-900">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 border border-emerald-700/35 bg-emerald-50 p-4 text-sm text-emerald-900">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl text-[#14251F] border-b border-[#14251F]/10 pb-3">
              Event Narrative &amp; Details
            </h2>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#263C32] mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Lake Como Royal Villa Wedding"
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm text-[#14251F] focus:border-[#B18A55] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#263C32] mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-3 py-3 text-sm text-[#14251F] focus:border-[#B18A55] focus:outline-none"
                >
                  {EVENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#263C32] mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm text-[#14251F] focus:border-[#B18A55] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#263C32] mb-2">
                  Event Date (Optional)
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm text-[#14251F] focus:border-[#B18A55] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#263C32] mb-2">
                Event Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the occasion, architectural setting, guest journey, and execution highlights..."
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm text-[#14251F] focus:border-[#B18A55] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#263C32] mb-2">
                Creative Concept
              </label>
              <textarea
                rows={3}
                value={creativeConcept}
                onChange={(e) => setCreativeConcept(e.target.value)}
                placeholder="Describe the design thesis, colour palette, lighting direction, and spatial story..."
                className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-3 text-sm text-[#14251F] focus:border-[#B18A55] focus:outline-none"
              />
            </div>

            {/* Services Provided */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#263C32] mb-3">
                Services Provided
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {services.map((srv) => {
                  const selected = servicesProvided.includes(srv.title);
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => toggleServiceTag(srv.title)}
                      className={`px-3 py-1.5 text-xs border transition-colors ${
                        selected
                          ? 'border-[#14251F] bg-[#14251F] text-[#F8F6F0]'
                          : 'border-[#14251F]/20 bg-[#F8F6F0] text-[#263C32]'
                      }`}
                    >
                      {srv.title}
                    </button>
                  );
                })}
                {servicesProvided
                  .filter((tag) => !services.some((s) => s.title === tag))
                  .map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleServiceTag(tag)}
                      className="px-3 py-1.5 text-xs border border-[#B18A55] bg-[#B18A55]/20 text-[#14251F]"
                    >
                      {tag} ×
                    </button>
                  ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customService}
                  onChange={(e) => setCustomService(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomServiceTag();
                    }
                  }}
                  placeholder="Add custom service tag..."
                  className="flex-1 border border-[#14251F]/20 bg-[#F8F6F0] px-3 py-2 text-xs focus:border-[#B18A55] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomServiceTag}
                  className="inline-flex items-center gap-1 border border-[#14251F]/25 px-3 py-2 text-xs uppercase tracking-wider"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>
            </div>

            {/* Optional Client Testimonial */}
            <div className="border-t border-[#14251F]/12 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#263C32] mb-2">
                  Client Testimonial (Optional)
                </label>
                <textarea
                  rows={2}
                  value={clientTestimonial}
                  onChange={(e) => setClientTestimonial(e.target.value)}
                  placeholder="Genuine quote from the client for this specific event..."
                  className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-2.5 text-sm focus:border-[#B18A55] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#263C32] mb-2">
                  Client Name / Host
                </label>
                <input
                  type="text"
                  value={clientTestimonialAuthor}
                  onChange={(e) => setClientTestimonialAuthor(e.target.value)}
                  placeholder="e.g., Elena & Julian"
                  className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-4 py-2.5 text-sm focus:border-[#B18A55] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Upload Photographs & Videos */}
          <div className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl text-[#14251F] border-b border-[#14251F]/10 pb-3">
              Event Photographs &amp; Videos
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Multiple Photos Input */}
              <label className="flex flex-col items-center justify-center border border-dashed border-[#B18A55] bg-[#F8F6F0] p-6 text-center cursor-pointer hover:bg-[#EAE4D8]/50 transition-colors">
                <ImageIcon className="h-7 w-7 text-[#B18A55] mb-2" />
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#14251F]">
                  Upload Photographs
                </span>
                <span className="mt-1 text-[11px] text-[#263C32]/75">
                  JPG, JPEG, PNG, WEBP · Multiple files · Mobile &amp; Desktop
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => {
                    handleMultiMediaSelect(e.target.files, 'image');
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>

              {/* Multiple Videos Input */}
              <label className="flex flex-col items-center justify-center border border-dashed border-[#14251F]/40 bg-[#F8F6F0] p-6 text-center cursor-pointer hover:bg-[#EAE4D8]/50 transition-colors">
                <Film className="h-7 w-7 text-[#14251F] mb-2" />
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#14251F]">
                  Upload Event Videos
                </span>
                <span className="mt-1 text-[11px] text-[#263C32]/75">
                  MP4 format · Max 150 MB per video · H.264 recommended
                </span>
                <input
                  type="file"
                  multiple
                  accept="video/mp4"
                  onChange={(e) => {
                    handleMultiMediaSelect(e.target.files, 'video');
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Active Upload Progress */}
            {uploadTasks.length > 0 && (
              <div className="space-y-2 bg-[#F8F6F0] p-4 border border-[#14251F]/12">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#263C32]">
                  Upload Progress
                </p>
                {uploadTasks.map((t) => (
                  <div key={t.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="truncate max-w-xs">{t.fileName}</span>
                      <span
                        className={
                          t.status === 'error'
                            ? 'text-red-700'
                            : t.status === 'done'
                            ? 'text-emerald-800'
                            : 'text-[#B18A55]'
                        }
                      >
                        {t.status === 'error' ? t.error : `${t.progress}%`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#EAE4D8] overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          t.status === 'error' ? 'bg-red-600' : 'bg-[#B18A55]'
                        }`}
                        style={{ width: `${t.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Queued (unsaved new event) previews */}
            {queuedMediaFiles.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#B18A55]">
                  Ready to Upload on Save ({queuedMediaFiles.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {queuedMediaFiles.map((q, idx) => (
                    <div
                      key={q.localPreview}
                      className="relative aspect-square border border-[#B18A55]/40 bg-[#14251F] overflow-hidden"
                    >
                      {q.type === 'video' ? (
                        <video src={q.localPreview} className="h-full w-full object-cover" />
                      ) : (
                        <img
                          src={q.localPreview}
                          alt={q.file.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setQueuedMediaFiles((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="absolute top-1.5 right-1.5 bg-red-800 p-1 text-white"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Photos Grid */}
            {photos.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#263C32] mb-3">
                  Uploaded Photographs ({photos.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-square border border-[#14251F]/15 bg-[#14251F] overflow-hidden"
                    >
                      <img
                        src={photo.signed_url || photo.file_url}
                        alt={photo.file_name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingMedia(photo)}
                        aria-label={`Remove ${photo.file_name}`}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center bg-red-800/90 text-white opacity-90 hover:bg-red-900"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Videos Grid */}
            {videos.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#263C32] mb-3">
                  Uploaded Videos ({videos.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videos.map((vid) => (
                    <div key={vid.id} className="border border-[#14251F]/15 bg-[#F8F6F0] p-3">
                      <video
                        src={vid.signed_url || vid.file_url}
                        controls
                        className="aspect-video w-full bg-black"
                      />
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="truncate max-w-[200px]">
                          {vid.file_name} ({formatBytes(vid.file_size)})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingMedia(vid)}
                          className="text-red-800 hover:underline inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing & Featured */}
          <div className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#14251F]">Visibility &amp; Placement</h2>
            <p className="text-xs text-[#263C32]/80">
              Current Status:{' '}
              <strong className="uppercase tracking-wider text-[#14251F]">{status}</strong>
            </p>
            <label className="flex items-center gap-3 text-sm text-[#14251F] cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 accent-[#14251F]"
              />
              <span>Feature prominently at top of portfolio</span>
            </label>
          </div>

          {/* Cover Image */}
          <div className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#14251F]">Featured Cover Image</h2>
            {coverPreview && (
              <div className="aspect-[16/10] overflow-hidden border border-[#14251F]/15 bg-[#14251F]">
                <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
              </div>
            )}

            {coverProgress !== null && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Uploading cover...</span>
                  <span>{coverProgress}%</span>
                </div>
                <div className="h-1.5 bg-[#F8F6F0]">
                  <div
                    className="h-full bg-[#B18A55]"
                    style={{ width: `${coverProgress}%` }}
                  />
                </div>
              </div>
            )}

            <label className="flex items-center justify-center gap-2 border border-[#14251F] bg-[#F8F6F0] py-3 text-xs uppercase tracking-[0.18em] text-[#14251F] cursor-pointer hover:bg-[#14251F] hover:text-[#F8F6F0] transition-colors">
              <Upload className="h-3.5 w-3.5" />
              <span>{coverPreview ? 'Replace Cover Image' : 'Upload Cover Image'}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => {
                  handleCoverUpload(e.target.files);
                  e.target.value = '';
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* Optional Before & After Transformation */}
          <div className="border border-[#14251F]/15 bg-[#EAE4D8]/45 p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#14251F]">
              Before / After Transformation (Optional)
            </h2>
            <p className="text-xs text-[#263C32]/75">
              Upload raw venue and finished design photos to enable the interactive comparison
              slider.
            </p>

            <div className="space-y-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#263C32] mb-1.5">
                  Before Photo
                </p>
                {beforePreview && (
                  <img
                    src={beforePreview}
                    alt="Before venue"
                    className="aspect-video w-full object-cover mb-2 border border-[#14251F]/15"
                  />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleTransformationUpload(e.target.files, 'before')}
                  className="text-xs w-full"
                />
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#263C32] mb-1.5">
                  After Photo
                </p>
                {afterPreview && (
                  <img
                    src={afterPreview}
                    alt="After venue"
                    className="aspect-video w-full object-cover mb-2 border border-[#14251F]/15"
                  />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleTransformationUpload(e.target.files, 'after')}
                  className="text-xs w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
