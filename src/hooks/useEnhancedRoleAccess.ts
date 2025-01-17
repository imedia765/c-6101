import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useRoleStore } from '@/store/roleStore';
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['app_role'];

export const useEnhancedRoleAccess = () => {
  const { toast } = useToast();
  const setUserRoles = useRoleStore((state) => state.setUserRoles);
  const setUserRole = useRoleStore((state) => state.setUserRole);
  const setIsLoading = useRoleStore((state) => state.setIsLoading);
  const setError = useRoleStore((state) => state.setError);

  const fetchRoles = useCallback(async () => {
    console.log('Fetching user roles - start');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log('No authenticated session found');
      setUserRoles(null);
      setUserRole(null);
      return null;
    }

    console.log('Fetching roles for user:', session.user.id);
    
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id);

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      throw rolesError;
    }

    const userRoles = roles?.map(r => r.role as UserRole) || ['member'];
    console.log('Fetched roles:', userRoles);

    // Force a new reference for the array to ensure React detects the change
    const userRolesCopy = [...userRoles];
    
    // Set primary role (admin > collector > member)
    const primaryRole = userRoles.includes('admin' as UserRole) 
      ? 'admin' as UserRole 
      : userRoles.includes('collector' as UserRole)
        ? 'collector' as UserRole
        : 'member' as UserRole;

    setUserRoles(userRolesCopy);
    setUserRole(primaryRole);
    
    return userRolesCopy;
  }, [setUserRoles, setUserRole]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['userRoles'],
    queryFn: fetchRoles,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    meta: {
      errorMessage: 'Failed to load user roles',
      onError: (error: Error) => {
        console.error('Role loading error:', error);
        setError(error);
        setIsLoading(false); // Ensure loading state is cleared on error
        toast({
          title: "Error loading roles",
          description: "There was a problem loading user roles. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  // Update loading state in store
  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  return {
    userRoles: data,
    isLoading,
    error,
  };
};