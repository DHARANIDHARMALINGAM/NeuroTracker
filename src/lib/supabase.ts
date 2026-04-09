import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- AUTH BYPASS (Temporary) ---
const MOCK_USER = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'guest@example.com',
  user_metadata: { 
    full_name: 'Guest User',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

const MOCK_SESSION = {
  access_token: 'mock-token',
  refresh_token: 'mock-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: MOCK_USER,
};

// Intercept getSession, getUser, and onAuthStateChange
const originalAuth = (supabase as any).auth;

(supabase as any).auth = {
  ...originalAuth,
  getSession: async () => {
    const original = await originalAuth.getSession();
    if (original.data.session) return original;
    return { data: { session: MOCK_SESSION }, error: null };
  },
  getUser: async () => {
    const original = await originalAuth.getUser();
    if (original.data.user) return original;
    return { data: { user: MOCK_USER }, error: null };
  },
  onAuthStateChange: (callback: any) => {
    originalAuth.getSession().then(({ data: { session } }: any) => {
      if (session) {
        callback('SIGNED_IN', session);
      } else {
        callback('SIGNED_IN', MOCK_SESSION);
      }
    });
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
  signOut: async () => {
    // Just a mock sign out that does nothing or wipes local state if needed
    return { error: null };
  }
};
// -----------------------------
