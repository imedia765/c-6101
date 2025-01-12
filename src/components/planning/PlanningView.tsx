import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { PlanningData } from '@/types/plan';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import CollectorPlanningSection from './CollectorPlanningSection';

const PlanningView = () => {
  const { data: planningData, isLoading } = useQuery({
    queryKey: ['planning-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select(`
          member_number,
          full_name,
          status,
          collector,
          yearly_payment_amount,
          yearly_payment_status,
          yearly_payment_due_date,
          emergency_collection_amount,
          emergency_collection_status,
          emergency_collection_due_date,
          payment_amount,
          payment_type,
          payment_date,
          members_collectors (
            name,
            phone
          )
        `)
        .eq('status', 'active')
        .order('yearly_payment_status', { ascending: true })
        .order('collector')
        .order('member_number');

      if (error) throw error;

      // Transform the data to match PlanningData interface
      const transformedData: PlanningData[] = data.map(member => ({
        member_number: member.member_number,
        full_name: member.full_name,
        status: member.status,
        collector: member.collector,
        yearly_payment_amount: member.yearly_payment_amount,
        yearly_payment_status: member.yearly_payment_status,
        yearly_payment_due_date: member.yearly_payment_due_date,
        emergency_collection_amount: member.emergency_collection_amount,
        emergency_collection_status: member.emergency_collection_status,
        emergency_collection_due_date: member.emergency_collection_due_date,
        payment_amount: member.payment_amount,
        payment_type: member.payment_type,
        payment_date: member.payment_date,
        collector_name: member.members_collectors?.[0]?.name || null,
        collector_phone: member.members_collectors?.[0]?.phone || null
      }));

      return transformedData;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group data by collector
  const groupedData = planningData?.reduce((acc, item) => {
    const collector = item.collector || 'Unassigned';
    if (!acc[collector]) {
      acc[collector] = [];
    }
    acc[collector].push(item);
    return acc;
  }, {} as Record<string, PlanningData[]>);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-medium mb-2 text-white">Collection Planning</h1>
        <p className="text-dashboard-muted">Organize and manage collection plans by collector</p>
      </header>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-6 p-1">
          {groupedData && Object.entries(groupedData).map(([collector, members]) => (
            <CollectorPlanningSection
              key={collector}
              collectorName={collector}
              members={members}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlanningView;