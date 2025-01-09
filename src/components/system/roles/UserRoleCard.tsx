import { Users, Shield } from 'lucide-react';
import { Database } from "@/integrations/supabase/types";
import RoleSelect from './RoleSelect';

interface UserRoleCardProps {
  user: {
    user_id: string;
    full_name: string;
    member_number: string;
    roles?: Database['public']['Enums']['app_role'][];
    role: Database['public']['Enums']['app_role'];
  };
  onRoleChange: (userId: string, role: Database['public']['Enums']['app_role']) => void;
}

const UserRoleCard = ({ user, onRoleChange }: UserRoleCardProps) => {
  const getRoleBadge = (role: Database['public']['Enums']['app_role']) => {
    const baseClasses = "px-2 py-0.5 rounded-full text-xs font-medium";
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-dashboard-accent1/20 text-dashboard-accent1`;
      case 'collector':
        return `${baseClasses} bg-dashboard-accent2/20 text-dashboard-accent2`;
      default:
        return `${baseClasses} bg-dashboard-accent3/20 text-dashboard-accent3`;
    }
  };

  return (
    <div className="flex items-center justify-between p-5 bg-dashboard-card/50 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200">
      <div className="flex items-center gap-4">
        <Users className="h-5 w-5 text-dashboard-accent2" />
        <div>
          <p className="text-white font-medium mb-1">{user.full_name}</p>
          <p className="text-sm text-dashboard-muted">Member #{user.member_number}</p>
          {user.roles && user.roles.length > 1 && (
            <div className="flex gap-2 mt-2">
              {user.roles.map((role, index) => (
                <span key={index} className={getRoleBadge(role)}>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {role}
                  </div>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <RoleSelect 
        currentRole={user.role}
        userId={user.user_id}
        onRoleChange={(role) => onRoleChange(user.user_id, role)}
      />
    </div>
  );
};

export default UserRoleCard;