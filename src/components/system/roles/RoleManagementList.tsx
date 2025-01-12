import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from "@/components/ui/scroll-area";
import UserRoleCard from './UserRoleCard';
import { supabase } from "@/integrations/supabase/client";
import RoleManagementHeader from './RoleManagementHeader';
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['app_role'];

interface UserRoleData {
  role: UserRole;
}

interface UserData {
  id: string;
  user_id: string;
  full_name: string;
  member_number: string;
  role: UserRole;
  auth_user_id: string;
  user_roles: UserRoleData[];
}

const ITEMS_PER_PAGE = 10;

const RoleManagementList = ({ searchTerm }: { searchTerm: string }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
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

        const { data: rolesData, error: userRolesError } = await rolesQuery;

        if (userRolesError) {
          console.error('Error fetching user roles:', userRolesError);
          throw userRolesError;
        }

        const filteredMembers = membersData.filter(member => {
          if (selectedRole === 'all') return true;
          return rolesData.some(r => 
            r.user_id === member.auth_user_id && 
            r.role === selectedRole
          );
        });

        return filteredMembers.map(member => {
          const userRoles = rolesData
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

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Error in role change:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <RoleManagementHeader
        searchTerm={searchTerm}
        onSearchChange={() => {}}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        totalCount={users?.length || 0}
        filteredCount={users?.length || 0}
      />
      
      <ScrollArea 
        className="h-[600px]"
        onScroll={handleScroll}
      >
        {isLoading && page === 0 ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-accent1"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {users?.map((user) => (
              <UserRoleCard
                key={user.id}
                user={user}
                onRoleChange={handleRoleChange}
              />
            ))}
            {isLoading && page > 0 && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-dashboard-accent1"></div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default RoleManagementList;