import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/dateFormat";

interface CollectorMemberPaymentsProps {
  collectorName: string;
}

interface PaymentRequest {
  id: string;
  created_at: string;
  amount: number;
  payment_type: string;
  status: string;
  ticket_number?: string | null;
  approved_at: string | null;
  approved_by: string | null;
  collector_id: string;
  member_id: string;
  member_number: string;
  notes: string | null;
  payment_method: "bank_transfer" | "cash";
  members?: {
    full_name: string;
    member_number: string;
  };
}

const CollectorMemberPayments = ({ collectorName }: CollectorMemberPaymentsProps) => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['collector-member-payments', collectorName],
    queryFn: async () => {
      console.log('Fetching payments for collector:', collectorName);
      
      const { data: collectorData } = await supabase
        .from('members_collectors')
        .select('id')
        .eq('name', collectorName)
        .single();

      if (!collectorData) return [];

      const { data: paymentRequests, error } = await supabase
        .from('payment_requests')
        .select(`
          *,
          members!payment_requests_member_id_fkey (
            full_name,
            member_number
          )
        `)
        .eq('collector_id', collectorData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        throw error;
      }

      return paymentRequests as PaymentRequest[];
    },
    enabled: !!collectorName,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="glass-card p-6 mt-8">
      <h3 className="text-xl font-medium text-white mb-6">Member Payments</h3>
      
      <div className="rounded-md border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-dashboard-text">Payment #</TableHead>
              <TableHead className="text-dashboard-text">Ticket #</TableHead>
              <TableHead className="text-dashboard-text">Member</TableHead>
              <TableHead className="text-dashboard-text">Amount</TableHead>
              <TableHead className="text-dashboard-text">Type</TableHead>
              <TableHead className="text-dashboard-text">Date</TableHead>
              <TableHead className="text-dashboard-text">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.map((payment, index) => (
              <TableRow 
                key={payment.id}
                className="border-white/10 hover:bg-white/5"
              >
                <TableCell className="font-mono text-dashboard-accent2">
                  #{(payments.length - index).toString().padStart(3, '0')}
                </TableCell>
                <TableCell className="font-mono text-dashboard-accent2">
                  {payment.ticket_number || '-'}
                </TableCell>
                <TableCell className="text-white font-medium">
                  <div>
                    <p>{payment.members?.full_name}</p>
                    <p className="text-sm text-dashboard-muted">{payment.members?.member_number}</p>
                  </div>
                </TableCell>
                <TableCell className="text-dashboard-accent3">
                  £{payment.amount}
                </TableCell>
                <TableCell className="capitalize text-dashboard-text">
                  {payment.payment_type}
                </TableCell>
                <TableCell className="text-dashboard-text">
                  {formatDate(payment.created_at || '')}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      payment.status === 'approved'
                        ? 'bg-dashboard-accent3/20 text-dashboard-accent3'
                        : payment.status === 'rejected'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-dashboard-warning/20 text-dashboard-warning'
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default CollectorMemberPayments;