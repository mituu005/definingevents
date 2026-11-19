import {
  CalendarHeart,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BrandMark } from '@/components/common/BrandMark';
import { useAuth } from '@/contexts/AuthContext';

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/events', label: 'Events Portfolio', icon: CalendarHeart },
  { to: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Mail },
  { to: '/admin/content', label: 'Website Content', icon: FileText },
];

export function AdminLayout() {
  const { isAdmin, loading, adminProfile, user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08080A] text-[#FAF8F5]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#FFA01C] border-t-transparent" />
          <p className="mt-4 text-xs uppercase tracking-[0.26em] text-[#FFA01C]">
            Verifying Studio Access
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const SidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#08080A] text-[#FAF8F5] border-r border-white/10">
      <div>
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <BrandMark tone="light" compact />
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#FAF8F5]/70 hover:text-[#FFA01C]"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <p className="text-[10px] uppercase tracking-[0.26em] text-[#FFA01C] font-medium">Admin Studio</p>
          <p className="mt-1 truncate text-xs text-[#FAF8F5]/80">
            {adminProfile?.full_name || user?.email}
          </p>
        </div>

        <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
          {ADMIN_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.18em] rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#FFA01C] text-[#08080A] font-semibold shadow-[0_0_15px_rgba(255,160,28,0.3)]'
                      : 'text-[#FAF8F5]/70 hover:bg-white/5 hover:text-[#FAF8F5]'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-[#FAF8F5]/70 border border-white/10 rounded-lg hover:border-[#FFA01C] hover:text-[#FFA01C] transition-colors"
        >
          <span>View Live Site</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            navigate('/', { replace: true });
          }}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-[#FAF8F5]/60 hover:bg-red-950/40 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Exit Studio</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0D12] text-[#FAF8F5] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-68 shrink-0 sticky top-0 h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {SidebarContent}
          </div>
          <div className="flex-1 bg-black/70 backdrop-blur-sm" />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between bg-[#121217]/90 backdrop-blur-md border-b border-white/10 px-5 sm:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
              className="lg:hidden flex h-9 w-9 items-center justify-center border border-white/10 rounded text-[#FAF8F5]"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="text-xs uppercase tracking-[0.22em] text-[#FFA01C] font-medium">
              Studio Management Console
            </span>
          </div>

          <Link
            to="/admin/events/new"
            className="bg-[#FFA01C] text-[#08080A] font-semibold px-4 py-2 text-[11px] uppercase tracking-[0.2em] rounded hover:bg-[#FFB247] shadow-[0_0_15px_rgba(255,160,28,0.3)] transition-all"
          >
            + Add New Event
          </Link>
        </header>

        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
