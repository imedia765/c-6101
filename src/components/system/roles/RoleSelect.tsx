import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";
import { Shield } from "lucide-react";

type UserRole = Database['public']['Enums']['app_role'];

interface RoleSelectProps {
  userId: string;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelect = ({ userId, currentRole, onRoleChange }: RoleSelectProps) => {
  return (
    <Select
      value={currentRole}
      onValueChange={(value) => onRoleChange(value as UserRole)}
    >
      <SelectTrigger className="w-[120px] h-8 bg-dashboard-card border-white/10">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-dashboard-accent1" />
            Admin
          </div>
        </SelectItem>
        <SelectItem value="collector">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-dashboard-accent2" />
            Collector
          </div>
        </SelectItem>
        <SelectItem value="member">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-dashboard-accent3" />
            Member
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RoleSelect;