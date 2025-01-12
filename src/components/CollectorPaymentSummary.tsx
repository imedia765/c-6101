import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Loader2, Receipt, CreditCard } from "lucide-react";
import { formatDate } from "@/lib/dateFormat";

interface PaymentSummaryProps {
  collectorName: string | null;
}

const CollectorPaymentSummary = ({ collectorName }: PaymentSummaryProps) => {
  const { data: paymentStats, isLoading } = useQuery({
    queryKey: ['collector-payments', collectorName],
    queryFn: async () => {
      if (!collectorName) return null;
      
      console.log('Fetching payment stats for collector:', collectorName);
      
      const { data: members, error } = await supabase
        .from('members')
        .select('yearly_payment_status, emergency_collection_status')
        .eq('collector', collectorName);
      
      if (error) {
        console.error('Error fetching payment stats:', error);
        throw error;
      }

      const stats = {
        totalMembers: members?.length || 0,
        yearlyPayments: {
          completed: members?.filter(m => m.yearly_payment_status === 'completed').length || 0,
          pending: members?.filter(m => m.yearly_payment_status === 'pending').length || 0,
        },
        emergencyCollections: {
          completed: members?.filter(m => m.emergency_collection_status === 'completed').length || 0,
          pending: members?.filter(m => m.emergency_collection_status === 'pending').length || 0,
        }
      };

      console.log('Payment stats:', stats);
      return stats;
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

  if (!paymentStats) return null;

  const yearlyPaymentPercentage = Math.round(
    (paymentStats.yearlyPayments.completed / paymentStats.totalMembers) * 100
  );

  const emergencyPaymentPercentage = Math.round(
    (paymentStats.emergencyCollections.completed / paymentStats.totalMembers) * 100
  );

  const totalYearlyAmount = paymentStats.totalMembers * 40;
  const collectedYearlyAmount = paymentStats.yearlyPayments.completed * 40;
  const remainingMembers = paymentStats.totalMembers - paymentStats.yearlyPayments.completed;

  return (
    <Card className="glass-card p-6 mt-8">
      <h3 className="text-xl font-medium text-white mb-6">Payment Collection Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-dashboard-accent1" />
            <h4 className="text-dashboard-accent1 font-medium">Yearly Payments</h4>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">
                £{collectedYearlyAmount} / £{totalYearlyAmount}
              </p>
              <p className="text-sm text-dashboard-muted">Amount collected</p>
              <p className="text-sm text-dashboard-warning font-medium mt-1">
                {remainingMembers} {remainingMembers === 1 ? 'member' : 'members'} remaining
              </p>
            </div>
            <div className="w-16 h-16">
              <CircularProgressbar
                value={yearlyPaymentPercentage}
                text={`${yearlyPaymentPercentage}%`}
                styles={buildStyles({
                  textSize: '1.5rem',
                  pathColor: '#4CAF50',
                  textColor: '#4CAF50',
                  trailColor: 'rgba(255,255,255,0.1)',
                })}
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="w-5 h-5 text-dashboard-accent2" />
            <h4 className="text-dashboard-accent2 font-medium">Emergency Collections</h4>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">
                {paymentStats.emergencyCollections.completed}/{paymentStats.totalMembers}
              </p>
              <p className="text-sm text-dashboard-muted">Members paid</p>
            </div>
            <div className="w-16 h-16">
              <CircularProgressbar
                value={emergencyPaymentPercentage}
                text={`${emergencyPaymentPercentage}%`}
                styles={buildStyles({
                  textSize: '1.5rem',
                  pathColor: '#FF9800',
                  textColor: '#FF9800',
                  trailColor: 'rgba(255,255,255,0.1)',
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CollectorPaymentSummary;
