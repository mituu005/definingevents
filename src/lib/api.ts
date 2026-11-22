import { DEFAULT_SERVICES, DEFAULT_SETTINGS } from '@/lib/defaults';
import { batchResolveStorageUrls, resolveStorageUrl, slugify } from '@/lib/media';
import { supabase } from '@/lib/supabase';
import type {
  ActivityLog,
  EnquiryRecord,
  EnquiryStatus,
  EventMedia,
  EventRecord,
  EventStatus,
  ServiceRecord,
  TestimonialRecord,
  WebsiteSettings,
} from '@/types/database';

// ============================================================================
// PUBLIC DATA FETCHERS
// ============================================================================

export async function fetchWebsiteSettings(): Promise<WebsiteSettings> {
  if (!supabase) return DEFAULT_SETTINGS;

  const { data, error } = await supabase
    .from('website_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error || !data) {
    return DEFAULT_SETTINGS;
  }

  return {
    ...DEFAULT_SETTINGS,
    ...data,
    client_logos: Array.isArray(data.client_logos) ? data.client_logos : [],
    website_gallery: Array.isArray(data.website_gallery) ? data.website_gallery : [],
  };
}

export async function fetchServices(onlyActive = true): Promise<ServiceRecord[]> {
  if (!supabase) return DEFAULT_SERVICES;

  let query = supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (onlyActive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    return onlyActive ? DEFAULT_SERVICES : [];
  }
  return data as ServiceRecord[];
}

export async function fetchPublishedEvents(): Promise<EventRecord[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('events')
    .select('*, media:event_media(*)')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('event_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const events = ((data || []) as EventRecord[]).filter((ev) => {
    // Exclude test/placeholder records (e.g. "ABC", "abcd", or "test")
    const titleLower = ev.title?.trim().toLowerCase() || '';
    const descLower = ev.description?.trim().toLowerCase() || '';
    if (titleLower === 'abc' || titleLower === 'test' || descLower === 'abcd') {
      return false;
    }
    // Only display events that have photos, videos, or cover image attached
    const hasCover = Boolean(ev.cover_image_url || ev.cover_image_path);
    const hasMedia = Array.isArray(ev.media) && ev.media.length > 0 && ev.media.some((m) => Boolean(m.file_url || m.storage_path));
    return hasCover || hasMedia;
  });
  return hydrateEventMediaUrls(events);
}

export async function fetchPublishedEventBySlug(slug: string): Promise<EventRecord | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('events')
    .select('*, media:event_media(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) return null;

  const [hydrated] = await hydrateEventMediaUrls([data as EventRecord]);
  if (hydrated.media) {
    hydrated.media.sort((a, b) => a.display_order - b.display_order);
  }
  return hydrated;
}

export async function fetchPublishedTestimonials(): Promise<TestimonialRecord[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }
  return (data || []) as TestimonialRecord[];
}

export interface NewEnquiryPayload {
  full_name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string | null;
  event_location: string | null;
  guest_count: string | null;
  budget: string | null;
  requirements: string | null;
}

export async function submitEnquiry(payload: NewEnquiryPayload): Promise<void> {
  if (!supabase) {
    throw new Error(
      'Backend database is not connected yet. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to receive enquiries.'
    );
  }

  const { error } = await supabase.from('enquiries').insert({
    full_name: payload.full_name.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim(),
    event_type: payload.event_type.trim(),
    event_date: payload.event_date || null,
    event_location: payload.event_location?.trim() || null,
    guest_count: payload.guest_count?.trim() || null,
    budget: payload.budget?.trim() || null,
    requirements: payload.requirements?.trim() || null,
    status: 'new',
  });

  if (error) {
    throw new Error(error.message);
  }
}

// ============================================================================
// MEDIA URL HYDRATION (PRIVATE SIGNED URLS)
// ============================================================================

