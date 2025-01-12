import { PlanningData } from '@/types/plan';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

interface CollectorPlanningSectionProps {
  collectorName: string;
  members: PlanningData[];
}

const CollectorPlanningSection = ({ collectorName, members }: CollectorPlanningSectionProps) => {
  const totalPending = members.filter(m => m.yearly_payment_status === 'pending').length;
  const totalAmount = members.reduce((sum, m) => sum + (m.yearly_payment_amount || 0), 0);

  return (
    <Card className="p-6 bg-dashboard-card border-dashboard-accent1/20">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-white">{collectorName}</h2>
          <div className="flex gap-4">
            <Badge variant="outline" className="bg-dashboard-accent1/20 text-dashboard-accent1">
              {totalPending} Pending
            </Badge>
            <Badge variant="outline" className="bg-dashboard-accent3/20 text-dashboard-accent3">
              £{totalAmount} Total
            </Badge>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.member_number}>
              <TableCell>
                <div>
                  <p className="font-medium text-dashboard-text">{member.full_name}</p>
                  <p className="text-sm text-dashboard-muted">{member.member_number}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={
                    member.yearly_payment_status === 'pending'
                      ? 'bg-dashboard-warning/20 text-dashboard-warning'
                      : member.yearly_payment_status === 'completed'
                      ? 'bg-dashboard-accent3/20 text-dashboard-accent3'
                      : 'bg-dashboard-destructive/20 text-dashboard-destructive'
                  }
                >
                  {member.yearly_payment_status}
                </Badge>
              </TableCell>
              <TableCell>
                {member.yearly_payment_due_date && (
                  format(new Date(member.yearly_payment_due_date), 'PP')
                )}
              </TableCell>
              <TableCell className="text-dashboard-accent3">
                £{member.yearly_payment_amount || 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default CollectorPlanningSection;