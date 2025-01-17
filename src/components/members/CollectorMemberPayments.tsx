import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/dateFormat";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const { toast } = useToast();

  const { data: payments, isLoading, refetch } = useQuery({
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

      refetch();
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
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="glass-card p-6 mt-8">
      <h3 className="text-xl font-medium text-white mb-6">Member Payments</h3>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-dashboard-card">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-dashboard-accent1 data-[state=active]:text-white"
          >
            All Payments
          </TabsTrigger>
          <TabsTrigger 
            value="pending"
            className="data-[state=active]:bg-dashboard-accent1 data-[state=active]:text-white"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger 
            value="completed"
            className="data-[state=active]:bg-dashboard-accent1 data-[state=active]:text-white"
          >
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
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
                  <TableHead className="text-dashboard-text">Actions</TableHead>
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
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-dashboard-card border-white/10">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Delete Payment Record</AlertDialogTitle>
                            <AlertDialogDescription className="text-dashboard-text">
                              Are you sure you want to delete this payment record? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(payment.id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
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
                  <TableHead className="text-dashboard-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments?.filter(payment => payment.status === 'pending')
                  .map((payment, index) => (
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
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-400 hover:text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-dashboard-card border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Delete Payment Record</AlertDialogTitle>
                              <AlertDialogDescription className="text-dashboard-text">
                                Are you sure you want to delete this payment record? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(payment.id)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
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
                  <TableHead className="text-dashboard-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments?.filter(payment => payment.status === 'approved')
                  .map((payment, index) => (
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
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-400 hover:text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-dashboard-card border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Delete Payment Record</AlertDialogTitle>
                              <AlertDialogDescription className="text-dashboard-text">
                                Are you sure you want to delete this payment record? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(payment.id)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default CollectorMemberPayments;
