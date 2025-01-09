import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface RoleManagementHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const RoleManagementHeader = ({ searchTerm, onSearchChange }: RoleManagementHeaderProps) => {
  return (
    <div className="mb-6 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-muted h-4 w-4" />
      <Input
        type="text"
        placeholder="Search by name or member number..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 bg-dashboard-card/50 border-white/10 focus:border-white/20 text-dashboard-text placeholder:text-dashboard-muted"
      />
    </div>
  );
};

export default RoleManagementHeader;