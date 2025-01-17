import { Database } from "@/integrations/supabase/types";
import { useRoleStore } from '@/store/roleStore';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type UserRole = Database['public']['Enums']['app_role'];

interface RoleState {
  userRole: UserRole | null;
  userRoles: UserRole[] | null;
  isLoading: boolean;
  error: Error | null;
  permissions: {
    canManageUsers: boolean;
    canCollectPayments: boolean;
    canAccessSystem: boolean;
    canViewAudit: boolean;
    canManageCollectors: boolean;
  };
}

export const useRoleAccess = () => {
  const { toast } = useToast();
  const {
    userRole,
    userRoles,
    isLoading: roleLoading,
    error,
    permissions,
    setUserRole,
    setUserRoles,
    setIsLoading,
    setError
  } = useRoleStore() as RoleState & {
    setUserRole: (role: UserRole | null) => void;
    setUserRoles: (roles: UserRole[] | null) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: Error | null) => void;
  };

  // Query to fetch user roles with improved error handling and logging
  useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      console.log('Fetching user roles - start');
      setIsLoading(true);
      
      try {
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
          toast({
            title: "Error fetching roles",
            description: "There was a problem loading your access permissions.",
            variant: "destructive",
          });
          throw rolesError;
        }

        const userRoles = roles?.map(r => r.role as UserRole) || ['member'];
        console.log('Fetched roles:', userRoles);

        // Set primary role (admin > collector > member)
        const primaryRole = userRoles.includes('admin' as UserRole) 
          ? 'admin' as UserRole 
          : userRoles.includes('collector' as UserRole)
            ? 'collector' as UserRole
            : 'member' as UserRole;

        setUserRoles(userRoles);
        setUserRole(primaryRole);
        return userRoles;
      } catch (error: any) {
        console.error('Role fetch error:', error);
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const hasRole = (role: UserRole): boolean => {
    console.log('Checking role:', { role, userRole, userRoles });
    if (!userRoles) return false;
    return userRoles.includes(role);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const canAccessTab = (tab: string): boolean => {
    if (!userRoles) return false;

    switch (tab) {
      case 'dashboard':
        return true;
      case 'users':
        return hasRole('admin') || hasRole('collector');
      case 'financials':
        return hasRole('admin') || hasRole('collector');
      case 'system':
        return hasRole('admin');
      default:
        return false;
    }
  };

  return {
    userRole,
    userRoles,
    roleLoading,
    error,
    permissions,
    hasRole,
    hasAnyRole,
    canAccessTab
  };
};