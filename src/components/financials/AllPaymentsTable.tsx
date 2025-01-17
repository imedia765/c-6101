import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { PaymentTableHeader } from "../payments-table/PaymentTableHeader";
import { PaymentTableRow } from "../payments-table/PaymentTableRow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AllPaymentsTableProps {
  showHistory?: boolean;
}

const AllPaymentsTable = ({ showHistory = false }: AllPaymentsTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: paymentsData, isLoading, error } = useQuery({
    queryKey: ['payment-requests'],
    queryFn: async () => {
      console.log('Fetching payment requests...');
      
      const { data, error, count } = await supabase
        .from('payment_requests')
        .select(`
          *,
          members!payment_requests_member_id_fkey(
            full_name,
            member_number,
            phone,
            email
          ),
          collector:members_collectors!payment_requests_collector_id_fkey(
            name,
            phone,
            email
          )
        `, { count: 'exact' });

      if (error) {
        console.error('Error fetching payments:', error);
        throw error;
      }

      console.log('Raw payments data:', data);

      // Group payments by collector name, with better error handling
      const groupedPayments = data?.reduce((acc, payment) => {
        // Get collector name with proper null checking
        const collectorName = payment.collector?.name || 'Unassigned';
        console.log('Processing payment:', {
          id: payment.id,
          collectorId: payment.collector_id,
          collectorData: payment.collector,
          collectorName
        });

        if (!acc[collectorName]) {
          acc[collectorName] = [];
        }
        acc[collectorName].push(payment);
        return acc;
      }, {} as Record<string, any[]>);

      console.log('Grouped payments:', groupedPayments);

      return { groupedPayments, count };
    },
  });

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

  const handleDelete = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payment_requests')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Payment Deleted",
        description: "The payment record has been deleted successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ['payment-requests'] });
      queryClient.invalidateQueries({ queryKey: ['payment-statistics'] });
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast({
        title: "Error",
        description: "Failed to delete the payment record.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-dashboard-card border-dashboard-accent1/20 rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-medium text-white mb-4">Payment History & Approvals</h2>
          <div className="flex items-center gap-2 text-white">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading payment history...</span>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-dashboard-card border-dashboard-accent1/20 rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-medium text-white mb-4">Payment History & Approvals</h2>
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>Error loading payment history: {error.message}</span>
          </div>
        </div>
      </Card>
    );
  }

  const groupedPayments = paymentsData?.groupedPayments || {};
  const collectors = Object.keys(groupedPayments);

  if (collectors.length === 0) {
    return (
      <Card className="bg-dashboard-card border-dashboard-accent1/20 rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-medium text-white mb-4">Payment History & Approvals</h2>
          <div className="flex items-center gap-2 text-white">
            <AlertCircle className="h-4 w-4" />
            <span>No payment history found.</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-dashboard-card border-dashboard-accent1/20 rounded-lg">
      <div className="p-6">
        <h2 className="text-xl font-medium text-white mb-4">Payment History & Approvals</h2>
        <Accordion type="single" collapsible className="space-y-4">
          {collectors.map((collectorName) => (
            <AccordionItem
              key={collectorName}
              value={collectorName}
              className="border border-white/10 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{collectorName}</span>
                    <span className="text-sm text-gray-400">
                      ({groupedPayments[collectorName].length} payments)
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="rounded-md border border-white/10">
                  <Table>
                    <PaymentTableHeader />
                    <TableBody>
                      {groupedPayments[collectorName].map((payment) => (
                        <PaymentTableRow
                          key={payment.id}
                          payment={payment}
                          onApprove={(id) => handleApproval(id, true)}
                          onReject={(id) => handleApproval(id, false)}
                          onDelete={handleDelete}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Card>
  );
};

export default AllPaymentsTable;