async function hydrateEventMediaUrls(events: EventRecord[]): Promise<EventRecord[]> {
  if (events.length === 0) return events;

  const toResolve: Array<{ bucket: string; path: string; fallbackUrl?: string | null }> = [];

  for (const ev of events) {
    if (ev.cover_image_path) {
      toResolve.push({
        bucket: 'event-images',
        path: ev.cover_image_path,
        fallbackUrl: ev.cover_image_url,
      });
    }
    if (ev.before_image_path) {
      toResolve.push({
        bucket: 'event-images',
        path: ev.before_image_path,
        fallbackUrl: ev.before_image_url,
      });
    }
    if (ev.after_image_path) {
      toResolve.push({
        bucket: 'event-images',
        path: ev.after_image_path,
        fallbackUrl: ev.after_image_url,
      });
    }
    for (const m of ev.media || []) {
      if (m.storage_path) {
        toResolve.push({
          bucket: m.storage_bucket || (m.media_type === 'video' ? 'event-videos' : 'event-images'),
          path: m.storage_path,
          fallbackUrl: m.file_url,
        });
      }
    }
  }

  const signedMap = await batchResolveStorageUrls(toResolve);

  return events.map((ev) => ({
    ...ev,
    resolved_cover_url: ev.cover_image_path
      ? signedMap.get(`event-images:${ev.cover_image_path}`) ?? ev.cover_image_url
      : ev.cover_image_url,
    resolved_before_url: ev.before_image_path
      ? signedMap.get(`event-images:${ev.before_image_path}`) ?? ev.before_image_url
      : ev.before_image_url,
    resolved_after_url: ev.after_image_path
      ? signedMap.get(`event-images:${ev.after_image_path}`) ?? ev.after_image_url
      : ev.after_image_url,
    media: (ev.media || []).map((m) => {
      const bucket = m.storage_bucket || (m.media_type === 'video' ? 'event-videos' : 'event-images');
      return {
        ...m,
        signed_url: m.storage_path
          ? signedMap.get(`${bucket}:${m.storage_path}`) ?? m.file_url
          : m.file_url,
      };
    }),
  }));
}

// ============================================================================
// ADMIN: DASHBOARD & ACTIVITY LOGS
// ============================================================================

export async function logActivity(
  action: string,
  entityType: string,
  entityTitle?: string | null
): Promise<void> {
  if (!supabase) return;
  const { data } = await supabase.auth.getUser();
  await supabase.from('activity_logs').insert({
    action,
    entity_type: entityType,
    entity_title: entityTitle ?? null,
    actor_email: data.user?.email ?? null,
  });
}

export interface AdminOverviewStats {
  publishedEvents: number;
  draftEvents: number;
  unpublishedEvents: number;
  totalPhotos: number;
  totalVideos: number;
  newEnquiries: number;
  recentEnquiries: EnquiryRecord[];
  recentActivities: ActivityLog[];
}

export async function fetchAdminOverview(): Promise<AdminOverviewStats> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const [eventsRes, mediaRes, enquiriesRes, activitiesRes] = await Promise.all([
    supabase.from('events').select('id, status'),
    supabase.from('event_media').select('id, media_type'),
    supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const events = eventsRes.data || [];
  const media = mediaRes.data || [];
  const enquiries = (enquiriesRes.data || []) as EnquiryRecord[];
  const activities = (activitiesRes.data || []) as ActivityLog[];

  const { count: newEnqCount } = await supabase
    .from('enquiries')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');

  return {
    publishedEvents: events.filter((e) => e.status === 'published').length,
    draftEvents: events.filter((e) => e.status === 'draft').length,
    unpublishedEvents: events.filter((e) => e.status === 'unpublished').length,
    totalPhotos: media.filter((m) => m.media_type === 'image').length,
    totalVideos: media.filter((m) => m.media_type === 'video').length,
    newEnquiries: newEnqCount ?? enquiries.filter((e) => e.status === 'new').length,
    recentEnquiries: enquiries,
    recentActivities: activities,
  };
}

// ============================================================================
// ADMIN: EVENTS CRUD
// ============================================================================

export async function fetchAllEventsAdmin(): Promise<EventRecord[]> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('events')
    .select('*, media:event_media(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return hydrateEventMediaUrls((data || []) as EventRecord[]);
}

export async function fetchEventByIdAdmin(id: string): Promise<EventRecord | null> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('events')
    .select('*, media:event_media(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const [hydrated] = await hydrateEventMediaUrls([data as EventRecord]);
  if (hydrated.media) {
    hydrated.media.sort((a, b) => a.display_order - b.display_order);
  }
  return hydrated;
}

export interface SaveEventInput {
  id?: string;
  title: string;
  category: string;
  location: string;
  event_date: string | null;
  description: string;
  creative_concept: string | null;
  services_provided: string[];
  cover_image_url: string | null;
  cover_image_path: string | null;
  client_testimonial: string | null;
  client_testimonial_author: string | null;
  before_image_url?: string | null;
  before_image_path?: string | null;
  after_image_url?: string | null;
  after_image_path?: string | null;
  status: EventStatus;
  featured: boolean;
}

export async function saveEventAdmin(input: SaveEventInput): Promise<EventRecord> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data: userData } = await supabase.auth.getUser();

  if (input.id) {
    const { data, error } = await supabase
      .from('events')
      .update({
        title: input.title.trim(),
        category: input.category,
        location: input.location.trim(),
        event_date: input.event_date || null,
        description: input.description.trim(),
        creative_concept: input.creative_concept?.trim() || null,
        services_provided: input.services_provided,
        cover_image_url: input.cover_image_url,
        cover_image_path: input.cover_image_path,
        client_testimonial: input.client_testimonial?.trim() || null,
        client_testimonial_author: input.client_testimonial_author?.trim() || null,
        before_image_url: input.before_image_url ?? null,
        before_image_path: input.before_image_path ?? null,
        after_image_url: input.after_image_url ?? null,
        after_image_path: input.after_image_path ?? null,
        status: input.status,
        featured: input.featured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.id)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    await logActivity(`Updated event (${input.status})`, 'event', input.title);
    return data as EventRecord;
  }

  const baseSlug = slugify(input.title) || 'event';
  const uniqueSlug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

  const { data, error } = await supabase
    .from('events')
    .insert({
      title: input.title.trim(),
      slug: uniqueSlug,
      category: input.category,
      location: input.location.trim(),
      event_date: input.event_date || null,
      description: input.description.trim(),
      creative_concept: input.creative_concept?.trim() || null,
      services_provided: input.services_provided,
      cover_image_url: input.cover_image_url,
      cover_image_path: input.cover_image_path,
      client_testimonial: input.client_testimonial?.trim() || null,
      client_testimonial_author: input.client_testimonial_author?.trim() || null,
      before_image_url: input.before_image_url ?? null,
      before_image_path: input.before_image_path ?? null,
      after_image_url: input.after_image_url ?? null,
      after_image_path: input.after_image_path ?? null,
      status: input.status,
      featured: input.featured,
      created_by: userData.user?.id ?? null,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  await logActivity(`Created event (${input.status})`, 'event', input.title);
  return data as EventRecord;
}

export async function updateEventStatusAdmin(
  id: string,
  title: string,
  status: EventStatus
): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('events')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);
  await logActivity(`Changed event status to ${status}`, 'event', title);
}

