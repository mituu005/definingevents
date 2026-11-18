import { getSupabaseConfig, supabase } from '@/lib/supabase';

export const IMAGE_BUCKETS = ['event-images', 'site-assets'] as const;
export const PRIVATE_BUCKETS = new Set(['event-images', 'event-videos']);

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4'];

export const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
export const MAX_VIDEO_SIZE_BYTES = 150 * 1024 * 1024; // 150 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  mediaType?: 'image' | 'video';
}

export function validateMediaFile(
  file: File,
  expectedType?: 'image' | 'video' | 'any'
): FileValidationResult {
  const mime = file.type.toLowerCase();
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  const isImage =
    ALLOWED_IMAGE_TYPES.includes(mime) || ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(mime) || ext === 'mp4';

  if (expectedType === 'image' && !isImage) {
    return {
      valid: false,
      error: `"${file.name}" is not a supported image. Please upload JPG, JPEG, PNG, or WEBP.`,
    };
  }

  if (expectedType === 'video' && !isVideo) {
    return {
      valid: false,
      error: `"${file.name}" is not a supported video. Please upload MP4 format.`,
    };
  }

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: `"${file.name}" has an unsupported format. Allowed: JPG, JPEG, PNG, WEBP, MP4.`,
    };
  }

  if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `"${file.name}" exceeds the 15 MB image limit (${formatBytes(file.size)}).`,
    };
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      error: `"${file.name}" exceeds the 150 MB video limit (${formatBytes(file.size)}). Please compress the MP4 before uploading.`,
    };
  }

  return {
    valid: true,
    mediaType: isImage ? 'image' : 'video',
  };
}

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** idx).toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
}

export function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export interface UploadedStorageResult {
  bucket: string;
  path: string;
  publicUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

/**
 * Uploads a validated media file directly to Supabase Storage using XHR so callers
 * receive real byte-level upload progress (0-100) on desktop and mobile browsers.
 */
export async function uploadMediaWithProgress(
  file: File,
  bucket: 'event-images' | 'event-videos' | 'site-assets',
  folder: string,
  onProgress?: (percent: number) => void
): Promise<UploadedStorageResult> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) {
    throw new Error('You must be signed in as an administrator to upload files.');
  }

  const { url: supabaseUrl, anonKey } = getSupabaseConfig();
  const safeName = sanitizeFileName(file.name);
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const storagePath = `${folder.replace(/^\/|\/$/g, '')}/${uniquePrefix}-${safeName}`;

  const uploadEndpoint = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/${bucket}/${storagePath}`;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadEndpoint, true);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    xhr.setRequestHeader('apikey', anonKey);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.setRequestHeader('x-upsert', 'false');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const pct = Math.round((event.loaded / event.total) * 100);
        onProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve();
      } else {
        let message = `Upload failed (${xhr.status})`;
        try {
          const parsed = JSON.parse(xhr.responseText);
          if (parsed?.message) message = parsed.message;
          else if (parsed?.error) message = parsed.error;
        } catch {
          // ignore JSON parse errors
        }
        reject(new Error(message));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during file upload. Please check your connection.'));
    };

    xhr.send(file);
  });

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);

  return {
    bucket,
    path: storagePath,
    publicUrl: urlData.publicUrl,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  };
}

/**
 * Generates signed URLs for private buckets (`event-images`, `event-videos`), falling back
 * gracefully to `fallbackUrl` for public buckets (`site-assets`) or external URLs.
 */
export async function resolveStorageUrl(
  bucket: string | null | undefined,
  path: string | null | undefined,
  fallbackUrl: string | null | undefined
): Promise<string | null> {
  if (!path || !bucket) return fallbackUrl ?? null;
  if (!supabase || !PRIVATE_BUCKETS.has(bucket)) {
    return fallbackUrl ?? null;
  }

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
  if (error || !data?.signedUrl) {
    return fallbackUrl ?? null;
  }
  return data.signedUrl;
}

/**
 * Batch-resolves signed URLs for multiple storage paths in a single request per bucket.
 */
export async function batchResolveStorageUrls(
  items: Array<{ bucket: string; path: string; fallbackUrl?: string | null }>
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (!supabase || items.length === 0) {
    for (const item of items) {
      if (item.fallbackUrl) result.set(`${item.bucket}:${item.path}`, item.fallbackUrl);
    }
    return result;
  }

  const byBucket = new Map<string, Array<{ path: string; fallbackUrl?: string | null }>>();
  for (const item of items) {
    if (!item.path) continue;
    if (!PRIVATE_BUCKETS.has(item.bucket)) {
      if (item.fallbackUrl) result.set(`${item.bucket}:${item.path}`, item.fallbackUrl);
      continue;
    }
    const list = byBucket.get(item.bucket) ?? [];
    list.push({ path: item.path, fallbackUrl: item.fallbackUrl });
    byBucket.set(item.bucket, list);
  }

  for (const [bucket, entries] of byBucket.entries()) {
    const uniquePaths = Array.from(new Set(entries.map((e) => e.path)));
    const { data, error } = await supabase.storage.from(bucket).createSignedUrls(uniquePaths, 3600);
    if (!error && data) {
      for (const row of data) {
        if (row.path && row.signedUrl) {
          result.set(`${bucket}:${row.path}`, row.signedUrl);
        }
      }
    }
    for (const e of entries) {
      const key = `${bucket}:${e.path}`;
      if (!result.has(key) && e.fallbackUrl) {
        result.set(key, e.fallbackUrl);
      }
    }
  }

  return result;
}
