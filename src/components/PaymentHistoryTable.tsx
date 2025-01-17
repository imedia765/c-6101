import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Payment } from "./payment-history/types";
import { CollectorPaymentsList } from "./payment-history/CollectorPaymentsList";
import { MemberPaymentsList } from "./payment-history/MemberPaymentsList";

const PaymentHistoryTable = () => {
  const { toast } = useToast();

  const { data: userRole } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found in role check');
        return null;
      }

      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      console.log('User role data:', roleData);
      return roleData?.role;
    },
  });

  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ['payment-history', userRole],
    queryFn: async () => {
      console.log('Starting payment history fetch...');
      console.log('User role:', userRole);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to get session');
      }
      
      if (!session?.user) {
        console.error('No user session found');
        throw new Error('No user logged in');
      }

      const memberNumber = session.user.user_metadata.member_number;
      
      if (!memberNumber) {
        console.error('No member number found in user metadata');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Member number not found in user profile",
        });
        throw new Error('Member number not found');
      }

      if (userRole === 'collector') {
        console.log('Fetching collector payments for member number:', memberNumber);
        
        const { data: collectorData, error: collectorError } = await supabase
          .from('members_collectors')
          .select('id')
          .eq('member_number', memberNumber)
          .maybeSingle();

        if (collectorError) {
          console.error('Error fetching collector:', collectorError);
          throw collectorError;
        }

        if (!collectorData) {
          console.error('No collector found for member number:', memberNumber);
          return [];
        }

        console.log('Found collector:', collectorData);

        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payment_requests')
          .select(`
            *,
            members!payment_requests_member_id_fkey (
              full_name,
              member_number
            )
          `)
          .eq('collector_id', collectorData.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (paymentsError) {
          console.error('Error fetching payments:', paymentsError);
          throw paymentsError;
        }

        console.log('Collector payments:', paymentsData);
        
        return paymentsData?.map(payment => ({
          id: payment.id,
          date: payment.created_at,
          type: payment.payment_type,
          amount: payment.amount,
          status: payment.status,
          member_name: payment.members?.full_name,
          member_number: payment.members?.member_number,
          payment_number: payment.payment_number
        })) || [];
      }
      
      console.log('Fetching member payments for:', memberNumber);
      const { data, error: paymentsError } = await supabase
        .from('payment_requests')
        .select(`
          *,
          members!payment_requests_member_id_fkey (
            full_name,
            member_number
          )
        `)
        .eq('member_number', memberNumber)
        .order('created_at', { ascending: false });

      if (paymentsError) {
        console.error('Error fetching payment requests:', paymentsError);
        throw paymentsError;
      }

      console.log('Member payments:', data);
      return data?.map(payment => ({
        id: payment.id,
        date: payment.created_at,
        type: payment.payment_type,
        amount: payment.amount,
        status: payment.status,
        member_name: payment.members?.full_name,
        member_number: payment.members?.member_number,
        payment_number: payment.payment_number
      })) || [];
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="glass-card p-4">
        <h3 className="text-xl font-semibold mb-4 text-dashboard-highlight">Payment History</h3>
        <div className="flex items-center gap-2 text-dashboard-highlight">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading payment history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-4">
        <h3 className="text-xl font-semibold mb-4 text-dashboard-highlight">Payment History</h3>
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>Error loading payment history: {error.message}</span>
        </div>
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className="glass-card p-4">
        <h3 className="text-xl font-semibold mb-4 text-dashboard-highlight">Payment History</h3>
        <div className="flex items-center gap-2 text-dashboard-highlight">
          <AlertCircle className="h-4 w-4" />
          <span>No payment history found. Please check if you have any pending payments or contact your collector for assistance.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <h3 className="text-xl font-semibold mb-4 text-dashboard-highlight">
        {userRole === 'collector' ? 'Pending Payments - Members' : 'Payment History'}
      </h3>
      
      {userRole === 'collector' ? (
        <CollectorPaymentsList payments={payments} />
      ) : (
        <MemberPaymentsList payments={payments} />
      )}
    </div>
  );
};

export default PaymentHistoryTable;
