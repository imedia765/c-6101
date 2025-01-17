import { useState } from 'react';
import RoleHistoryView from '../RoleHistoryView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['app_role'];

interface RoleManagementContentProps {
  users?: any[];
  isLoading: boolean;
  page: number;
  searchTerm: string;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  handleRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}

export const RoleManagementContent = ({ 
  users,
  isLoading,
  page,
  searchTerm,
  handleScroll,
  handleRoleChange 
}: RoleManagementContentProps) => {
  const [selectedTab, setSelectedTab] = useState('users');

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="users">User Roles</TabsTrigger>
        <TabsTrigger value="history">Role History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="users">
        <div 
          className="space-y-4 max-h-[600px] overflow-y-auto" 
          onScroll={handleScroll}
        >
          {isLoading && <div>Loading...</div>}
          {users?.map((user) => (
            <div key={user.id} className="p-4 bg-dashboard-card rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">{user.full_name}</h3>
                  <p className="text-dashboard-muted">{user.member_number}</p>
                </div>
                {/* Role selection will be implemented here */}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="history">
        <RoleHistoryView />
      </TabsContent>
    </Tabs>
  );
};

export default RoleManagementContent;