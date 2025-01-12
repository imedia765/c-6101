import { useState, useEffect } from "react";
import { Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSignOut = async (skipStorageClear = false) => {
    try {
      console.log('Starting sign out process...');
      setLoading(true);
      
      // Clear all queries first
      await queryClient.resetQueries();
      await queryClient.clear();
      
      // Only clear storage if not skipping (during login flow)
      if (!skipStorageClear) {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Sign out successful');
      setSession(null);
      
      // Add a small delay to ensure state is fully cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Force a clean page reload to clear any remaining state
      window.location.href = '/login';
      
    } catch (error: any) {
      console.error('Error during sign out:', error);
      let description = error.message;
      if (error.message.includes('502')) {
        description = "Failed to connect to the server. Please check your network connection and try again.";
      }
      toast({
        title: "Error signing out",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = async (error: AuthError) => {
    console.error('Auth error:', error);
    
    if (error.message.includes('refresh_token_not_found') || 
        error.message.includes('invalid refresh token')) {
      console.log('Token refresh failed, signing out...');
      await handleSignOut();
      
      toast({
        title: "Session Expired",
        description: "Please sign in again",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    console.log('Initializing auth session...');
    
    const initializeSession = async () => {
      try {
        setLoading(true);
        console.log('Fetching current session...');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session fetch error:', error);
          await handleAuthError(error);
          return;
        }
        
        if (mounted) {
          setSession(currentSession);
          if (currentSession?.user) {
            console.log('Session initialized for user:', currentSession.user.id);
          } else {
            console.log('No active session found');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
        }
      } catch (error: any) {
        console.error('Session initialization error:', error);
        if (mounted) {
          await handleSignOut();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      console.log('Auth state changed:', {
        event,
        hasSession: !!currentSession,
        userId: currentSession?.user?.id
      });
      
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !currentSession) {
        console.log('User signed out or token refresh failed');
        await handleSignOut();
        return;
      }

      if (event === 'SIGNED_IN') {
        setSession(currentSession);
        await queryClient.invalidateQueries();
      }
      
      setLoading(false);
    });

    initializeSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient, toast]);

  return { session, loading, handleSignOut };
}