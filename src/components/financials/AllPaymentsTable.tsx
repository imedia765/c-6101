import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Check, X, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AllPaymentsTableProps {
  showHistory?: boolean;
}

const AllPaymentsTable = ({ showHistory = false }: AllPaymentsTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: paymentsData, isLoading, error } = useQuery({
    queryKey: ['payment-requests'],
    queryFn: async () => {
      // Get all payment data without pagination
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
          collectors:members_collectors(
            name,
            phone,
            email
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        throw error;
      }

      console.log('Fetched payment data:', data);
      return { data, count };
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

  const payments = paymentsData?.data || [];

  if (!payments.length) {
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
        <div className="rounded-md border border-white/10">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-dashboard-text">Date</TableHead>
                <TableHead className="text-dashboard-text">Member</TableHead>
                <TableHead className="text-dashboard-text">Member Number</TableHead>
                <TableHead className="text-dashboard-text">Contact</TableHead>
                <TableHead className="text-dashboard-text">Collector</TableHead>
                <TableHead className="text-dashboard-text">Collector Contact</TableHead>
                <TableHead className="text-dashboard-text">Type</TableHead>
                <TableHead className="text-dashboard-text">Amount</TableHead>
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
                  <TableCell className="text-dashboard-text">
                    {format(new Date(payment.created_at), 'PPP')}
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {payment.members?.full_name}
                  </TableCell>
                  <TableCell className="text-dashboard-text">
                    {payment.members?.member_number}
                  </TableCell>
                  <TableCell className="text-dashboard-text">
                    <div className="flex flex-col">
                      <span>{payment.members?.phone}</span>
                      <span className="text-sm text-gray-400">{payment.members?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-dashboard-accent1">
                    {payment.collectors?.name}
                  </TableCell>
                  <TableCell className="text-dashboard-text">
                    <div className="flex flex-col">
                      <span>{payment.collectors?.phone}</span>
                      <span className="text-sm text-gray-400">{payment.collectors?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-dashboard-text">
                    {payment.payment_type}
                  </TableCell>
                  <TableCell className="text-dashboard-accent3">
                    £{payment.amount}
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
      </div>
    </Card>
  );
};

export default AllPaymentsTable;