import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import CollectorPaymentSummary from './CollectorPaymentSummary';
import PaymentDialog from './members/PaymentDialog';
import EditProfileDialog from './members/EditProfileDialog';
import { Member } from "@/types/member";
import { useToast } from "@/components/ui/use-toast";
import MembersListHeader from './members/MembersListHeader';
import MembersListContent from './members/MembersListContent';

interface MembersListProps {
  searchTerm: string;
  userRole: string | null;
}

const ITEMS_PER_PAGE = 20;

const MembersList = ({ searchTerm, userRole }: MembersListProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const { data: collectorInfo } = useQuery({
    queryKey: ['collector-info'],
    queryFn: async () => {
      if (userRole !== 'collector') return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: collectorData } = await supabase
        .from('members_collectors')
        .select('name, phone')
        .eq('member_number', user.user_metadata.member_number)
        .single();

      return collectorData;
    },
    enabled: userRole === 'collector',
    staleTime: 5 * 60 * 1000,
  });

  const { data: membersData, isLoading, refetch } = useQuery({
    queryKey: ['members', searchTerm, userRole, page],
    queryFn: async () => {
      console.log('Fetching members with search term:', searchTerm);
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('members')
        .select('*', { count: 'exact' });
      
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,member_number.ilike.%${searchTerm}%,collector.ilike.%${searchTerm}%`);
      }

      if (userRole === 'collector') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: collectorData } = await supabase
            .from('members_collectors')
            .select('name')
            .eq('member_number', user.user_metadata.member_number)
            .single();

          if (collectorData?.name) {
            console.log('Filtering members for collector:', collectorData.name);
            query = query.eq('collector', collectorData.name);
          }
        }
      }
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }
      
      return {
        members: data as Member[],
        totalCount: count || 0
      };
    },
    staleTime: 30 * 1000,
  });

  const members = membersData?.members || [];
  const totalPages = Math.ceil((membersData?.totalCount || 0) / ITEMS_PER_PAGE);
  const selectedMember = members?.find(m => m.id === selectedMemberId);

  const handleProfileUpdated = () => {
    refetch();
    setSelectedMemberId(null);
    setIsEditProfileDialogOpen(false);
  };

  const handlePaymentClick = (memberId: string) => {
    setSelectedMemberId(memberId);
    setIsPaymentDialogOpen(true);
  };

  const handleEditClick = (memberId: string) => {
    setSelectedMemberId(memberId);
    setIsEditProfileDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <MembersListHeader 
        userRole={userRole}
        hasMembers={members.length > 0}
        collectorInfo={collectorInfo}
        selectedMember={selectedMember}
        onProfileUpdated={handleProfileUpdated}
        onPrint={() => {}}
        members={members}
      />

      <MembersListContent
        members={members}
        isLoading={isLoading}
        userRole={userRole}
        onPaymentClick={handlePaymentClick}
        onEditClick={handleEditClick}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {selectedMember && isPaymentDialogOpen && (
        <PaymentDialog
          isOpen={isPaymentDialogOpen}
          onClose={() => {
            setIsPaymentDialogOpen(false);
            setSelectedMemberId(null);
          }}
          memberId={selectedMember.id}
          memberNumber={selectedMember.member_number}
          memberName={selectedMember.full_name}
          collectorInfo={collectorInfo}
        />
      )}

      {selectedMember && isEditProfileDialogOpen && (
        <EditProfileDialog
          member={selectedMember}
          open={isEditProfileDialogOpen}
          onOpenChange={(open) => {
            setIsEditProfileDialogOpen(open);
            if (!open) setSelectedMemberId(null);
          }}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {userRole === 'collector' && collectorInfo && (
        <CollectorPaymentSummary collectorName={collectorInfo.name} />
      )}
    </div>
  );
};

export default MembersList;
