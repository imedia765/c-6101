import { Member } from "@/types/member";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import CollectorMemberPayments from '../CollectorMemberPayments';
import MembersListContent from './MembersListContent';
import { DashboardTabs, DashboardTabsList, DashboardTabsTrigger, DashboardTabsContent } from "@/components/ui/dashboard-tabs";
import CollectorPaymentSummary from '@/components/CollectorPaymentSummary';

interface MembersListViewProps {
  searchTerm: string;
  userRole: string | null;
  collectorInfo: any;
}

const MembersListView = ({ searchTerm, userRole, collectorInfo }: MembersListViewProps) => {
  const [page, setPage] = useState(1);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 20;

  const { data: membersData, isLoading } = useQuery({
    queryKey: ['members', searchTerm, userRole, page],
    queryFn: async () => {
      console.log('Fetching members with search term:', searchTerm);
      
      // First get total count
      const countQuery = supabase
        .from('members')
        .select('*', { count: 'exact', head: true });
      
      if (searchTerm) {
        countQuery.or(`full_name.ilike.%${searchTerm}%,member_number.ilike.%${searchTerm}%,collector.ilike.%${searchTerm}%`);
      }

      if (userRole === 'collector' && collectorInfo?.name) {
        countQuery.eq('collector', collectorInfo.name);
      }
      
      const { count } = await countQuery;
      const totalCount = count || 0;
      
      // Calculate safe pagination values
      const maxPage = Math.ceil(totalCount / ITEMS_PER_PAGE);
      const safePage = Math.min(page, maxPage);
      const safeOffset = (safePage - 1) * ITEMS_PER_PAGE;
      
      // Fetch paginated data
      let query = supabase
        .from('members')
        .select('*');
      
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,member_number.ilike.%${searchTerm}%,collector.ilike.%${searchTerm}%`);
      }

      if (userRole === 'collector' && collectorInfo?.name) {
        query = query.eq('collector', collectorInfo.name);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(safeOffset, safeOffset + ITEMS_PER_PAGE - 1);
      
      if (error) throw error;
      
      return {
        members: data as Member[],
        totalCount,
        currentPage: safePage
      };
    },
  });

  const handlePaymentClick = (memberId: string) => {
    setSelectedMemberId(memberId);
  };

  const handleEditClick = (memberId: string) => {
    console.log('Edit clicked for member:', memberId);
  };

  // Update page state if we had to adjust it
  if (membersData?.currentPage && membersData.currentPage !== page) {
    setPage(membersData.currentPage);
  }

  return (
    <DashboardTabs defaultValue="members" className="w-full">
      <DashboardTabsList className="w-full grid grid-cols-1 sm:grid-cols-3 gap-0">
        {userRole === 'collector' && (
          <>
            <DashboardTabsTrigger value="summary">Summary</DashboardTabsTrigger>
            <DashboardTabsTrigger value="payments">Payments</DashboardTabsTrigger>
          </>
        )}
        <DashboardTabsTrigger value="members">Members List</DashboardTabsTrigger>
      </DashboardTabsList>

      {userRole === 'collector' && collectorInfo && (
        <>
          <DashboardTabsContent value="summary">
            <CollectorPaymentSummary collectorName={collectorInfo.name} />
          </DashboardTabsContent>

          <DashboardTabsContent value="payments">
            <CollectorMemberPayments collectorName={collectorInfo.name} />
          </DashboardTabsContent>
        </>
      )}

      <DashboardTabsContent value="members">
        <MembersListContent
          members={membersData?.members || []}
          isLoading={isLoading}
          userRole={userRole}
          currentPage={page}
          totalPages={Math.ceil((membersData?.totalCount || 0) / ITEMS_PER_PAGE)}
          onPageChange={setPage}
          onPaymentClick={handlePaymentClick}
          onEditClick={handleEditClick}
        />
      </DashboardTabsContent>
    </DashboardTabs>
  );
};

export default MembersListView;