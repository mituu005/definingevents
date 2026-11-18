import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CustomCursor } from '@/components/common/CustomCursor';
import { AuthProvider } from '@/contexts/AuthContext';
import { SiteDataProvider } from '@/contexts/SiteDataContext';
import { EventDetailPage } from '@/pages/public/EventDetailPage';
import { HomePage } from '@/pages/public/HomePage';
import { PrivacyPolicyPage, TermsPage } from '@/pages/public/LegalPages';

const AdminLayout = lazy(() =>
  import('@/components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminLoginPage = lazy(() =>
  import('@/pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminEventsPage = lazy(() =>
  import('@/pages/admin/AdminEventsPage').then((m) => ({ default: m.AdminEventsPage }))
);
const AdminEventEditorPage = lazy(() =>
  import('@/pages/admin/AdminEventEditorPage').then((m) => ({ default: m.AdminEventEditorPage }))
);
const AdminMediaPage = lazy(() =>
  import('@/pages/admin/AdminMediaPage').then((m) => ({ default: m.AdminMediaPage }))
);
const AdminEnquiriesPage = lazy(() =>
  import('@/pages/admin/AdminEnquiriesPage').then((m) => ({ default: m.AdminEnquiriesPage }))
);
const AdminContentPage = lazy(() =>
  import('@/pages/admin/AdminContentPage').then((m) => ({ default: m.AdminContentPage }))
);

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#14251F] text-[#B18A55]">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#B18A55] border-t-transparent" />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <SiteDataProvider>
        <BrowserRouter>
          <CustomCursor />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Public Website Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/events/:slug" element={<EventDetailPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Private Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="events" element={<AdminEventsPage />} />
                <Route path="events/new" element={<AdminEventEditorPage />} />
                <Route path="events/:id/edit" element={<AdminEventEditorPage />} />
                <Route path="media" element={<AdminMediaPage />} />
                <Route path="enquiries" element={<AdminEnquiriesPage />} />
                <Route path="content" element={<AdminContentPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SiteDataProvider>
    </AuthProvider>
  );
}

export default App;
