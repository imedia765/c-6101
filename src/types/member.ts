import { Database } from '@/integrations/supabase/types';

export type Member = Database['public']['Tables']['members']['Row'];
export type BaseUserRole = 'admin' | 'collector' | 'member' | null;
export type UserRole = BaseUserRole;
export type UserRoles = BaseUserRole[];

export type { UserRole as default };