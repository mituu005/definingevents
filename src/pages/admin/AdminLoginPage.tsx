import { AlertTriangle, ArrowLeft, Eye, EyeOff, Lock, UserPlus, LogIn, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { BrandMark } from '@/components/common/BrandMark';
import { useAuth } from '@/contexts/AuthContext';

export function AdminLoginPage() {
  const { isAdmin, loading, isConfigured, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!loading && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('Please provide both your administrator email (Gmail) and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        const res = await signUp(cleanEmail, password, fullName.trim());
        if (res.needsEmailConfirmation) {
          setSuccessNotice(
            `Admin account registered for ${cleanEmail}! Please check your Gmail to confirm your email, or sign in if already confirmed.`
          );
          setMode('signin');
        } else {
          navigate('/admin/dashboard', { replace: true });
        }
      } else {
        await signIn(cleanEmail, password);
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to authenticate. Please verify your credentials and try again.'
      );
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

      <div className="relative z-10 mx-auto w-full max-w-md my-8 border border-white/10 bg-[#121217]/90 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-2.5 text-[#FFA01C] mb-2">
          <Lock className="h-4 w-4" />
          <span className="text-[11px] uppercase tracking-[0.28em] font-medium">Private Studio Access</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#FAF8F5]">
          {mode === 'signin' ? 'Administrator Sign In' : 'Create Admin Account'}
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-[#FAF8F5]/70">
          {mode === 'signin'
            ? 'Sign in with your verified Gmail and password to access the studio admin panel and manage events.'
            : 'Register your administrator credentials with Gmail to access the event management console.'}
        </p>

        {/* Mode Selector Tabs */}
        <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-black/40 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-md py-2 text-xs uppercase tracking-[0.18em] font-medium transition-all ${
              mode === 'signin'
                ? 'bg-[#FFA01C] text-[#08080A] shadow-sm font-semibold'
                : 'text-[#FAF8F5]/70 hover:text-[#FAF8F5]'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-md py-2 text-xs uppercase tracking-[0.18em] font-medium transition-all ${
              mode === 'signup'
                ? 'bg-[#FFA01C] text-[#08080A] shadow-sm font-semibold'
                : 'text-[#FAF8F5]/70 hover:text-[#FAF8F5]'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Register Admin</span>
          </button>
        </div>

        {!isConfigured && (
          <div className="mt-6 flex items-start gap-3 border border-amber-500/40 bg-amber-950/40 rounded-lg p-4 text-xs text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium">Supabase Not Configured</p>
              <p className="mt-1 text-amber-200/80">
                Add <code className="text-[#FFA01C]">VITE_SUPABASE_URL</code> and{' '}
                <code className="text-[#FFA01C]">VITE_SUPABASE_ANON_KEY</code> to your{' '}
                <code>.env</code> file.
              </p>
            </div>
          </div>
        )}

        {successNotice && (
          <div className="mt-6 flex items-start gap-3 border border-emerald-500/40 bg-emerald-950/40 rounded-lg p-4 text-xs text-emerald-200">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <p className="font-medium">Registration Update</p>
              <p className="mt-1 text-emerald-200/80">{successNotice}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="admin-name"
                className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/75 mb-2 font-medium"
              >
                Administrator Name
              </label>
              <input
                id="admin-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Studio Director"
                className="w-full border border-white/10 bg-[#08080A] rounded-lg px-4 py-3 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/30 focus:border-[#FFA01C] focus:ring-1 focus:ring-[#FFA01C] focus:outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="admin-email"
              className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF8F5]/75 mb-2 font-medium"
            >
              Administrator Gmail / Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@gmail.com"
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
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 6 characters)"
                className="w-full border border-white/10 bg-[#08080A] rounded-lg px-4 py-3 pr-11 text-sm text-[#FAF8F5] placeholder:text-[#FAF8F5]/30 focus:border-[#FFA01C] focus:ring-1 focus:ring-[#FFA01C] focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FAF8F5]/50 hover:text-[#FFA01C] transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="border border-red-500/40 bg-red-950/60 rounded-lg px-4 py-3 text-xs text-red-200"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !isConfigured}
            className="w-full bg-[#FFA01C] text-[#08080A] font-medium py-3.5 text-xs uppercase tracking-[0.24em] rounded-lg hover:bg-[#FFB247] shadow-[0_0_20px_rgba(255,160,28,0.35)] transition-all disabled:opacity-50 cursor-pointer mt-2"
          >
            {submitting
              ? mode === 'signin'
                ? 'Verifying Credentials...'
                : 'Creating Account...'
              : mode === 'signin'
              ? 'Sign In & Access Studio'
              : 'Create Account & Access Studio'}
          </button>
        </form>
      </div>

      <p className="relative z-10 text-center text-[11px] text-[#FAF8F5]/40">
        Protected by Supabase Authentication &amp; PostgreSQL Row Level Security.
      </p>
    </div>
  );
}
