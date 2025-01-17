import { format } from 'date-fns';
import { useRoleHistory } from '@/hooks/useRoleHistory';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

interface RoleHistoryViewProps {
  userId?: string;
}

const RoleHistoryView = ({ userId }: RoleHistoryViewProps) => {
  const { data: roleHistory, isLoading } = useRoleHistory(userId);

  if (isLoading) {
    return <div>Loading role history...</div>;
  }

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'role_added':
        return 'bg-green-500';
      case 'role_removed':
        return 'bg-red-500';
      case 'role_upgraded':
        return 'bg-blue-500';
      case 'role_downgraded':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: 'text-dashboard-accent1',
      collector: 'text-dashboard-accent2',
      member: 'text-dashboard-accent3',
    };

    return (
      <div className="flex items-center gap-1">
        <Shield className={`w-4 h-4 ${roleColors[role as keyof typeof roleColors]}`} />
        {role}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Role History</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Change Type</TableHead>
            <TableHead>Previous Role</TableHead>
            <TableHead>New Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roleHistory?.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                {format(new Date(entry.created_at), 'PPpp')}
              </TableCell>
              <TableCell>
                <Badge className={getChangeTypeColor(entry.change_type)}>
                  {entry.change_type.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                {entry.old_value ? getRoleBadge(entry.old_value.role) : '-'}
              </TableCell>
              <TableCell>
                {entry.new_value ? getRoleBadge(entry.new_value.role) : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoleHistoryView;