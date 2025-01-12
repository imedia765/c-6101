import { Card, CardContent } from "@/components/ui/card";
import { Member } from "@/types/member";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileAvatar from "./profile/ProfileAvatar";
import ContactInfo from "./profile/ContactInfo";
import AddressDetails from "./profile/AddressDetails";
import MembershipDetails from "./profile/MembershipDetails";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Button } from "@/components/ui/button";
import { Edit, CreditCard, UserPlus } from "lucide-react";
import EditProfileDialog from "./members/EditProfileDialog";
import PaymentDialog from "./members/PaymentDialog";
import AddFamilyMemberDialog from "./members/AddFamilyMemberDialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FamilyMemberCard from "./members/FamilyMemberCard";

interface MemberProfileCardProps {
  memberProfile: Member | null;
}

const MemberProfileCard = ({ memberProfile }: MemberProfileCardProps) => {
  const { userRole } = useRoleAccess();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showAddFamilyDialog, setShowAddFamilyDialog] = useState(false);

  const { data: collectorInfo } = useQuery({
    queryKey: ['collectorInfo', memberProfile?.collector],
    queryFn: async () => {
      if (!memberProfile?.collector) return null;
      
      const { data, error } = await supabase
        .from('members_collectors')
        .select('name, phone')
        .eq('name', memberProfile.collector)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!memberProfile?.collector
  });

  const { data: familyMembers } = useQuery({
    queryKey: ['familyMembers', memberProfile?.id],
    queryFn: async () => {
      if (!memberProfile?.id) return [];
      
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('member_id', memberProfile.id);
        
      if (error) throw error;
      return data;
    },
    enabled: !!memberProfile?.id
  });

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
    window.location.reload();
  };

  return (
    <div className="space-y-6">
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
                  
                  <div className="flex flex-col gap-2">
                    {(userRole === 'collector' || userRole === 'admin' || userRole === 'member') && (
                      <Button
                        onClick={() => setShowEditDialog(true)}
                        className="w-full bg-dashboard-accent2 hover:bg-dashboard-accent2/80 text-white transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => setShowPaymentDialog(true)}
                      className="w-full bg-dashboard-accent1 hover:bg-dashboard-accent1/80 text-white transition-colors"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Make Payment
                    </Button>
                  </div>
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
      </Card>

      {/* Family Members Card */}
      <Card className="bg-dashboard-card border-white/10 shadow-lg hover:border-dashboard-accent1/50 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-dashboard-muted text-lg font-medium">Family Members</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddFamilyDialog(true)}
              className="bg-dashboard-accent2/10 hover:bg-dashboard-accent2/20 text-dashboard-accent2 border-dashboard-accent2/20 hover:border-dashboard-accent2/30"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Family Member
            </Button>
          </div>
          <div className="space-y-2">
            {familyMembers?.map((familyMember) => (
              <FamilyMemberCard
                key={familyMember.id}
                name={familyMember.full_name}
                relationship={familyMember.relationship}
                dob={familyMember.date_of_birth?.toString() || null}
                gender={familyMember.gender}
                memberNumber={familyMember.family_member_number}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <EditProfileDialog
        member={memberProfile}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onProfileUpdated={handleProfileUpdated}
      />

      {showPaymentDialog && (
        <PaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          memberId={memberProfile.id}
          memberNumber={memberProfile.member_number}
          memberName={memberProfile.full_name}
          collectorInfo={collectorInfo}
        />
      )}

      <AddFamilyMemberDialog
        member={memberProfile}
        open={showAddFamilyDialog}
        onOpenChange={setShowAddFamilyDialog}
        onFamilyMemberAdded={handleProfileUpdated}
      />
    </div>
  );
};

export default MemberProfileCard;