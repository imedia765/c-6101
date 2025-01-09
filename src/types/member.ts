import { Database } from '@/integrations/supabase/types';

export type Member = Database['public']['Tables']['members']['Row'];