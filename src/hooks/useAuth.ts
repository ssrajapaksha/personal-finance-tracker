import { useState, useEffect } from "react";
import { User } from "@/types";
import { signIn, signUp, signOut } from "@/api/auth";
import { LoginRequest, RegisterRequest } from "@/schemas/user";
import { supabase } from "@/lib/supabaseClient";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkUser = async () => {
    try {
      console.log('🔍 checkUser called');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('🔍 Supabase user:', user ? 'exists' : 'null');
      
      if (user) {
        // Get user profile from API route with session token
        const { data: { session } } = await supabase.auth.getSession();
        const response = await fetch('/api/auth/current-user', {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
        });
        
        if (response.ok) {
          const profile = await response.json();
          console.log('🔍 Setting user profile:', profile.id);
          setUser(profile);
        } else if (response.status === 401) {
          // User is not authenticated - this is normal, not an error
          console.log('🔍 401 response, setting user to null');
          setUser(null);
        } else {
          // Only log actual errors (not 401s)
          console.error('Failed to get user profile:', response.status);
          setUser(null);
        }
      } else {
        console.log('🔍 No Supabase user, setting user to null');
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for existing session on mount
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔍 Auth state change:', event, session ? 'session exists' : 'no session');
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Get user profile from API route with session token
          try {
            const response = await fetch('/api/auth/current-user', {
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
              },
            });
            
            if (response.ok) {
              const profile = await response.json();
              console.log('🔍 Auth state change: Setting user profile:', profile.id);
              setUser(profile);
            } else if (response.status === 401) {
              // User is not authenticated - this is normal, not an error
              console.log('🔍 Auth state change: 401 response, setting user to null');
              setUser(null);
            } else {
              // Only log actual errors (not 401s)
              console.error('Failed to get user profile:', response.status);
            }
          } catch (error) {
            console.error('Failed to get user profile:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🔍 Auth state change: SIGNED_OUT, setting user to null');
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async (credentials: LoginRequest) => {
    try {
      setError(null);
      setLoading(true);
      await signIn(credentials);
      
      // Wait a moment for Supabase to fully establish the session
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get user profile from API route with session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No session token available');
      }
      
      console.log('🔍 Getting user profile after sign in...');
      const response = await fetch('/api/auth/current-user', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      
      if (response.ok) {
        const profile = await response.json();
        console.log('✅ Profile retrieved after sign in:', profile.id);
        
        // Update user state
        setUser(profile);
        
        console.log('✅ User state updated, isAuthenticated should now be true');
        return profile;
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to get user profile after sign in:', errorData);
        throw new Error(errorData.error || 'Failed to get profile');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (userData: RegisterRequest) => {
    try {
      setError(null);
      setLoading(true);
      await signUp(userData);
      
      // Wait a moment for Supabase to fully establish the session
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user profile via API route with session token
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          throw new Error('No session token available');
        }
        
        console.log('🔍 Creating user profile...');
        const response = await fetch('/api/auth/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ name: userData.name }),
        });

        if (response.ok) {
          const profile = await response.json();
          console.log('✅ Profile created successfully:', profile.id);
          setUser(profile);
          return profile;
        } else {
          const errorData = await response.json();
          console.error('❌ Failed to create user profile:', errorData);
          throw new Error(errorData.error || 'Failed to create profile');
        }
      } catch (profileError) {
        console.error('❌ Profile creation failed:', profileError);
        // Don't redirect if profile creation fails
        throw new Error('Account created but profile setup failed. Please try signing in again.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      setLoading(true);
      await signOut();
      setUser(null);
      
      // Redirect to auth page after successful logout
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: { name?: string; email?: string }) => {
    try {
      setError(null);
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setUser(updatedProfile);
      return updatedProfile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      setError(errorMessage);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile,
    isAuthenticated: !!user, // Add this missing property
  };
}
