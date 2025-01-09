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

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out process...');
      setLoading(true);
      
      // Clear all queries first
      await queryClient.resetQueries();
      await queryClient.clear();
      
      // Clear local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Sign out successful');
      setSession(null);
      
      // Force a clean page reload to clear any remaining state
      window.location.replace('/login');
    } catch (error: any) {
      console.error('Error during sign out:', error);
      toast({
        title: "Error signing out",
        description: error.message,
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
      toast({
        title: "Session Expired",
        description: "Please sign in again",
        variant: "destructive",
      });
      await handleSignOut();
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

    const initializeSession = async () => {
      try {
        setLoading(true);
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          await handleAuthError(error);
          return;
        }
        
        if (mounted) {
          setSession(currentSession);
          if (currentSession?.user) {
            console.log('Session initialized for user:', currentSession.user.id);
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

      console.log('Auth state changed:', event, currentSession?.user?.id);
      
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (!currentSession) {
          console.log('No session after token refresh, signing out');
          await handleSignOut();
          return;
        }
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