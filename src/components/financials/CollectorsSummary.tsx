import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CollectorPayments from './CollectorPayments';
import { format, differenceInDays } from 'date-fns';

const CollectorsSummary = () => {
  const { data: collectorStats, isLoading } = useQuery({
    queryKey: ['collector-payment-stats'],
    queryFn: async () => {
      const { data: collectors } = await supabase
        .from('members_collectors')
        .select('*')
        .eq('active', true);

      if (!collectors) return [];

      const stats = await Promise.all(collectors.map(async (collector) => {
        // Get all members for this collector
        const { data: members } = await supabase
          .from('members')
          .select('*')
          .eq('collector', collector.name);

        const { data: payments } = await supabase
          .from('payment_requests')
          .select('*, members!payment_requests_member_id_fkey(full_name)')
          .eq('collector_id', collector.id);

        const pendingPayments = payments?.filter(p => p.status === 'pending') || [];
        const approvedPayments = payments?.filter(p => p.status === 'approved') || [];
        
        // Map member IDs with pending payments for quick lookup
        const membersWithPendingPayments = new Set(
          pendingPayments.map(p => p.member_id)
        );
        
        return {
          ...collector,
          members: members || [],
          totalPending: pendingPayments.length,
          totalApproved: approvedPayments.length,
          pendingAmount: pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0),
          approvedAmount: approvedPayments.reduce((sum, p) => sum + Number(p.amount), 0),
          payments: payments || [],
          membersWithPendingPayments
        };
      }));

      return stats;
    }
  });

  const getPaymentStatusColor = (member: any, membersWithPendingPayments: Set<string>) => {
    if (!member.yearly_payment_due_date) return 'bg-dashboard-card';
    
    const dueDate = new Date(member.yearly_payment_due_date);
    const today = new Date();
    const daysUntilDue = differenceInDays(dueDate, today);

    // Check if member has completed their payment
    if (member.yearly_payment_status === 'completed') {
      return 'bg-green-100/10 border-green-500/20 text-green-500';
    } 
    // Check if member has a pending payment in the payment_requests table
    else if (membersWithPendingPayments.has(member.id)) {
      return 'bg-orange-100/10 border-orange-500/20 text-orange-500';
    }
    // Check if payment is overdue
    else if (daysUntilDue < 0) {
      return 'bg-red-100/10 border-red-500/20 text-red-500';
    }
    // Payment is due within 30 days
    else if (daysUntilDue <= 30) {
      return 'bg-blue-100/10 border-blue-500/20 text-blue-500';
    }
    
    return 'bg-dashboard-card border-dashboard-accent1/20';
  };

  if (isLoading) return null;

  return (
    <Card className="bg-dashboard-card border-dashboard-accent1/20">
      <div className="p-6">
        <h2 className="text-xl font-medium text-white mb-4">Collectors Payment Summary</h2>
        <Accordion type="single" collapsible className="space-y-4">
          {collectorStats?.map((collector) => (
            <AccordionItem
              key={collector.id}
              value={collector.id}
              className="border border-white/10 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dashboard-accent1 flex items-center justify-center text-white font-medium">
                      {collector.prefix}
                    </div>
                    <div>
                      <p className="font-medium text-white">{collector.name}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-dashboard-warning">Pending: £{collector.pendingAmount}</span>
                        <span className="text-dashboard-accent3">Approved: £{collector.approvedAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {collector.members.map((member: any) => (
                      <div
                        key={member.id}
                        className={`p-4 rounded-lg border ${getPaymentStatusColor(member, collector.membersWithPendingPayments)}`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{member.full_name}</p>
                            <p className="text-sm opacity-80">Member #{member.member_number}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">
                              Due: {member.yearly_payment_due_date ? 
                                format(new Date(member.yearly_payment_due_date), 'PP') : 
                                'Not set'}
                            </p>
                            <p className="text-sm">
                              Amount: £{member.yearly_payment_amount || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <CollectorPayments payments={collector.payments} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Card>
  );
};

export default CollectorsSummary;