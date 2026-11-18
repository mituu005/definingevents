import { AlertTriangle, ArrowLeft, Lock } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { BrandMark } from '@/components/common/BrandMark';
import { useAuth } from '@/contexts/AuthContext';

export function AdminLoginPage() {
  const { isAdmin, loading, isConfigured, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both your administrator email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-[#FAF8F5] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(255,160,28,0.12),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <BrandMark tone="light" />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#FAF8F5]/70 hover:text-[#FFA01C] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Public Website</span>
        </Link>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md my-12 border border-white/10 bg-[#121217]/90 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-2.5 text-[#FFA01C] mb-3">
          <Lock className="h-4 w-4" />
          <span className="text-[11px] uppercase tracking-[0.28em] font-medium">Private Studio Access</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#FAF8F5]">Administrator Sign In</h1>
        <p className="mt-2 text-xs leading-relaxed text-[#FAF8F5]/70">
          Sign in with your authorised Supabase administrator account to manage events, media,
          website content, and enquiries.
        </p>

        {!isConfigured && (
          <div className="mt-6 flex items-start gap-3 border border-amber-500/40 bg-amber-950/40 rounded-lg p-4 text-xs text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium">Supabase Not Configured</p>
              <p className="mt-1 text-amber-200/80">
                Add <code className="text-[#FFA01C]">VITE_SUPABASE_URL</code> and{' '}
                <code className="text-[#FFA01C]">VITE_SUPABASE_ANON_KEY</code> to your{' '}
                <code>.env</code> file and complete the schema setup in{' '}
                <code>SUPABASE_SETUP.md</code>.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/75 mb-2 font-medium"
            >
              Administrator Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="director@definingevents.com"
              className="w-full border border-white/10 bg-[#08080A] rounded-lg px-4 py-3 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/30 focus:border-[#FFA01C] focus:ring-1 focus:ring-[#FFA01C] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/75 mb-2 font-medium"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-white/10 bg-[#08080A] rounded-lg px-4 py-3 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/30 focus:border-[#FFA01C] focus:ring-1 focus:ring-[#FFA01C] focus:outline-none transition-all"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="border border-red-500/30 bg-red-950/50 rounded-lg px-4 py-3 text-xs text-red-200"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !isConfigured}
            className="w-full bg-[#FFA01C] text-[#08080A] font-medium py-3.5 text-xs uppercase tracking-[0.24em] rounded-lg hover:bg-[#FFB247] shadow-[0_0_20px_rgba(255,160,28,0.35)] transition-all disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Enter Admin Dashboard'}
          </button>
        </form>
      </div>

      <p className="relative z-10 text-center text-[11px] text-[#FAF8F5]/40">
        Protected by Supabase Authentication &amp; PostgreSQL Row Level Security.
      </p>
    </div>
  );
}
