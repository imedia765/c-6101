import { ReactNode } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import type { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['app_role'];

interface RoleBasedRendererProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireAllRoles?: boolean;
  fallback?: ReactNode;
}

const RoleBasedRenderer = ({
  children,
  allowedRoles = [],
  requireAllRoles = false,
  fallback = null
}: RoleBasedRendererProps) => {
  const { hasRole, hasAnyRole } = useRoleAccess();

  if (!allowedRoles.length) return <>{children}</>;

  const hasAccess = requireAllRoles
    ? allowedRoles.every(role => hasRole(role))
    : hasAnyRole(allowedRoles);

  return <>{hasAccess ? children : fallback}</>;
};

export default RoleBasedRenderer;