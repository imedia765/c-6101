import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import RoleManagementHeader from './RoleManagementHeader';
import { useRoleManagementData } from './hooks/useRoleManagementData';
import RoleManagementContent from './components/RoleManagementContent';

type UserRole = Database['public']['Enums']['app_role'];

interface RoleManagementListProps {
  searchTerm: string;
  onDebugLog?: (logs: string[]) => void;
}

const RoleManagementList = ({ searchTerm, onDebugLog }: RoleManagementListProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users, isLoading } = useRoleManagementData(searchTerm, selectedRole, page, onDebugLog);

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
      
      <RoleManagementContent
        users={users}
        isLoading={isLoading}
        page={page}
        searchTerm={searchTerm}
        handleScroll={handleScroll}
        handleRoleChange={handleRoleChange}
      />
    </div>
  );
};

export default RoleManagementList;