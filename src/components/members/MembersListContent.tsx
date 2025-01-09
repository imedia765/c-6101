import { Member } from "@/types/member";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion } from "@/components/ui/accordion";
import MemberCard from './MemberCard';
import PaginationControls from '../ui/pagination/PaginationControls';
import { Loader2 } from "lucide-react";

interface MembersListContentProps {
  members: Member[];
  isLoading: boolean;
  userRole: string | null;
  onPaymentClick: (memberId: string) => void;
  onEditClick: (memberId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MembersListContent = ({
  members,
  isLoading,
  userRole,
  onPaymentClick,
  onEditClick,
  currentPage,
  totalPages,
  onPageChange,
}: MembersListContentProps) => {
  return (
    <div className="space-y-4">
      <ScrollArea className="h-[600px] w-full rounded-md">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-dashboard-accent1" />
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                userRole={userRole}
                onPaymentClick={() => onPaymentClick(member.id)}
                onEditClick={() => onEditClick(member.id)}
              />
            ))}
          </Accordion>
        )}
      </ScrollArea>
      
      {!isLoading && members.length > 0 && totalPages > 1 && (
        <div className="py-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default MembersListContent;