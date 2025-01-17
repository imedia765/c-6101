import { Button } from "@/components/ui/button";
import { Member } from "@/types/member";
import { Download } from "lucide-react";

interface MembersListHeaderProps {
  userRole: string | null;
  hasMembers: boolean;
  collectorInfo: any;
  selectedMember: Member | undefined;
  onProfileUpdated: () => void;
  onPrint: () => void;
  members: Member[];
}

const MembersListHeader = ({
  userRole,
  hasMembers,
  members
}: MembersListHeaderProps) => {
  return (
    <header className="space-y-2 sm:space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium mb-1 sm:mb-2 text-white">Members</h1>
          <p className="text-dashboard-muted text-sm sm:text-base">View and manage member information</p>
        </div>
        
        {hasMembers && userRole === 'admin' && (
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto whitespace-nowrap bg-dashboard-accent1 hover:bg-dashboard-accent1/80 text-white border-dashboard-accent2"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Members
          </Button>
        )}
      </div>

      {members.length > 0 && (
        <div className="text-sm text-dashboard-muted">
          Showing {members.length} member{members.length !== 1 ? 's' : ''}
        </div>
      )}
    </header>
  );
};

export default MembersListHeader;