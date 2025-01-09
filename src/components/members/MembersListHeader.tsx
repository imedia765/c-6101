import { Member } from "@/types/member";
import EditProfileDialog from "./EditProfileDialog";
import { useState } from "react";
import PrintButtons from "../PrintButtons";

interface MembersListHeaderProps {
  userRole: string | null;
  onPrint: () => void;
  hasMembers: boolean;
  collectorInfo?: { name: string } | null;
  selectedMember: Member | null;
  onProfileUpdated: () => void;
  members?: Member[];
}

const MembersListHeader = ({ 
  userRole, 
  hasMembers, 
  collectorInfo,
  selectedMember,
  onProfileUpdated,
  members = []
}: MembersListHeaderProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  if (!hasMembers) return null;

  return (
    <>
      <div className="flex w-full mb-4">
        <PrintButtons 
          allMembers={members}
          collectorName={collectorInfo?.name}
          onGenerateStart={() => console.log('Starting generation...')}
          onGenerateComplete={() => console.log('Generation complete')}
        />
      </div>

      {selectedMember && (
        <EditProfileDialog
          member={selectedMember}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onProfileUpdated={onProfileUpdated}
        />
      )}
    </>
  );
};

export default MembersListHeader;