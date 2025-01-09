import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserCheck, Users } from "lucide-react";

interface RoleBadgeProps {
  role: string | null;
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  // Function to determine the highest privilege role
  const getHighestRole = (role: string | null): string => {
    if (!role) return 'member';
    
    // Admin has highest privilege
    if (role === 'admin') return 'admin';
    // Collector has second highest privilege
    if (role === 'collector') return 'collector';
    // Member has lowest privilege
    return 'member';
  };

  const highestRole = getHighestRole(role);

  const badgeContent = () => {
    switch (highestRole) {
      case 'admin':
        return (
          <Badge variant="outline" className="bg-dashboard-accent1/20 text-dashboard-accent1 border-0 gap-1 inline-flex items-center">
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </Badge>
        );
      case 'collector':
        return (
          <Badge variant="outline" className="bg-dashboard-accent2/20 text-dashboard-accent2 border-0 gap-1 inline-flex items-center">
            <UserCheck className="w-3 h-3" />
            <span>Collector</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-dashboard-accent3/20 text-dashboard-accent3 border-0 gap-1 inline-flex items-center">
            <Users className="w-3 h-3" />
            <span>Member</span>
          </Badge>
        );
    }
  };

  return badgeContent();
};

export default RoleBadge;