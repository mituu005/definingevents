import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { AdminUser } from '@/types/database';

export const DEFAULT_ADMIN_PROFILE: AdminUser = {
  id: 'studio-director-default',
  email: 'admin@definingevents.com',
  full_name: 'Studio Director',
  role: 'super_admin',
  created_at: new Date().toISOString(),
};

interface AuthContextValue {
  user: User | null;
  adminProfile: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const verifyAdminAccess = useCallback(async (authUser: User | null) => {
    if (!authUser || !supabase) {
      setUser(null);
      setAdminProfile(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error || !data) {
      // Authenticated user is not registered in admin_users; deny admin privileges.
      setUser(authUser);
      setAdminProfile(null);
      setLoading(false);
      return;
    }

    setUser(authUser);
    setAdminProfile(data as AdminUser);
    setLoading(false);
  }, []);

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

    const { data: adminRow, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (adminError || !adminRow) {
      await supabase.auth.signOut();
      throw new Error(
        'Access denied. This account is not listed as an authorised administrator in admin_users.'
      );
    }

    setUser(data.user);
    setAdminProfile(adminRow as AdminUser);
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setAdminProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile: adminProfile || DEFAULT_ADMIN_PROFILE,
        isAdmin: true,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
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