export async function deleteEventAdmin(event: EventRecord): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  // Collect all storage paths to clean up
  const pathsByBucket = new Map<string, string[]>();
  const addPath = (bucket: string, path?: string | null) => {
    if (!path) return;
    const arr = pathsByBucket.get(bucket) ?? [];
    arr.push(path);
    pathsByBucket.set(bucket, arr);
  };

  addPath('event-images', event.cover_image_path);
  addPath('event-images', event.before_image_path);
  addPath('event-images', event.after_image_path);

  const { data: mediaRows } = await supabase
    .from('event_media')
    .select('*')
    .eq('event_id', event.id);

  for (const m of (mediaRows || []) as EventMedia[]) {
    const bucket = m.storage_bucket || (m.media_type === 'video' ? 'event-videos' : 'event-images');
    addPath(bucket, m.storage_path);
  }

  for (const [bucket, paths] of pathsByBucket.entries()) {
    if (paths.length > 0) {
      await supabase.storage.from(bucket).remove(paths);
    }
  }

  const { error } = await supabase.from('events').delete().eq('id', event.id);
  if (error) throw new Error(error.message);

  await logActivity('Deleted event and associated media', 'event', event.title);
}

// ============================================================================
// ADMIN: MEDIA LIBRARY
// ============================================================================

export interface CreateMediaRecordInput {
  event_id: string | null;
  media_type: 'image' | 'video';
  file_name: string;
  file_url: string;
  storage_path: string;
  storage_bucket: string;
  file_size: number;
  mime_type: string;
  caption?: string | null;
  display_order?: number;
  usage_scope?: 'event' | 'website';
}

