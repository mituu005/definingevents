import { Calendar, Mail, MapPin, Phone, Search, Trash2, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteEnquiryAdmin,
  fetchEnquiriesAdmin,
  updateEnquiryStatusAdmin,
} from '@/lib/api';
import type { EnquiryRecord, EnquiryStatus } from '@/types/database';

export function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EnquiryStatus>('all');
  const [selected, setSelected] = useState<EnquiryRecord | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEnquiriesAdmin();
      setEnquiries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load enquiries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enquiries.filter((e) => {
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchSearch =
        !q ||
        e.full_name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.event_type.toLowerCase().includes(q) ||
        (e.event_location || '').toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [enquiries, statusFilter, search]);

  const handleSelect = (item: EnquiryRecord) => {
    setSelected(item);
    setNotes(item.admin_notes || '');
  };

  const handleStatusChange = async (item: EnquiryRecord, nextStatus: EnquiryStatus) => {
    try {
      await updateEnquiryStatusAdmin(item.id, item.full_name, nextStatus);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === item.id ? { ...e, status: nextStatus } : e))
      );
      if (selected?.id === item.id) {
        setSelected({ ...item, status: nextStatus });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status.');
    }
  };

  const handleSaveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    try {
      await updateEnquiryStatusAdmin(selected.id, selected.full_name, selected.status, notes);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === selected.id ? { ...e, admin_notes: notes } : e))
      );
      setSelected({ ...selected, admin_notes: notes });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save notes.');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (item: EnquiryRecord) => {
    if (!window.confirm(`Delete enquiry from ${item.full_name}?`)) return;
    try {
      await deleteEnquiryAdmin(item.id, item.full_name);
      setEnquiries((prev) => prev.filter((e) => e.id !== item.id));
      if (selected?.id === item.id) setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete enquiry.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.26em] text-[#B18A55]">Client Pipeline</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#14251F] mt-1">
          Enquiry Management
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#EAE4D8]/60 p-4 border border-[#14251F]/12">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 text-[#263C32]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client name, email, event type, or city..."
            className="w-full border border-[#14251F]/20 bg-[#F8F6F0] pl-10 pr-4 py-2.5 text-sm focus:border-[#B18A55] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'new', 'contacted', 'completed'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.18em] border ${
                statusFilter === s
                  ? 'border-[#14251F] bg-[#14251F] text-[#F8F6F0]'
                  : 'border-[#14251F]/20 bg-[#F8F6F0] text-[#263C32]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="border border-red-700/30 bg-red-50 p-4 text-sm text-red-900">{error}</div>
      )}

      {loading ? (
        <div className="h-64 bg-[#EAE4D8] animate-pulse" />
      ) : filtered.length === 0 ? (
        <div className="border border-[#14251F]/15 bg-[#EAE4D8]/40 p-12 text-center">
          <p className="font-serif text-2xl text-[#14251F]">No enquiries match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List */}
          <div className="lg:col-span-7 space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`cursor-pointer border p-5 transition-colors ${
                  selected?.id === item.id
                    ? 'border-[#B18A55] bg-[#EAE4D8]'
                    : 'border-[#14251F]/12 bg-[#EAE4D8]/40 hover:border-[#B18A55]/60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-xl text-[#14251F]">{item.full_name}</h2>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#B18A55] mt-0.5">
                      {item.event_type}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] border ${
                      item.status === 'new'
                        ? 'border-[#B18A55] bg-[#B18A55]/20 text-[#14251F]'
                        : item.status === 'contacted'
                        ? 'border-[#263C32]/40 text-[#263C32]'
                        : 'border-emerald-700/40 bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#263C32]/80">
                  {item.event_date && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#B18A55]" />
                      {item.event_date}
                    </span>
                  )}
                  {item.event_location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#B18A55]" />
                      {item.event_location}
                    </span>
                  )}
                  {item.guest_count && (
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-[#B18A55]" />
                      {item.guest_count}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-[11px] text-[#263C32]/65">
                  Submitted {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Inspector Pane */}
          <div className="lg:col-span-5">
            {selected ? (
              <div className="sticky top-24 border border-[#14251F]/15 bg-[#EAE4D8]/60 p-6 space-y-5">
                <div className="flex items-start justify-between gap-4 border-b border-[#14251F]/12 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl text-[#14251F]">{selected.full_name}</h3>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#B18A55]">
                      {selected.event_type}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(selected)}
                    aria-label="Delete enquiry"
                    className="text-red-800 hover:text-red-950 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2.5 text-sm text-[#263C32]">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#B18A55]" />
                    <a href={`tel:${selected.phone}`} className="hover:underline">
                      {selected.phone}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#B18A55]" />
                    <a href={`mailto:${selected.email}`} className="hover:underline">
                      {selected.email}
                    </a>
                  </p>
                  {selected.event_date && (
                    <p>
                      <strong>Date:</strong> {selected.event_date}
                    </p>
                  )}
                  {selected.event_location && (
                    <p>
                      <strong>Location:</strong> {selected.event_location}
                    </p>
                  )}
                  {selected.guest_count && (
                    <p>
                      <strong>Guests:</strong> {selected.guest_count}
                    </p>
                  )}
                  {selected.budget && (
                    <p>
                      <strong>Estimated Budget:</strong> {selected.budget}
                    </p>
                  )}
                </div>

                {selected.requirements && (
                  <div className="border-t border-[#14251F]/12 pt-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#263C32]/70 mb-1.5">
                      Client Brief
                    </p>
                    <p className="text-sm text-[#14251F] whitespace-pre-line">
                      {selected.requirements}
                    </p>
                  </div>
                )}

                <div className="border-t border-[#14251F]/12 pt-4 space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#263C32]/70">
                    Workflow Status
                  </p>
                  <div className="flex gap-2">
                    {(['new', 'contacted', 'completed'] as EnquiryStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(selected, st)}
                        className={`flex-1 py-2 text-[11px] uppercase tracking-[0.16em] border ${
                          selected.status === st
                            ? 'border-[#14251F] bg-[#14251F] text-[#F8F6F0]'
                            : 'border-[#14251F]/25 bg-[#F8F6F0] text-[#263C32]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-[#263C32]/70">
                    Internal Studio Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Record call outcomes, venue proposals, or follow-up dates..."
                    className="w-full border border-[#14251F]/20 bg-[#F8F6F0] p-3 text-xs focus:border-[#B18A55] focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={savingNotes}
                    onClick={handleSaveNotes}
                    className="w-full border border-[#14251F] bg-[#14251F] py-2.5 text-xs uppercase tracking-[0.2em] text-[#F8F6F0] hover:bg-[#B18A55] hover:border-[#B18A55] hover:text-[#14251F] transition-colors disabled:opacity-50"
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-[#14251F]/12 bg-[#EAE4D8]/30 p-8 text-center text-sm text-[#263C32]/75">
                Select an enquiry on the left to view full details, update its status, or add
                studio notes.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
