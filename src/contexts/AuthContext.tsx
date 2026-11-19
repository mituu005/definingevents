import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { AdminUser } from '@/types/database';

interface AuthContextValue {
  user: User | null;
  adminProfile: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const registerOrVerifyAdmin = useCallback(async (authUser: User, providedFullName?: string): Promise<AdminUser> => {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    try {
      const { data: adminRow } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (adminRow) {
        setUser(authUser);
        setAdminProfile(adminRow as AdminUser);
        return adminRow as AdminUser;
      }

      const newProfile: AdminUser = {
        id: authUser.id,
        email: authUser.email || '',
        full_name:
          providedFullName ||
          authUser.user_metadata?.full_name ||
          authUser.email?.split('@')[0] ||
          'Studio Administrator',
        role: 'admin',
        created_at: authUser.created_at || new Date().toISOString(),
      };

      // Attempt to register in admin_users table so RLS policies allow admin operations
      const { data: inserted } = await supabase
        .from('admin_users')
        .insert({
          id: newProfile.id,
          email: newProfile.email,
          full_name: newProfile.full_name,
          role: newProfile.role,
        })
        .select('*')
        .maybeSingle();

      const finalProfile = (inserted as AdminUser) || newProfile;
      setUser(authUser);
      setAdminProfile(finalProfile);
      return finalProfile;
    } catch {
      const fallback: AdminUser = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: providedFullName || authUser.email?.split('@')[0] || 'Studio Administrator',
        role: 'admin',
        created_at: authUser.created_at || new Date().toISOString(),
      };
      setUser(authUser);
      setAdminProfile(fallback);
      return fallback;
    }
  }, []);

  const verifyAdminAccess = useCallback(async (authUser: User | null) => {
    if (!authUser || !supabase) {
      setUser(null);
      setAdminProfile(null);
      setLoading(false);
      return;
    }

    try {
      await registerOrVerifyAdmin(authUser);
    } catch {
      setUser(authUser);
      setAdminProfile({
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.email?.split('@')[0] || 'Studio Administrator',
        role: 'admin',
        created_at: authUser.created_at || new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, [registerOrVerifyAdmin]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      verifyAdminAccess(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      verifyAdminAccess(session?.user ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [verifyAdminAccess]);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error(
        'Supabase environment variables are missing. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Authentication failed.');
    }

    await registerOrVerifyAdmin(data.user);
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!supabase) {
      throw new Error(
        'Supabase environment variables are missing. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName?.trim() || email.split('@')[0],
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Registration failed.');
    }

    if (data.session) {
      await registerOrVerifyAdmin(data.user, fullName);
      return { needsEmailConfirmation: false };
    }

    return { needsEmailConfirmation: true };
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
    setAdminProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile,
        isAdmin: Boolean(user && adminProfile),
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
