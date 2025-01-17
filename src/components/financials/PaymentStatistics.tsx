import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import TotalCount from "@/components/TotalCount";
import { Users, Wallet, Receipt, PoundSterling, Clock, CheckCircle2, AlertTriangle, Ban, CreditCard, Banknote } from "lucide-react";

const PaymentStatistics = () => {
  const { data: stats } = useQuery({
    queryKey: ['payment-statistics'],
    queryFn: async () => {
      console.log('Fetching payment statistics...');
      
      // Fetch total count first
      const { count: totalMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });

      // Then fetch payment statuses and details
      const { data: members, error } = await supabase
        .from('members')
        .select('yearly_payment_status, emergency_collection_status, emergency_collection_amount, yearly_payment_amount');

      if (error) throw error;

      // Fetch payment methods distribution
      const { data: paymentRequests, error: paymentError } = await supabase
        .from('payment_requests')
        .select('payment_method, status, amount, payment_type');

      if (paymentError) throw paymentError;

      const yearlyPaid = members?.filter(m => m.yearly_payment_status === 'completed').length || 0;
      const yearlyUnpaid = (totalMembers || 0) - yearlyPaid;
      const emergencyPaid = members?.filter(m => m.emergency_collection_status === 'completed').length || 0;
      const emergencyUnpaid = (totalMembers || 0) - emergencyPaid;
      
      // Calculate payment method statistics
      const bankTransfers = paymentRequests?.filter(p => p.payment_method === 'bank_transfer').length || 0;
      const cashPayments = paymentRequests?.filter(p => p.payment_method === 'cash').length || 0;
      
      // Calculate status-based statistics
      const pendingPayments = paymentRequests?.filter(p => p.status === 'pending').length || 0;
      const approvedPayments = paymentRequests?.filter(p => p.status === 'approved').length || 0;
      const rejectedPayments = paymentRequests?.filter(p => p.status === 'rejected').length || 0;

      // Calculate totals
      const totalYearlyAmount = (totalMembers || 0) * 40; // £40 per member
      const collectedYearlyAmount = yearlyPaid * 40;
      const remainingYearlyAmount = yearlyUnpaid * 40;
      
      const totalEmergencyAmount = members?.reduce((sum, m) => sum + (m.emergency_collection_amount || 0), 0) || 0;
      const collectedEmergencyAmount = members
        ?.filter(m => m.emergency_collection_status === 'completed')
        .reduce((sum, m) => sum + (m.emergency_collection_amount || 0), 0) || 0;
      const remainingEmergencyAmount = totalEmergencyAmount - collectedEmergencyAmount;

      // Calculate average payment amounts
      const averagePaymentAmount = paymentRequests?.length 
        ? paymentRequests.reduce((sum, p) => sum + Number(p.amount), 0) / paymentRequests.length 
        : 0;

      console.log('Payment statistics calculated:', {
        yearlyStats: { yearlyPaid, yearlyUnpaid },
        emergencyStats: { emergencyPaid, emergencyUnpaid },
        paymentMethods: { bankTransfers, cashPayments },
        statuses: { pendingPayments, approvedPayments, rejectedPayments }
      });

      return {
        yearlyStats: {
          totalAmount: totalYearlyAmount,
          collectedAmount: collectedYearlyAmount,
          remainingAmount: remainingYearlyAmount,
          paidMembers: yearlyPaid,
          unpaidMembers: yearlyUnpaid
        },
        emergencyStats: {
          totalAmount: totalEmergencyAmount,
          collectedAmount: collectedEmergencyAmount,
          remainingAmount: remainingEmergencyAmount,
          paidMembers: emergencyPaid,
          unpaidMembers: emergencyUnpaid
        },
        paymentMethods: {
          bankTransfers,
          cashPayments,
          totalTransactions: (bankTransfers + cashPayments)
        },
        paymentStatuses: {
          pending: pendingPayments,
          approved: approvedPayments,
          rejected: rejectedPayments
        },
        averages: {
          averagePaymentAmount
        },
        totalMembers
      };
    }
  });

  if (!stats) return null;

  return (
    <Card className="bg-dashboard-card p-6 mt-8 border border-white/10">
      <h3 className="text-xl font-medium text-white mb-6">Payment Statistics</h3>
      
      <div className="space-y-8">
        {/* Yearly Collections Section */}
        <div>
          <h4 className="text-lg text-white/80 mb-4">Yearly Collections</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <TotalCount 
              items={[{
                count: `£${stats.yearlyStats.collectedAmount.toLocaleString()}`,
                label: "Yearly Collections Received",
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              }]}
            />
            <TotalCount 
              items={[{
                count: `£${stats.yearlyStats.remainingAmount.toLocaleString()}`,
                label: "Yearly Collections Pending",
                icon: <Clock className="w-5 h-5 text-amber-400" />
              }]}
            />
            <TotalCount 
              items={[{
                count: stats.yearlyStats.paidMembers,
                label: `Members Paid (${((stats.yearlyStats.paidMembers / stats.totalMembers) * 100).toFixed(1)}%)`,
                icon: <Users className="w-5 h-5 text-indigo-400" />
              }]}
            />
          </div>
        </div>

        {/* Emergency Collections Section */}
        <div>
          <h4 className="text-lg text-white/80 mb-4">Emergency Collections</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <TotalCount 
              items={[{
                count: `£${stats.emergencyStats.collectedAmount.toLocaleString()}`,
                label: "Emergency Collections Received",
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              }]}
            />
            <TotalCount 
              items={[{
                count: `£${stats.emergencyStats.remainingAmount.toLocaleString()}`,
                label: "Emergency Collections Pending",
                icon: <Clock className="w-5 h-5 text-amber-400" />
              }]}
            />
            <TotalCount 
              items={[{
                count: stats.emergencyStats.paidMembers,
                label: `Members Paid (${((stats.emergencyStats.paidMembers / stats.totalMembers) * 100).toFixed(1)}%)`,
                icon: <Users className="w-5 h-5 text-indigo-400" />
              }]}
            />
          </div>
        </div>

        {/* Payment Methods Section */}
        <div>
          <h4 className="text-lg text-white/80 mb-4">Payment Methods</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <TotalCount 
              items={[{
                count: stats.paymentMethods.bankTransfers,
                label: "Bank Transfers",
                icon: <CreditCard className="w-5 h-5 text-blue-400" />
              }]}
            />
            <TotalCount 
              items={[{
                count: stats.paymentMethods.cashPayments,
                label: "Cash Payments",
                icon: <Banknote className="w-5 h-5 text-green-400" />
              }]}
            />
            <TotalCount 
              items={[{
                count: `£${stats.averages.averagePaymentAmount.toFixed(2)}`,
                label: "Average Payment Amount",
                icon: <PoundSterling className="w-5 h-5 text-purple-400" />
              }]}
            />
          </div>
        </div>

        {/* Payment Status Section */}
        <div>
          <h4 className="text-lg text-white/80 mb-4">Payment Status Overview</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <TotalCount 
              items={[{
                count: stats.paymentStatuses.pending,
                label: "Pending Payments",
                icon: <Clock className="w-5 h-5 text-yellow-400" />
              }]}
            />
            <TotalCount 
              items={[{
                count: stats.paymentStatuses.approved,
                label: "Approved Payments",
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              }]}
            />
            <TotalCount 
              items={[{
                count: stats.paymentStatuses.rejected,
                label: "Rejected Payments",
                icon: <Ban className="w-5 h-5 text-red-400" />
              }]}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PaymentStatistics;