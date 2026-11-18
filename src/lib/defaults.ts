import type { ServiceRecord, WebsiteSettings } from '@/types/database';

// Award-winning luxury event production visual assets (Local high-definition showreel)
export const DEFAULT_HERO_VIDEO = '/showreel.mp4';

// Awe-inspiring candlelit floral architecture and luxury gala scenography
export const DEFAULT_HERO_POSTER =
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=90';

export const DEFAULT_ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=90';

export const DEFAULT_SETTINGS: WebsiteSettings = {
  id: 1,
  company_name: 'Defining Events',
  tagline: 'Immersive Celebrations & Landmark Event Architecture',
  logo_url: '/logo.png',
  hero_headline: 'Unforgettable Nights. Epic Celebrations.',
  hero_subtitle:
    'We design, plan, and produce high-energy luxury celebrations, grand concerts, and unforgettable private galas where every moment comes alive.',
  hero_video_url: DEFAULT_HERO_VIDEO,
  hero_poster_url: DEFAULT_HERO_POSTER,
  show_stats: true,
  stat_years: '12+',
  stat_events: '500+',
  stat_clients: '450+',
  stat_cities: '28',
  about_headline: 'Turning Blank Spaces Into Living Emotional Masterpieces.',
  about_intro:
    'Defining Events is an internationally acclaimed event architecture and luxury production atelier. From royal palatial weddings and private island celebrations to stadium-scale summits and couture product reveals, we unite atelier-level artistic direction with military-grade production engineering.',
  about_vision:
    'To elevate every gathering into an enduring cultural memory—where spatial design, sensory storytelling, and effortless hospitality converge.',
  about_mission:
    'To partner closely with discerning hosts and global brands, delivering end-to-end curation, disciplined budgeting, and calm on-site mastery across every continent.',
  about_philosophy:
    'True luxury resides in proportion, atmosphere, and invisibly seamless execution. Every texture, light cue, and culinary cadence is composed around your story.',
  about_why_us:
    'Clients entrust us with their most consequential milestones because we unite atelier-level creative direction with battle-tested production engineering.',
  about_image_url: DEFAULT_ABOUT_IMAGE,
  contact_phone: '+1 (555) 323-4646',
  contact_whatsapp: '+15553234646',
  contact_email: 'concierge@definingevents.com',
  contact_address: 'Belgravia Creative Studio & Global Production Hub',
  google_maps_url: '',
  instagram_url: 'https://instagram.com',
  facebook_url: 'https://facebook.com',
  linkedin_url: 'https://linkedin.com',
  client_logos: [],
  website_gallery: [],
  updated_at: new Date().toISOString(),
};

