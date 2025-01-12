import { Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PermissionsSectionProps {
  permissions: {
    canManageRoles: boolean;
    canCollectPayments: boolean;
    canAccessAuditLogs: boolean;
    canManageMembers: boolean;
  };
}

const PermissionsSection = ({ permissions }: PermissionsSectionProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Key className="w-4 h-4 text-dashboard-accent1" />
        <h5 className="font-medium text-white">Permissions</h5>
      </div>
      <div className="bg-dashboard-cardHover rounded-lg p-3">
        <div className="space-y-2">
          {Object.entries(permissions).map(([perm, granted]) => (
            <div key={perm} className="flex items-center justify-between">
              <span className="text-sm text-dashboard-text">
                {perm.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <Badge variant={granted ? "default" : "secondary"}>
                {granted ? 'Granted' : 'Denied'}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PermissionsSection;