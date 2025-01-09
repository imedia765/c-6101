import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface SystemCheckDetailsTableProps {
  checkType: string;
  details: any;
  memberNames?: { [key: string]: string };
}

export const SystemCheckDetailsTable = ({ checkType, details, memberNames }: SystemCheckDetailsTableProps) => {
  if (checkType === 'Collectors Without Role' && Array.isArray(details)) {
    return (
      <Table className="border-collapse">
        <TableHeader className="bg-dashboard-card/50">
          <TableRow className="border-b border-white/10">
            <TableHead className="py-2">Collector Name</TableHead>
            <TableHead className="py-2">Member Number</TableHead>
            <TableHead className="py-2">Table</TableHead>
            <TableHead className="py-2">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.map((item: any, index: number) => (
            <TableRow key={index} className="border-b border-white/5 hover:bg-dashboard-card/80">
              <TableCell className="py-1.5">{item.collector_name}</TableCell>
              <TableCell className="py-1.5">{item.member_number || 'Not Assigned'}</TableCell>
              <TableCell className="py-1.5 text-xs">members_collectors</TableCell>
              <TableCell className="py-1.5">
                <Badge variant="warning">Missing Role</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (checkType === 'Multiple Roles Assigned') {
    return (
      <Table className="border-collapse">
        <TableHeader className="bg-dashboard-card/50">
          <TableRow className="border-b border-white/10">
            <TableHead className="py-2">Member Name</TableHead>
            <TableHead className="py-2">User ID</TableHead>
            <TableHead className="py-2">Current Roles</TableHead>
            <TableHead className="py-2">Source Table</TableHead>
            <TableHead className="py-2">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(details) ? details.map((item: any, index: number) => (
            <TableRow key={index} className="border-b border-white/5 hover:bg-dashboard-card/80">
              <TableCell className="py-1.5 text-dashboard-accent1 font-medium">
                {memberNames?.[item.user_id] || 'Unknown Member'}
              </TableCell>
              <TableCell className="py-1.5 text-xs">{item.user_id}</TableCell>
              <TableCell className="py-1.5">
                {Array.isArray(item.roles) ? item.roles.map((role: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="mr-1">
                    {role}
                  </Badge>
                )) : (
                  <Badge variant="outline">{item.roles}</Badge>
                )}
              </TableCell>
              <TableCell className="py-1.5 text-xs">user_roles</TableCell>
              <TableCell className="py-1.5 text-xs">
                {Array.isArray(item.created_at) 
                  ? item.created_at.map((date: string) => 
                      new Date(date).toLocaleDateString()
                    ).join(', ')
                  : new Date(item.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          )) : (
            <TableRow className="border-b border-white/5">
              <TableCell colSpan={5} className="py-1.5 text-center">No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }

  if (typeof details === 'string') return <div>{details}</div>;
  
  return (
    <div>
      {Object.entries(details).map(([key, value]) => (
        <div key={key} className="mb-1">
          <span className="font-medium text-dashboard-accent1">{key}:</span>{' '}
          <span className="text-dashboard-text">{JSON.stringify(value, null, 2)}</span>
        </div>
      ))}
    </div>
  );
};