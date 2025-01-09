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
        const { data: payments } = await supabase
          .from('payment_requests')
          .select('*, members!payment_requests_member_id_fkey(full_name)')
          .eq('collector_id', collector.id);

        const pendingPayments = payments?.filter(p => p.status === 'pending') || [];
        const approvedPayments = payments?.filter(p => p.status === 'approved') || [];
        
        return {
          ...collector,
          totalPending: pendingPayments.length,
          totalApproved: approvedPayments.length,
          pendingAmount: pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0),
          approvedAmount: approvedPayments.reduce((sum, p) => sum + Number(p.amount), 0),
          payments: payments || []
        };
      }));

      return stats;
    }
  });

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
                <CollectorPayments payments={collector.payments} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Card>
  );
};

export default CollectorsSummary;