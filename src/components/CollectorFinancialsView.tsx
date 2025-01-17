import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { DashboardTabs, DashboardTabsContent, DashboardTabsList, DashboardTabsTrigger } from "@/components/ui/dashboard-tabs";
import PaymentStatistics from './financials/PaymentStatistics';
import CollectorsSummary from './financials/CollectorsSummary';
import AllPaymentsTable from './financials/AllPaymentsTable';
import CollectorsList from './CollectorsList';
import MemberStatsView from './members/MemberStatsView';
import { Card } from "@/components/ui/card";
import { Wallet, Users, Receipt, PoundSterling } from "lucide-react";
import TotalCount from './TotalCount';

const CollectorFinancialsView = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: totals } = useQuery({
    queryKey: ['financial-totals'],
    queryFn: async () => {
      console.log('Fetching financial totals');
      
      // Get all payments without pagination
      const { data: payments, error: paymentsError } = await supabase
        .from('payment_requests')
        .select('amount, status, payment_type');
      
      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
        throw paymentsError;
      }

      // Get all collectors without pagination
      const { data: collectors, error: collectorsError } = await supabase
        .from('members_collectors')
        .select('*')
        .eq('active', true);

      if (collectorsError) {
        console.error('Error fetching collectors:', collectorsError);
        throw collectorsError;
      }

      // Get all members without pagination for total calculations
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('yearly_payment_amount, emergency_collection_amount, yearly_payment_status, emergency_collection_status');

      if (membersError) {
        console.error('Error fetching members:', membersError);
        throw membersError;
      }

      // Calculate total amount collected from approved payments
      const totalAmount = payments?.reduce((sum, payment) => 
        payment.status === 'approved' ? sum + Number(payment.amount) : sum, 0
      ) || 0;

      // Calculate pending amount from pending payments
      const pendingAmount = payments?.reduce((sum, payment) => 
        payment.status === 'pending' ? sum + Number(payment.amount) : sum, 0
      ) || 0;

      // Calculate total yearly due (£40 per member)
      const totalYearlyDue = members?.reduce((sum, member) => 
        sum + (member.yearly_payment_amount || 40), 0
      ) || 0;

      // Calculate total emergency due
      const totalEmergencyDue = members?.reduce((sum, member) => 
        sum + (member.emergency_collection_amount || 0), 0
      ) || 0;

      // Calculate total collection due and remaining
      const totalCollectionDue = totalYearlyDue + totalEmergencyDue;
      const remainingCollection = totalCollectionDue - totalAmount;

      console.log('Calculated totals:', {
        totalCollected: totalAmount,
        pendingAmount,
        remainingAmount: remainingCollection,
        totalCollectors: collectors?.length || 0
      });

      return {
        totalCollected: totalAmount,
        pendingAmount: pendingAmount,
        remainingAmount: remainingCollection,
        totalCollectors: collectors?.length || 0,
        totalTransactions: payments?.length || 0
      };
    }
  });

  const handlePrint = () => {
    console.log('Print functionality triggered');
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <header className="mb-3 sm:mb-4 md:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-1 sm:mb-2 text-white">
          Financial & Collector Management
        </h1>
        <p className="text-xs sm:text-sm text-white/80">
          Manage payments and collector assignments
        </p>
      </header>

      {totals && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="glass-card p-2 sm:p-3 md:p-4">
            <TotalCount
              items={[{
                count: `£${totals.totalCollected.toLocaleString()}`,
                label: "Total Amount Collected",
                icon: <Wallet className="h-3.5 sm:h-4 md:h-5 w-3.5 sm:w-4 md:w-5 text-emerald-400" />,
                onPrint: handlePrint
              }]}
            />
          </div>
          
          <div className="glass-card p-2 sm:p-3 md:p-4">
            <TotalCount
              items={[{
                count: `£${totals.pendingAmount.toLocaleString()}`,
                label: "Pending Amount",
                icon: <Receipt className="h-3.5 sm:h-4 md:h-5 w-3.5 sm:w-4 md:w-5 text-amber-400" />,
                onPrint: handlePrint
              }]}
            />
          </div>
          
          <div className="glass-card p-2 sm:p-3 md:p-4">
            <TotalCount
              items={[{
                count: `£${totals.remainingAmount.toLocaleString()}`,
                label: "Remaining to Collect",
                icon: <PoundSterling className="h-3.5 sm:h-4 md:h-5 w-3.5 sm:w-4 md:w-5 text-rose-400" />,
                onPrint: handlePrint
              }]}
            />
          </div>
          
          <div className="glass-card p-2 sm:p-3 md:p-4">
            <TotalCount
              items={[{
                count: totals.totalCollectors,
                label: "Active Collectors",
                icon: <Users className="h-3.5 sm:h-4 md:h-5 w-3.5 sm:w-4 md:w-5 text-indigo-400" />,
                onPrint: handlePrint
              }]}
            />
          </div>
        </div>
      )}

      <Card className="glass-card">
        <DashboardTabs defaultValue="overview" className="p-2 sm:p-3 md:p-4" onValueChange={setActiveTab}>
          <DashboardTabsList className="grid w-full grid-cols-1 sm:grid-cols-4 gap-0">
            <DashboardTabsTrigger value="overview">
              Payment Overview
            </DashboardTabsTrigger>
            <DashboardTabsTrigger value="collectors">
              Collectors Overview
            </DashboardTabsTrigger>
            <DashboardTabsTrigger value="payments">
              All Payments
            </DashboardTabsTrigger>
            <DashboardTabsTrigger value="memberstats">
              Member Stats
            </DashboardTabsTrigger>
          </DashboardTabsList>

          <DashboardTabsContent value="overview" className="mt-4">
            <PaymentStatistics />
          </DashboardTabsContent>

          <DashboardTabsContent value="collectors" className="mt-4">
            <div className="space-y-4">
              <CollectorsList />
              <CollectorsSummary />
            </div>
          </DashboardTabsContent>

          <DashboardTabsContent value="payments" className="mt-4">
            <AllPaymentsTable showHistory={true} />
          </DashboardTabsContent>

          <DashboardTabsContent value="memberstats" className="mt-4">
            <MemberStatsView />
          </DashboardTabsContent>
        </DashboardTabs>
      </Card>
    </div>
  );
};

export default CollectorFinancialsView;
