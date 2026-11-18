import { Eye, Film, Image as ImageIcon, Search, Trash2, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createMediaRecordAdmin,
  deleteMediaRecordAdmin,
  fetchAllMediaAdmin,
  type MediaWithEvent,
} from '@/lib/api';
import { formatBytes, uploadMediaWithProgress, validateMediaFile } from '@/lib/media';

export function AdminMediaPage() {
  const [items, setItems] = useState<MediaWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [search, setSearch] = useState('');
  const [previewItem, setPreviewItem] = useState<MediaWithEvent | null>(null);
  const [uploadingPct, setUploadingPct] = useState<number | null>(null);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllMediaAdmin();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media library.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchType = typeFilter === 'all' || item.media_type === typeFilter;
      const matchSearch =
        !q ||
        item.file_name.toLowerCase().includes(q) ||
        (item.event?.title || '').toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [items, typeFilter, search]);

  const handleLibraryUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setSuccessMsg(null);

    const files = Array.from(fileList);
    for (const file of files) {
      const validation = validateMediaFile(file, 'any');
      if (!validation.valid || !validation.mediaType) {
        setError(validation.error || 'Invalid file.');
        return;
      }
    }

    let uploadedCount = 0;
    for (const file of files) {
      const check = validateMediaFile(file, 'any');
      const mediaType = check.mediaType!;
      setUploadingPct(0);
      try {
        const uploaded = await uploadMediaWithProgress(file, 'site-assets', 'library', (pct) => {
          setUploadingPct(pct);
        });
        await createMediaRecordAdmin({
          event_id: null,
          media_type: mediaType,
          file_name: uploaded.fileName,
          file_url: uploaded.publicUrl,
          storage_path: uploaded.path,
          storage_bucket: uploaded.bucket,
          file_size: uploaded.fileSize,
          mime_type: uploaded.mimeType,
          usage_scope: 'website',
        });
        uploadedCount++;
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed uploading ${file.name}`);
      }
    }

    setUploadingPct(null);
    if (uploadedCount > 0) {
      setSuccessMsg(`Uploaded ${uploadedCount} media file(s) to the library.`);
      await loadMedia();
    }
  };

  const handleDelete = async (item: MediaWithEvent) => {
    if (!window.confirm(`Permanently delete "${item.file_name}"?`)) return;
    try {
      await deleteMediaRecordAdmin(item);
      setItems((prev) => prev.filter((m) => m.id !== item.id));
      setSuccessMsg(`Deleted "${item.file_name}".`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete media.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-[#B18A55]">Asset Vault</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#14251F] mt-1">Media Library</h1>
        </div>

        <label className="inline-flex items-center justify-center gap-2 border border-[#14251F] bg-[#14251F] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#F8F6F0] cursor-pointer hover:bg-[#B18A55] hover:border-[#B18A55] hover:text-[#14251F] transition-colors">
          <Upload className="h-4 w-4" />
          <span>Upload Media</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4"
            onChange={(e) => {
              handleLibraryUpload(e.target.files);
              e.target.value = '';
            }}
            className="hidden"
          />
        </label>
      </div>

      {uploadingPct !== null && (
        <div className="border border-[#B18A55] bg-[#EAE4D8] p-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span>Uploading media...</span>
            <span>{uploadingPct}%</span>
          </div>
          <div className="h-1.5 bg-[#F8F6F0]">
            <div className="h-full bg-[#B18A55]" style={{ width: `${uploadingPct}%` }} />
          </div>
        </div>
      )}

      {error && (
        <div className="border border-red-700/30 bg-red-50 p-4 text-sm text-red-900">{error}</div>
      )}
      {successMsg && (
        <div className="border border-emerald-700/30 bg-emerald-50 p-4 text-sm text-emerald-900">
          {successMsg}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#EAE4D8]/60 p-4 border border-[#14251F]/12">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 text-[#263C32]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name or linked event..."
            className="w-full border border-[#14251F]/20 bg-[#F8F6F0] pl-10 pr-4 py-2.5 text-sm focus:border-[#B18A55] focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.18em] border ${
                typeFilter === t
                  ? 'border-[#14251F] bg-[#14251F] text-[#F8F6F0]'
                  : 'border-[#14251F]/20 bg-[#F8F6F0] text-[#263C32]'
              }`}
            >
              {t === 'all' ? 'All Media' : t === 'image' ? 'Images' : 'Videos'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-square bg-[#EAE4D8] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[#14251F]/15 bg-[#EAE4D8]/40 p-12 text-center">
          <p className="font-serif text-2xl text-[#14251F]">No media files found.</p>
          <p className="mt-2 text-sm text-[#263C32]/75">
            Upload images or MP4 videos here or directly inside any event editor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((item) => {
            const src = item.signed_url || item.file_url;
            return (
              <div
                key={item.id}
                className="border border-[#14251F]/15 bg-[#EAE4D8]/45 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-[#14251F] overflow-hidden">
                  {item.media_type === 'video' ? (
                    <video src={src} className="h-full w-full object-cover" muted />
                  ) : (
                    <img
                      src={src}
                      alt={item.file_name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-[#14251F]/85 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#F8F6F0]">
                    {item.media_type === 'video' ? (
                      <Film className="h-3 w-3 text-[#B18A55]" />
                    ) : (
                      <ImageIcon className="h-3 w-3 text-[#B18A55]" />
                    )}
                    {item.media_type}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <p className="truncate text-xs font-medium text-[#14251F]" title={item.file_name}>
                    {item.file_name}
                  </p>
                  <p className="text-[11px] text-[#263C32]/80 truncate">
                    Used by:{' '}
                    <span className="font-medium">
                      {item.event?.title || 'Website Library'}
                    </span>
                  </p>
                  <p className="text-[10px] text-[#263C32]/65">
                    {formatBytes(item.file_size)}
                  </p>

                  <div className="pt-2 border-t border-[#14251F]/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#14251F] hover:text-[#B18A55]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-red-800 hover:underline"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#14251F] border border-[#B18A55]/40 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-[#F8F6F0] mb-3">
              <span className="text-xs truncate">{previewItem.file_name}</span>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1 hover:text-[#B18A55]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {previewItem.media_type === 'video' ? (
              <video
                src={previewItem.signed_url || previewItem.file_url}
                controls
                autoPlay
                className="w-full max-h-[75vh] bg-black"
              />
            ) : (
              <img
                src={previewItem.signed_url || previewItem.file_url}
                alt={previewItem.file_name}
                className="w-full max-h-[75vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
