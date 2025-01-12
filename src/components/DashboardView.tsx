import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MemberProfileCard from './MemberProfileCard';
import SystemAnnouncements from './SystemAnnouncements';
import PaymentCard from './PaymentCard';
import PaymentHistoryTable from './PaymentHistoryTable';
import { Users, Wallet, AlertCircle } from 'lucide-react';

const DashboardView = () => {
  const { toast } = useToast();

  const { data: memberProfile, isError } = useQuery({
    queryKey: ['memberProfile'],
    queryFn: async () => {
      console.log('Fetching member profile...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No user logged in');

      const { data: { user } } = await supabase.auth.getUser();
      const memberNumber = user?.user_metadata?.member_number;
      
      if (!memberNumber) {
        console.error('No member number found in user metadata');
        throw new Error('Member number not found');
      }

      console.log('Fetching member with number:', memberNumber);
      
      let query = supabase
        .from('members')
        .select('*');
      
      query = query.or(`member_number.eq.${memberNumber},auth_user_id.eq.${session.user.id}`);
      
      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('Error fetching member:', error);
        toast({
          variant: "destructive",
          title: "Error fetching member profile",
          description: error.message
        });
        throw error;
      }

      if (!data) {
        console.error('No member found with number:', memberNumber);
        toast({
          variant: "destructive",
          title: "Member not found",
          description: "Could not find your member profile"
        });
        throw new Error('Member not found');
      }
      
      return data;
    },
  });

  // Query to fetch collection totals
  const { data: collectionTotals } = useQuery({
    queryKey: ['collectionTotals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('yearly_payment_status, emergency_collection_status, emergency_collection_amount');

      if (error) throw error;

      const totalMembers = data.length;
      const yearlyPending = data.filter(m => m.yearly_payment_status === 'pending').length;
      const emergencyPending = data.filter(m => m.emergency_collection_status === 'pending').length;
      const totalEmergencyAmount = data.reduce((sum, member) => sum + (member.emergency_collection_amount || 0), 0);
      const collectedEmergencyAmount = data
        .filter(m => m.emergency_collection_status === 'completed')
        .reduce((sum, member) => sum + (member.emergency_collection_amount || 0), 0);

      return {
        yearlyPending,
        emergencyPending,
        totalEmergencyAmount,
        collectedEmergencyAmount,
        totalYearlyAmount: totalMembers * 40, // £40 per member
        collectedYearlyAmount: (totalMembers - yearlyPending) * 40
      };
    }
  });

  const arePaymentsCompleted = memberProfile?.yearly_payment_status === 'completed' && 
    memberProfile?.emergency_collection_status === 'completed';

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2 text-white">Dashboard</h1>
        <p className="text-dashboard-text">Welcome back!</p>
      </header>
      
      <div className="grid gap-6">
        <MemberProfileCard memberProfile={memberProfile} />
        
        <PaymentCard 
          annualPaymentStatus={(memberProfile?.yearly_payment_status || 'pending') as 'completed' | 'pending'}
          emergencyCollectionStatus={(memberProfile?.emergency_collection_status || 'pending') as 'completed' | 'pending'}
          emergencyCollectionAmount={memberProfile?.emergency_collection_amount}
          annualPaymentDueDate={memberProfile?.yearly_payment_due_date}
          emergencyCollectionDueDate={memberProfile?.emergency_collection_due_date}
        />

        <SystemAnnouncements />

        <PaymentHistoryTable />
      </div>
    </>
  );
};

export default DashboardView;