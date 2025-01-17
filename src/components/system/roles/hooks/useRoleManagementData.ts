import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type UserRole = Database['public']['Enums']['app_role'];

interface UserData {
  id: string;
  user_id: string;
  full_name: string;
  member_number: string;
  role: UserRole;
  auth_user_id: string;
  user_roles: { role: UserRole }[];
}

export const useRoleManagementData = (
  searchTerm: string,
  selectedRole: UserRole | 'all',
  page: number,
  onDebugLog?: (logs: string[]) => void
) => {
  const { toast } = useToast();
  const ITEMS_PER_PAGE = 10;

  return useQuery({
    queryKey: ['users', searchTerm, selectedRole, page],
    queryFn: async () => {
      console.log('Fetching users with search term:', searchTerm, 'role:', selectedRole, 'page:', page);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: currentUserRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (rolesError) throw rolesError;

        const isAdmin = currentUserRoles?.some(role => 
          typeof role === 'object' && 'role' in role && role.role === 'admin'
        );
        
        if (!isAdmin) {
          throw new Error('Unauthorized: Admin access required');
        }

        let membersQuery = supabase
          .from('members')
          .select(`
            id,
            auth_user_id,
            full_name,
            member_number
          `)
          .order('created_at', { ascending: false })
          .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

        if (searchTerm) {
          membersQuery = membersQuery.or(`full_name.ilike.%${searchTerm}%,member_number.ilike.%${searchTerm}%`);
        }

        const { data: membersData, error: membersError } = await membersQuery;

        if (membersError) {
          console.error('Error fetching members:', membersError);
          throw membersError;
        }

        const memberAuthIds = membersData
          .map(m => m.auth_user_id)
          .filter(id => id !== null) as string[];

        let rolesQuery = supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', memberAuthIds);

        if (selectedRole !== 'all') {
          rolesQuery = rolesQuery.eq('role', selectedRole);
        }

        const { data: rolesList, error: userRolesError } = await rolesQuery;

        if (userRolesError) {
          console.error('Error fetching user roles:', userRolesError);
          throw userRolesError;
        }

        const filteredMembers = membersData.filter(member => {
          if (selectedRole === 'all') return true;
          return rolesList.some(r => 
            r.user_id === member.auth_user_id && 
            r.role === selectedRole
          );
        });

        return filteredMembers.map(member => {
          const userRoles = rolesList
            .filter(r => r.user_id === member.auth_user_id)
            .map(r => ({ role: r.role }));

          return {
            id: member.id,
            user_id: member.auth_user_id || '',
            full_name: member.full_name,
            member_number: member.member_number,
            role: userRoles.length > 0 ? userRoles[0].role : 'member' as UserRole,
            auth_user_id: member.auth_user_id || '',
            user_roles: userRoles
          };
        });

      } catch (error: any) {
        console.error('Error in user fetch:', error);
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
    },
  });
};