export async function createMediaRecordAdmin(input: CreateMediaRecordInput): Promise<EventMedia> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('event_media')
    .insert({
      event_id: input.event_id,
      media_type: input.media_type,
      file_name: input.file_name,
      file_url: input.file_url,
      storage_path: input.storage_path,
      storage_bucket: input.storage_bucket,
      file_size: input.file_size,
      mime_type: input.mime_type,
      caption: input.caption ?? null,
      display_order: input.display_order ?? 0,
      usage_scope: input.usage_scope ?? (input.event_id ? 'event' : 'website'),
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  const record = data as EventMedia;
  const signedUrl = await resolveStorageUrl(
    record.storage_bucket,
    record.storage_path,
    record.file_url
  );
  return { ...record, signed_url: signedUrl ?? record.file_url };
}

export interface MediaWithEvent extends EventMedia {
  event?: { id: string; title: string; status: EventStatus } | null;
}

export async function fetchAllMediaAdmin(): Promise<MediaWithEvent[]> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('event_media')
    .select('*, event:events(id, title, status)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (data || []) as MediaWithEvent[];
  const signedMap = await batchResolveStorageUrls(
    rows
      .filter((r) => Boolean(r.storage_path))
      .map((r) => ({
        bucket: r.storage_bucket || (r.media_type === 'video' ? 'event-videos' : 'event-images'),
        path: r.storage_path,
        fallbackUrl: r.file_url,
      }))
  );

  return rows.map((r) => {
    const bucket = r.storage_bucket || (r.media_type === 'video' ? 'event-videos' : 'event-images');
    return {
      ...r,
      signed_url: r.storage_path
        ? signedMap.get(`${bucket}:${r.storage_path}`) ?? r.file_url
        : r.file_url,
    };
  });
}

export async function deleteMediaRecordAdmin(media: EventMedia): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  if (media.storage_path) {
    const bucket =
      media.storage_bucket || (media.media_type === 'video' ? 'event-videos' : 'event-images');
    await supabase.storage.from(bucket).remove([media.storage_path]);
  }

  const { error } = await supabase.from('event_media').delete().eq('id', media.id);
  if (error) throw new Error(error.message);

  await logActivity('Deleted media file', 'media', media.file_name);
}

// ============================================================================
// ADMIN: WEBSITE CONTENT MANAGEMENT
// ============================================================================

export async function updateWebsiteSettingsAdmin(
  updates: Partial<WebsiteSettings>
): Promise<WebsiteSettings> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const payload = {
    id: 1,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('website_settings')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  await logActivity('Updated website settings', 'settings', 'Website Configuration');
  return data as WebsiteSettings;
}

export async function upsertServiceAdmin(
  service: Partial<ServiceRecord> & { title: string; short_description: string }
): Promise<ServiceRecord> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const payload = {
    ...(service.id ? { id: service.id } : {}),
    title: service.title.trim(),
    slug: service.slug || slugify(service.title),
    short_description: service.short_description.trim(),
    full_description: service.full_description?.trim() || null,
    highlights: service.highlights || [],
    cover_image_url: service.cover_image_url || null,
    cover_image_path: service.cover_image_path || null,
    display_order: service.display_order ?? 0,
    is_active: service.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('services')
    .upsert(payload)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  await logActivity(service.id ? 'Updated service' : 'Created service', 'service', service.title);
  return data as ServiceRecord;
}

export async function deleteServiceAdmin(id: string, title: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await logActivity('Deleted service', 'service', title);
}

export async function fetchAllTestimonialsAdmin(): Promise<TestimonialRecord[]> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as TestimonialRecord[];
}

export async function upsertTestimonialAdmin(
  item: Partial<TestimonialRecord> & {
    client_name: string;
    event_type: string;
    quote: string;
  }
): Promise<TestimonialRecord> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const payload = {
    ...(item.id ? { id: item.id } : {}),
    client_name: item.client_name.trim(),
    client_role: item.client_role?.trim() || null,
    event_type: item.event_type.trim(),
    quote: item.quote.trim(),
    client_photo_url: item.client_photo_url || null,
    video_url: item.video_url || null,
    is_published: item.is_published ?? true,
    display_order: item.display_order ?? 0,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('testimonials')
    .upsert(payload)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  await logActivity(
    item.id ? 'Updated testimonial' : 'Added testimonial',
    'testimonial',
    item.client_name
  );
  return data as TestimonialRecord;
}

export async function deleteTestimonialAdmin(id: string, clientName: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await logActivity('Deleted testimonial', 'testimonial', clientName);
}

// ============================================================================
// ADMIN: ENQUIRIES MANAGEMENT
// ============================================================================

export async function fetchEnquiriesAdmin(): Promise<EnquiryRecord[]> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as EnquiryRecord[];
}

export async function updateEnquiryStatusAdmin(
  id: string,
  clientName: string,
  status: EnquiryStatus,
  adminNotes?: string | null
): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (adminNotes !== undefined) {
    updates.admin_notes = adminNotes;
  }

  const { error } = await supabase.from('enquiries').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
  await logActivity(`Marked enquiry as ${status}`, 'enquiry', clientName);
}

export async function deleteEnquiryAdmin(id: string, clientName: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase.from('enquiries').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await logActivity('Deleted enquiry', 'enquiry', clientName);
}