export const DEFAULT_SERVICES: ServiceRecord[] = [
  {
    id: 'default-luxury-weddings',
    title: 'Luxury Weddings',
    slug: 'luxury-weddings',
    short_description:
      'Editorial floral architecture, bespoke hospitality, and multi-day wedding production crafted with timeless grace.',
    full_description:
      'From heritage estates to contemporary glass pavilions, we direct every facet of your wedding weekend—spatial scenography, couture floral installation, guest concierge, lighting design, and minute-by-minute show calling.',
    highlights: [
      'Full creative direction & mood architecture',
      'Custom set fabrication & botanical installations',
      'Private guest concierge & travel logistics',
      'Discreet multi-team production command',
    ],
    cover_image_url:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    cover_image_path: null,
    display_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'default-destination-weddings',
    title: 'Destination Weddings',
    slug: 'destination-weddings',
    short_description:
      'Seamless international celebrations across palatial villas, coastal sanctuaries, and historic chateaux.',
    full_description:
      'We scout iconic private venues worldwide and manage cross-border production, local artisans, charter logistics, and multi-day guest itineraries so your celebration feels effortless anywhere on earth.',
    highlights: [
      'Global venue scouting & private buyouts',
      'International vendor & customs coordination',
      'Multi-day cultural & hospitality programming',
      'Dedicated bilingual on-site directors',
    ],
    cover_image_url:
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
    cover_image_path: null,
    display_order: 2,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'default-corporate-events',
    title: 'Corporate Events & Summits',
    slug: 'corporate-events',
    short_description:
      'Executive summits, leadership retreats, and black-tie gala dinners engineered to reflect brand prestige.',
    full_description:
      'We translate corporate identity into physical environments that command authority—combining broadcast-grade AV, keynote stagecraft, VIP protocol, and refined dining experiences.',
    highlights: [
      'Keynote stage design & broadcast AV',
      'C-suite protocol & VIP hospitality',
      'Brand environment & spatial storytelling',
      'Precision run-of-show & risk management',
    ],
    cover_image_url:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    cover_image_path: null,
    display_order: 3,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'default-birthday-celebrations',
    title: 'Milestone Celebrations',
    slug: 'birthday-celebrations',
    short_description:
      'Milestone soirées and private estate dinners tailored with theatrical lighting, music, and gastronomy.',
    full_description:
      'Whether an intimate candlelit long-table dinner for forty or a late-night architectural pavilion transformation, our milestone celebrations reflect the host’s distinct personality.',
    highlights: [
      'Bespoke theme & tablescape styling',
      'Curated live artists & acoustic engineering',
      'Sommelier & tasting menu curation',
      'Private security & discreet execution',
    ],
    cover_image_url:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    cover_image_path: null,
    display_order: 4,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'default-private-parties',
    title: 'Private Galas & Soirées',
    slug: 'private-parties',
    short_description:
      'Invitation-only salon gatherings, anniversary galas, and seasonal soirées in private residences or galleries.',
    full_description:
      'We transform private residences, rooftops, and cultural institutions into atmospheric worlds with custom bars, sculptural lighting, and unobtrusive white-glove service.',
    highlights: [
      'Residence & non-traditional space transformation',
      'Custom lounge & bar architecture',
      'Signature scent, sound & lighting choreography',
      'Confidentiality-first production team',
    ],
    cover_image_url:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    cover_image_path: null,
    display_order: 5,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'default-product-launches',
    title: 'Product Reveals & Experiential',
    slug: 'product-launches',
    short_description:
      'High-impact experiential reveals designed for press, tastemakers, and global luxury houses.',
    full_description:
      'From dramatic kinetic reveals to interactive brand pavilions, we choreograph product unveilings that generate editorial headlines and authentic emotional resonance.',
    highlights: [
      'Kinetic reveal engineering & projection mapping',
      'Press, influencer & VIP preview flow',
      'Custom display plinths & tactile zones',
      'Live stream & media capture readiness',
    ],
    cover_image_url:
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    cover_image_path: null,
    display_order: 6,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'default-concerts-live-shows',
    title: 'Concerts & Entertainment',
    slug: 'concerts-and-live-shows',
    short_description:
      'Large-scale live performances, acoustic direction, and arena-caliber stage & lighting production.',
    full_description:
      'Our technical directors manage touring riders, rigging, line-array acoustics, timecoded lighting, and crowd flow for private concerts and ticketed cultural showcases.',
    highlights: [
      'Artist liaison & technical rider fulfillment',
      'Timecoded lighting, LED & kinetic rigging',
      'Front-of-house acoustics & VIP hospitality decks',
      'Safety engineering & crowd management',
    ],
    cover_image_url:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    cover_image_path: null,
    display_order: 7,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'default-exhibitions-conferences',
    title: 'Exhibitions & Forums',
    slug: 'exhibitions-and-conferences',
    short_description:
      'Architectural pavilions, trade showcases, and international forums built with spatial clarity.',
    full_description:
      'We engineer multi-track conferences, curated art and design exhibitions, and bespoke brand pavilions with effortless registration, wayfinding, and delegate engagement.',
    highlights: [
      'Modular & bespoke pavilion architecture',
      'Multi-room AV & simultaneous interpretation',
      'Delegate flow, badging & sponsor suites',
      'Turnkey exhibitor & fabrication management',
    ],
    cover_image_url:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    cover_image_path: null,
    display_order: 8,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'default-social-cultural-events',
    title: 'Social & Cultural Galas',
    slug: 'social-and-cultural-events',
    short_description:
      'Philanthropic galas, heritage festivals, and museum evenings steeped in craft and community.',
    full_description:
      'We honour cultural heritage and civic institutions through thoughtful programming, auction choreography, traditional culinary artistry, and dignified spatial design.',
    highlights: [
      'Philanthropic gala & auction production',
      'Heritage & cultural ritual sensitivity',
      'Museum & landmark venue compliance',
      'Patron recognition & VIP protocol',
    ],
    cover_image_url:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    cover_image_path: null,
    display_order: 9,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'default-custom-events',
    title: 'Custom Commissions',
    slug: 'custom-events',
    short_description:
      'Uncharted concepts, pop-up dining architectures, and bespoke commissions built from a blank canvas.',
    full_description:
      'When your occasion defies standard categories—a desert architectural dining table, a floating stage, or a multi-city experiential tour—our studio prototypes and produces it from scratch.',
    highlights: [
      'Zero-template creative ideation',
      'Site feasibility & temporary architecture',
      'Bespoke fabrication & sensory engineering',
      'End-to-end turnkey accountability',
    ],
    cover_image_url:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    cover_image_path: null,
    display_order: 10,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
];
