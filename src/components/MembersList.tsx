import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import MembersListFilters from "./members/list/MembersListFilters";
import MembersListView from "./members/list/MembersListView";

interface MembersListProps {
  searchTerm: string;
  userRole: string | null;
}

const MembersList = ({ searchTerm: initialSearchTerm, userRole }: MembersListProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const { data: collectorInfo } = useQuery({
    queryKey: ['collector-info'],
    queryFn: async () => {
      if (userRole !== 'collector') return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: collectorData } = await supabase
        .from('members_collectors')
        .select('id, name, phone, prefix, number, email, active, created_at, updated_at')
        .eq('member_number', user.user_metadata.member_number)
        .single();

      return collectorData;
    },
    enabled: userRole === 'collector',
  });

  return (
    <div className="w-full px-2 sm:px-0 space-y-4 sm:space-y-6">
      <MembersListFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <MembersListView
        searchTerm={searchTerm}
        userRole={userRole}
        collectorInfo={collectorInfo}
      />
    </div>
  );
};

export default MembersList;