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
      
      // Add a small delay to ensure state is fully cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Force a clean page reload to clear any remaining state
      try {
        // Check if login page exists before redirect
        const response = await fetch('/login');
        if (response.ok) {
          // Validate origin before redirect
          const currentOrigin = window.location.origin;
          if (currentOrigin && currentOrigin !== 'null') {
            window.location.replace('/login');
          } else {
            console.error('Invalid origin, forcing reload');
            window.location.reload();
          }
        } else {
          console.error('Login page not found, forcing reload');
          window.location.reload();
        }
      } catch (error) {
        console.error('Redirect failed, forcing reload:', error);
        window.location.reload();
      }
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