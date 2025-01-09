import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface CollectorPaymentsProps {
  payments: any[];
}

const CollectorPayments = ({ payments }: CollectorPaymentsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleApproval = async (paymentId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('payment_requests')
        .update({
          status: approved ? 'approved' : 'rejected',
          approved_at: approved ? new Date().toISOString() : null,
          approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: approved ? "Payment Approved" : "Payment Rejected",
        description: "The payment request has been processed successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ['collector-payment-stats'] });
      queryClient.invalidateQueries({ queryKey: ['payment-requests'] });
      queryClient.invalidateQueries({ queryKey: ['payment-statistics'] });
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Failed to process the payment request.",
        variant: "destructive",
      });
    }
  };

  if (payments.length === 0) {
    return <p className="text-dashboard-text">No payment requests found for this collector.</p>;
  }

  return (
    <div className="rounded-md border border-white/10">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-dashboard-text">Member</TableHead>
            <TableHead className="text-dashboard-text">Amount</TableHead>
            <TableHead className="text-dashboard-text">Type</TableHead>
            <TableHead className="text-dashboard-text">Status</TableHead>
            <TableHead className="text-dashboard-text">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow 
              key={payment.id}
              className="border-white/10 hover:bg-white/5"
            >
              <TableCell className="text-white font-medium">
                {payment.members?.full_name}
              </TableCell>
              <TableCell className="text-dashboard-accent3">
                £{payment.amount}
              </TableCell>
              <TableCell className="capitalize text-dashboard-text">
                {payment.payment_type}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${payment.status === 'approved' ? 'bg-dashboard-accent3/20 text-dashboard-accent3' : 
                    payment.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 
                    'bg-dashboard-warning/20 text-dashboard-warning'}`}>
                  {payment.status}
                </span>
              </TableCell>
              <TableCell>
                {payment.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-dashboard-accent3 hover:text-dashboard-accent3 hover:bg-dashboard-accent3/20"
                      onClick={() => handleApproval(payment.id, true)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-400 hover:bg-red-500/20"
                      onClick={() => handleApproval(payment.id, false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CollectorPayments;