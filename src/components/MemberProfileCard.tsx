import { Card, CardContent } from "@/components/ui/card";
import { Member } from "@/types/member";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileAvatar from "./profile/ProfileAvatar";
import ContactInfo from "./profile/ContactInfo";
import AddressDetails from "./profile/AddressDetails";
import MembershipDetails from "./profile/MembershipDetails";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import EditProfileDialog from "./members/EditProfileDialog";
import { useState } from "react";

interface MemberProfileCardProps {
  memberProfile: Member | null;
}

const MemberProfileCard = ({ memberProfile }: MemberProfileCardProps) => {
  const { userRole } = useRoleAccess();
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (!memberProfile) {
    return (
      <Card className="bg-dashboard-card border-white/10 shadow-lg">
        <ProfileHeader />
        <CardContent>
          <p className="text-dashboard-text">
            Your profile has not been set up yet. Please contact an administrator.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleProfileUpdated = () => {
    // Trigger a refresh of the profile data
    window.location.reload();
  };

  return (
    <Card className="bg-dashboard-card border-white/10 shadow-lg hover:border-dashboard-accent1/50 transition-all duration-300">
      <ProfileHeader />
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <ProfileAvatar memberProfile={memberProfile} />
          
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ContactInfo memberProfile={memberProfile} />
                <AddressDetails memberProfile={memberProfile} />
                
                {/* Modified condition to show edit button */}
                {(userRole === 'collector' || userRole === 'admin' || userRole === 'member') && (
                  <Button
                    onClick={() => setShowEditDialog(true)}
                    className="w-full bg-dashboard-accent2 hover:bg-dashboard-accent2/80 text-white transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <MembershipDetails 
                  memberProfile={memberProfile}
                  userRole={userRole}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <EditProfileDialog
        member={memberProfile}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onProfileUpdated={handleProfileUpdated}
      />
    </Card>
  );
};

export default MemberProfileCard;