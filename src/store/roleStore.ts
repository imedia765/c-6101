import { create } from 'zustand';
import { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['app_role'];

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
  setUserRole: (role: UserRole | null) => void;
  setUserRoles: (roles: UserRole[] | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setPermissions: (permissions: RoleState['permissions']) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  userRole: null,
  userRoles: null,
  isLoading: true,
  error: null,
  permissions: {
    canManageUsers: false,
    canCollectPayments: false,
    canAccessSystem: false,
    canViewAudit: false,
    canManageCollectors: false,
  },
  setUserRole: (role) => set({ userRole: role }),
  setUserRoles: (roles) => set({ userRoles: roles }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setPermissions: (permissions) => set({ permissions }),
}));

export const mapRolesToPermissions = (roles: UserRole[] | null): RoleState['permissions'] => {
  const permissions = {
    canManageUsers: false,
    canCollectPayments: false,
    canAccessSystem: false,
    canViewAudit: false,
    canManageCollectors: false,
  };

  if (!roles) return permissions;

  if (roles.includes('admin')) {
    permissions.canManageUsers = true;
    permissions.canCollectPayments = true;
    permissions.canAccessSystem = true;
    permissions.canViewAudit = true;
    permissions.canManageCollectors = true;
  } else if (roles.includes('collector')) {
    permissions.canCollectPayments = true;
    permissions.canManageUsers = true;
  }

  return permissions;
};