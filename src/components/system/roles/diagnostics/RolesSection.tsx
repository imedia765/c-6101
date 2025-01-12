import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DatabaseEnums } from "@/integrations/supabase/types/enums";

type UserRole = DatabaseEnums['app_role'];

interface RolesSectionProps {
  roles: Array<{ role: UserRole }>;
}

const RolesSection = ({ roles }: RolesSectionProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-dashboard-accent1" />
        <h5 className="font-medium text-white">Assigned Roles</h5>
      </div>
      <div className="bg-dashboard-cardHover rounded-lg p-3">
        <div className="flex gap-2 flex-wrap">
          {roles.map((role, idx) => (
            <Badge key={idx} variant="default">
              {role.role}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RolesSection;