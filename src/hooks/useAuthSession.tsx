import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSignOut = async (skipStorageClear = false) => {
    console.log('Starting sign out process...');
    if (isLoggingOut) {
      console.log('Logout already in progress, skipping...');
      return;
    }

    try {
      setIsLoggingOut(true);
      setLoading(true);
      
      console.log('Clearing query cache...');
      await queryClient.resetQueries();
      await queryClient.clear();
      
      if (!skipStorageClear) {
        console.log('Clearing local storage...');
        localStorage.clear();
        sessionStorage.clear();
      }
      
      console.log('Signing out from Supabase...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Sign out successful');
      setSession(null);
      window.location.href = '/login';
      
    } catch (error: any) {
      console.error('Error during sign out:', error);
      toast({
        title: "Error signing out",
        description: error.message.includes('502') 
          ? "Failed to connect to the server. Please check your network connection and try again."
          : error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('Auth session hook mounted');

    const initializeSession = async () => {
      try {
        console.log('Initializing session...');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session initialization error:', error);
          throw error;
        }
        
        if (mounted) {
          console.log('Setting session state:', !!currentSession);
          setSession(currentSession);
          setLoading(false);
        }
      } catch (error) {
        console.error('Session initialization failed:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, !!currentSession);
      
      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !currentSession)) {
        console.log('User signed out or token refresh failed');
        window.location.href = '/login';
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('User signed in or token refreshed');
        setSession(currentSession);
        queryClient.invalidateQueries({ queryKey: ['userRoles'] });
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