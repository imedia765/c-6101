import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RoleHistoryEntry {
  id: string;
  role_id: string;
  changed_by_user_id: string;
  change_type: 'role_added' | 'role_removed' | 'role_upgraded' | 'role_downgraded';
  old_value: {
    role: string;
    user_id: string;
    timestamp: string;
  } | null;
  new_value: {
    role: string;
    user_id: string;
    timestamp: string;
  } | null;
  created_at: string;
}

export const useRoleHistory = (userId?: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['roleHistory', userId],
    queryFn: async () => {
      console.log('Fetching role history for user:', userId);
      
      let query = supabase
        .from('role_history')
        .select(`
          id,
          role_id,
          changed_by_user_id,
          change_type,
          old_value,
          new_value,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('changed_by_user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching role history:', error);
        toast({
          title: "Error fetching role history",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as RoleHistoryEntry[];
    },
    enabled: true,
  });
};