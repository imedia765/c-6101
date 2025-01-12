import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['app_role'];

interface RoleManagementHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: UserRole | 'all';
  onRoleChange: (role: UserRole | 'all') => void;
  totalCount: number;
  filteredCount: number;
}

const RoleManagementHeader = ({ 
  searchTerm, 
  onSearchChange,
  selectedRole,
  onRoleChange,
  totalCount,
  filteredCount
}: RoleManagementHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-white">
            <span className="font-medium">Total Members:</span>{' '}
            <span className="text-dashboard-accent1">{totalCount}</span>
          </div>
          {searchTerm && (
            <div className="text-white">
              <span className="font-medium">Found:</span>{' '}
              <span className="text-dashboard-accent1">{filteredCount}</span>
            </div>
          )}
        </div>
        <Select
          value={selectedRole}
          onValueChange={(value) => onRoleChange(value as UserRole | 'all')}
        >
          <SelectTrigger className="w-[180px] bg-dashboard-card/50 border-dashboard-cardBorder text-white">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="bg-dashboard-card border-dashboard-cardBorder">
            <SelectItem value="all" className="text-white hover:bg-dashboard-card/80">All Roles</SelectItem>
            <SelectItem value="admin" className="text-white hover:bg-dashboard-card/80">Admin</SelectItem>
            <SelectItem value="collector" className="text-white hover:bg-dashboard-card/80">Collector</SelectItem>
            <SelectItem value="member" className="text-white hover:bg-dashboard-card/80">Member</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-muted h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by name or member number..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-dashboard-card/50 border-dashboard-cardBorder text-white placeholder:text-dashboard-muted focus:border-dashboard-accent1"
        />
      </div>
    </div>
  );
};

export default RoleManagementHeader;