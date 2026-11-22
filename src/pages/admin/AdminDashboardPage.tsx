import {
  Activity,
  CalendarCheck,
  FileEdit,
  Film,
  Image as ImageIcon,
  Mail,
  Plus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminOverview, type AdminOverviewStats } from '@/lib/api';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminOverview()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: 'Published Events',
      value: stats?.publishedEvents ?? 0,
      icon: CalendarCheck,
      to: '/admin/events',
    },
    {
      label: 'Draft Events',
      value: stats?.draftEvents ?? 0,
      icon: FileEdit,
      to: '/admin/events',
    },
    {
      label: 'Uploaded Photographs',
      value: stats?.totalPhotos ?? 0,
      icon: ImageIcon,
      to: '/admin/media',
    },
    {
      label: 'Uploaded Videos',
      value: stats?.totalVideos ?? 0,
      icon: Film,
      to: '/admin/media',
    },
    {
      label: 'New Enquiries',
      value: stats?.newEnquiries ?? 0,
      icon: Mail,
      to: '/admin/enquiries',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-[#FFA01C] font-medium">Studio Overview</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] mt-1">
            Dashboard &amp; Operations
          </h1>
        </div>
        <Link
          to="/admin/events/new"
          className="inline-flex items-center justify-center gap-2 border border-[#FFA01C] bg-gradient-to-r from-[#FFA01C] to-[#E68A00] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#08080A] font-semibold rounded shadow-[0_0_20px_rgba(255,160,28,0.35)] hover:shadow-[0_0_30px_rgba(255,160,28,0.6)] hover:scale-[1.02] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>+ ADD NEW EVENT</span>
        </Link>
      </div>

      {error && (
        <div className="border border-red-500/40 bg-red-950/60 p-4 text-sm text-red-200 rounded-lg">{error}</div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.to}
              className="rounded-xl border border-white/10 bg-[#121217] p-6 hover:border-[#FFA01C] hover:shadow-[0_0_25px_rgba(255,160,28,0.15)] transition-all group"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-[#FFA01C] group-hover:scale-110 transition-transform" />
              </div>
              <p className="mt-4 font-serif text-4xl text-[#FAF8F5]">
                {loading ? '—' : card.value}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#FAF8F5]/65">
                {card.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Recent Enquiries & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries */}
        <div className="lg:col-span-7 rounded-xl border border-white/10 bg-[#121217] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
            <h2 className="font-serif text-2xl text-[#FAF8F5]">Recent Enquiries</h2>
            <Link
              to="/admin/enquiries"
              className="text-xs uppercase tracking-[0.2em] text-[#FFA01C] hover:text-[#FFB84D] transition-colors"
            >
              View All
            </Link>
          </div>

          {!loading && (!stats || stats.recentEnquiries.length === 0) ? (
            <p className="text-sm text-[#FAF8F5]/60 py-6">
              No client enquiries received yet. Enquiries submitted from the public contact form
              will appear here.
            </p>
          ) : (
            <div className="divide-y divide-white/10">
              {(stats?.recentEnquiries || []).map((enq) => (
                <div key={enq.id} className="py-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm text-[#FAF8F5]">{enq.full_name}</p>
                    <p className="text-xs text-[#FAF8F5]/70 mt-0.5">
                      {enq.event_type}
                      {enq.event_location ? ` · ${enq.event_location}` : ''}
                    </p>
                    <p className="text-[11px] text-[#FFA01C]/80 mt-1">
                      {enq.email} · {enq.phone}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] rounded border ${
                      enq.status === 'new'
                        ? 'border-[#FFA01C] bg-[#FFA01C]/15 text-[#FFA01C]'
                        : enq.status === 'contacted'
                        ? 'border-white/20 text-[#FAF8F5]/80 bg-white/5'
                        : 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-5 rounded-xl border border-white/10 bg-[#121217] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
            <h2 className="font-serif text-2xl text-[#FAF8F5]">Recent Activity</h2>
            <Activity className="h-4 w-4 text-[#FFA01C]" />
          </div>

          {!loading && (!stats || stats.recentActivities.length === 0) ? (
            <p className="text-sm text-[#FAF8F5]/60 py-6">
              Activity logs will appear as events, media, and settings are managed.
            </p>
          ) : (
            <ul className="space-y-4">
              {(stats?.recentActivities || []).map((act) => (
                <li key={act.id} className="border-l-2 border-[#FFA01C] pl-4 py-0.5">
                  <p className="text-xs font-medium text-[#FAF8F5]">{act.action}</p>
                  {act.entity_title && (
                    <p className="text-xs text-[#FAF8F5]/70 mt-0.5">{act.entity_title}</p>
                  )}
                  <p className="text-[10px] text-[#FAF8F5]/50 mt-1">
                    {new Date(act.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
