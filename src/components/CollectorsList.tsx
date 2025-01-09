import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import { UserCheck, Users } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CollectorMembers from "@/components/CollectorMembers";
import PrintButtons from "@/components/PrintButtons";
import { useState } from 'react';
import PaginationControls from './ui/pagination/PaginationControls';

type MemberCollector = Database['public']['Tables']['members_collectors']['Row'];
type Member = Database['public']['Tables']['members']['Row'];

const ITEMS_PER_PAGE = 10;

const CollectorsList = () => {
  const [page, setPage] = useState(1);

  const { data: allMembers } = useQuery({
    queryKey: ['all_members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('member_number', { ascending: true });
      
      if (error) throw error;
      return data as Member[];
    },
  });

  const { data: paymentsData, isLoading: collectorsLoading, error: collectorsError } = useQuery({
    queryKey: ['members_collectors', page],
    queryFn: async () => {
      console.log('Fetching collectors from members_collectors...');
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // Get paginated collectors data with count
      const { data: collectorsData, error: collectorsError, count } = await supabase
        .from('members_collectors')
        .select(`
          id,
          name,
          prefix,
          number,
          email,
          phone,
          active,
          created_at,
          updated_at,
          member_number
        `, { count: 'exact' })
        .order('number', { ascending: true })
        .range(from, to);
      
      if (collectorsError) {
        console.error('Error fetching collectors:', collectorsError);
        throw collectorsError;
      }

      if (!collectorsData) return { data: [], count: 0 };

      const collectorsWithCounts = await Promise.all(collectorsData.map(async (collector) => {
        const { count } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('collector', collector.name);

        return {
          ...collector,
          memberCount: count || 0
        };
      }));

      return {
        data: collectorsWithCounts,
        count: count || 0
      };
    },
  });

  const collectors = paymentsData?.data || [];
  const totalPages = Math.ceil((paymentsData?.count || 0) / ITEMS_PER_PAGE);

  if (collectorsLoading) return <div className="text-center py-4">Loading collectors...</div>;
  if (collectorsError) return <div className="text-center py-4 text-red-500">Error loading collectors: {collectorsError.message}</div>;
  if (!collectors?.length) return <div className="text-center py-4">No collectors found</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <PrintButtons allMembers={allMembers} />
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {collectors.map((collector) => (          
          <AccordionItem
            key={collector.id}
            value={collector.id}
            className="bg-dashboard-card border border-white/10 rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-dashboard-accent1 flex items-center justify-center text-white font-medium">
                    {collector.prefix}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{collector.name}</p>
                      <span className="text-sm text-gray-400">#{collector.number}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-dashboard-text">
                      <UserCheck className="w-4 h-4" />
                      <span>Collector</span>
                      <span className="text-purple-400">({collector.memberCount} members)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PrintButtons collectorName={collector.name || ''} />
                  <div className={`px-3 py-1 rounded-full ${
                    collector.active 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {collector.active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 mt-2">
                {collector.memberCount > 0 ? (
                  <CollectorMembers collectorName={collector.name || ''} />
                ) : (
                  <p className="text-sm text-gray-400">No members assigned to this collector</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {totalPages > 1 && (
        <div className="py-4">
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default CollectorsList;