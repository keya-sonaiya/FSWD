import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../lib/auth';
import type { Profile } from '../lib/supabase';

interface AuthContextType {
  user: any;
  profile: Profile | null;
  loading: boolean;
  signUp: (data: any) => Promise<void>;
  signIn: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<Profile>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthProvider() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (mounted) {
          setUser(currentUser);
          if (currentUser) {
            try {
              const userProfile = await authService.getCurrentProfile();
              setProfile(userProfile);
            } catch (error) {
              console.error('Error fetching profile:', error);
              setProfile(null);
            }
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = authService.onAuthStateChange(async (authUser) => {
      if (mounted) {
        setUser(authUser);
        if (authUser) {
          try {
            const userProfile = await authService.getCurrentProfile();
            setProfile(userProfile);
          } catch (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        if (loading) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [loading]);

  const signUp = async (data: any) => {
    try {
      await authService.signUp(data);
    } catch (error) {
      console.error('SignUp error:', error);
      throw error;
    }
  };

  const signIn = async (data: any) => {
    try {
      await authService.signIn(data);
    } catch (error) {
      console.error('SignIn error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('SignOut error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const updatedProfile = await authService.updateProfile(data);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('UpdateProfile error:', error);
      throw error;
    }
  };

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
}

export { AuthContext };