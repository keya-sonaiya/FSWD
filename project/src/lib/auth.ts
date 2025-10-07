import { supabase } from './supabase';
import type { UserRole } from './supabase';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  async signUp({ name, email, password, role }: SignUpData) {
    // First, sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          name,
          role,
        }
      }
    });

    if (authError) throw authError;

    if (authData.user && authData.session) {
      // Set the session to ensure proper authentication context
      await supabase.auth.setSession(authData.session);
      
      // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          name,
          role,
        })
        .select()
        .single();

      if (profileError) throw profileError;
    }

    return authData;
  }

  async signIn({ email, password }: SignInData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async getCurrentProfile() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(updates: Partial<{ name: string; bio: string; avatar_url: string }>) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null);
    });
  }
}

export const authService = new AuthService();