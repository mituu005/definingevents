export type EventStatus = 'draft' | 'published' | 'unpublished';
export type EnquiryStatus = 'new' | 'contacted' | 'completed';
export type MediaType = 'image' | 'video';

export const EVENT_CATEGORIES = [
  'Weddings',
  'Corporate Events',
  'Private Celebrations',
  'Concerts and Entertainment',
  'Exhibitions',
  'Destination Events',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

export interface EventMedia {
  id: string;
  event_id: string | null;
  media_type: MediaType;
  file_name: string;
  file_url: string;
  storage_path: string;
  storage_bucket: string;
  file_size: number | null;
  mime_type: string | null;
  caption: string | null;
  display_order: number;
  usage_scope: 'event' | 'website';
  created_at: string;
  signed_url?: string;
}

export interface EventRecord {
  id: string;
  title: string;
  slug: string;
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
  before_image_url: string | null;
  before_image_path: string | null;
  after_image_url: string | null;
  after_image_path: string | null;
  status: EventStatus;
  featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  media?: EventMedia[];
  resolved_cover_url?: string | null;
  resolved_before_url?: string | null;
  resolved_after_url?: string | null;
}

export interface ServiceRecord {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string | null;
  highlights: string[];
  cover_image_url: string | null;
  cover_image_path: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestimonialRecord {
  id: string;
  client_name: string;
  client_role: string | null;
  event_type: string;
  quote: string;
  client_photo_url: string | null;
  video_url: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ClientLogo {
  id: string;
  name: string;
  logo_url: string;
}

export interface WebsiteGalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
}

export interface WebsiteSettings {
  id: number;
  company_name: string;
  tagline: string | null;
  logo_url: string | null;
  hero_headline: string;
  hero_subtitle: string;
  hero_video_url: string | null;
  hero_poster_url: string | null;
  show_stats: boolean;
  stat_years: string | null;
  stat_events: string | null;
  stat_clients: string | null;
  stat_cities: string | null;
  about_headline: string;
  about_intro: string | null;
  about_vision: string | null;
  about_mission: string | null;
  about_philosophy: string | null;
  about_why_us: string | null;
  about_image_url: string | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  contact_email: string | null;
  contact_address: string | null;
  google_maps_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  client_logos: ClientLogo[];
  website_gallery: WebsiteGalleryItem[];
  updated_at: string;
}

export interface EnquiryRecord {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string | null;
  event_location: string | null;
  guest_count: string | null;
  budget: string | null;
  requirements: string | null;
  status: EnquiryStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_title: string | null;
  actor_email: string | null;
  created_at: string;
}
