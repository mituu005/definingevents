import {
  Calendar,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  Film,
  Images,
  MapPin,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '@/contexts/SiteDataContext';
import { deleteEventAdmin, fetchAllEventsAdmin, updateEventStatusAdmin } from '@/lib/api';
import { EVENT_CATEGORIES, type EventRecord, type EventStatus } from '@/types/database';

export function AdminEventsPage() {
  const { refreshSiteData } = useSiteData();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EventStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<EventRecord | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllEventsAdmin();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filtered = useMemo(() => {
    return events.filter((ev) => {
      const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
      const matchesCat = categoryFilter === 'all' || ev.category === categoryFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        ev.category.toLowerCase().includes(q);
      return matchesStatus && matchesCat && matchesSearch;
    });
  }, [events, statusFilter, categoryFilter, search]);

  const handleStatusChange = async (event: EventRecord, nextStatus: EventStatus) => {
    setBusyId(event.id);
    try {
      await updateEventStatusAdmin(event.id, event.title, nextStatus);
      await loadEvents();
      await refreshSiteData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event status.');
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      await deleteEventAdmin(deleteTarget);
      setDeleteTarget(null);
      await loadEvents();
      await refreshSiteData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-[#B18A55]">Portfolio CMS</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#14251F] mt-1">Events Portfolio</h1>
        </div>
        <Link
          to="/admin/events/new"
          className="inline-flex items-center justify-center gap-2 border border-[#14251F] bg-[#14251F] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#F8F6F0] hover:bg-[#B18A55] hover:border-[#B18A55] hover:text-[#14251F] transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>+ ADD NEW EVENT</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#EAE4D8]/60 p-4 border border-[#14251F]/12">
        <div className="md:col-span-5 relative">
          <Search className="h-4 w-4 text-[#263C32]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, location, or category..."
            className="w-full border border-[#14251F]/20 bg-[#F8F6F0] pl-10 pr-4 py-2.5 text-sm text-[#14251F] focus:border-[#B18A55] focus:outline-none"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | EventStatus)}
            className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-3 py-2.5 text-sm text-[#14251F] focus:border-[#B18A55] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>

        <div className="md:col-span-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full border border-[#14251F]/20 bg-[#F8F6F0] px-3 py-2.5 text-sm text-[#14251F] focus:border-[#B18A55] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="border border-red-700/30 bg-red-50 p-4 text-sm text-red-900">{error}</div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-[#EAE4D8] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[#14251F]/15 bg-[#EAE4D8]/40 p-12 text-center">
          <p className="font-serif text-2xl text-[#14251F]">No matching events found.</p>
          <p className="mt-2 text-sm text-[#263C32]/75">
            Create your first portfolio event to publish photographs and videos to the live website.
          </p>
          <Link
            to="/admin/events/new"
            className="mt-6 inline-flex items-center gap-2 border border-[#14251F] bg-[#14251F] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#F8F6F0]"
          >
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ev) => {
            const photoCount = (ev.media || []).filter((m) => m.media_type === 'image').length;
            const videoCount = (ev.media || []).filter((m) => m.media_type === 'video').length;
            const isBusy = busyId === ev.id;

            return (
              <div
                key={ev.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-5 border border-[#14251F]/15 bg-[#EAE4D8]/45 p-4 sm:p-5"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="h-20 w-28 shrink-0 overflow-hidden bg-[#14251F] border border-[#14251F]/15">
                    {ev.resolved_cover_url ? (
                      <img
                        src={ev.resolved_cover_url}
                        alt={ev.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-widest text-[#B18A55]">
                        No Cover
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] border ${
                          ev.status === 'published'
                            ? 'border-emerald-700/40 bg-emerald-100 text-emerald-900'
                            : ev.status === 'draft'
                            ? 'border-[#B18A55] bg-[#B18A55]/20 text-[#14251F]'
                            : 'border-stone-400 bg-stone-200 text-stone-800'
                        }`}
                      >
                        {ev.status}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.16em] text-[#B18A55]">
                        {ev.category}
                      </span>
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl text-[#14251F] mt-1">
                      {ev.title}
                    </h2>

                    <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-[#263C32]/80">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#B18A55]" />
                        {ev.location}
                      </span>
                      {ev.event_date && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#B18A55]" />
                          {ev.event_date}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Images className="h-3.5 w-3.5 text-[#B18A55]" />
                        {photoCount} photos
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Film className="h-3.5 w-3.5 text-[#B18A55]" />
                        {videoCount} videos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {ev.status === 'published' ? (
                    <>
                      <Link
                        to={`/events/${ev.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border border-[#14251F]/25 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-[#14251F] hover:border-[#B18A55]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Live</span>
                      </Link>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleStatusChange(ev, 'unpublished')}
                        className="inline-flex items-center gap-1.5 border border-[#14251F]/25 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-[#263C32] hover:bg-[#14251F] hover:text-[#F8F6F0] transition-colors disabled:opacity-50"
                      >
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Unpublish</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleStatusChange(ev, 'published')}
                      className="inline-flex items-center gap-1.5 border border-emerald-800 bg-emerald-800 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-white hover:bg-emerald-900 transition-colors disabled:opacity-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Publish</span>
                    </button>
                  )}

                  <Link
                    to={`/admin/events/${ev.id}/edit`}
                    className="inline-flex items-center gap-1.5 border border-[#14251F] bg-[#14251F] px-3.5 py-2 text-[11px] uppercase tracking-[0.16em] text-[#F8F6F0] hover:bg-[#B18A55] hover:border-[#B18A55] hover:text-[#14251F] transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => setDeleteTarget(ev)}
                    aria-label={`Delete ${ev.title}`}
                    className="inline-flex items-center justify-center border border-red-800/35 px-3 py-2 text-red-800 hover:bg-red-800 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md border border-[#B18A55] bg-[#F8F6F0] p-7">
            <h3 className="font-serif text-2xl text-[#14251F]">Delete Event &amp; Media?</h3>
            <p className="mt-3 text-sm text-[#263C32]">
              Are you sure you want to permanently delete{' '}
              <strong className="text-[#14251F]">{deleteTarget.title}</strong>? All uploaded
              photographs and videos associated with this event will also be deleted from storage.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="border border-[#14251F]/25 px-5 py-2.5 text-xs uppercase tracking-[0.18em]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === deleteTarget.id}
                onClick={handleConfirmDelete}
                className="bg-red-800 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-white hover:bg-red-900 disabled:opacity-50"
              >
                {busyId === deleteTarget.id ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
