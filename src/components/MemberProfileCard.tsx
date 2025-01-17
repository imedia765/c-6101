import { Card, CardContent } from "@/components/ui/card";
import { Member } from "@/types/member";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileAvatar from "./profile/ProfileAvatar";
import ContactInfo from "./profile/ContactInfo";
import AddressDetails from "./profile/AddressDetails";
import MembershipDetails from "./profile/MembershipDetails";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditProfileDialog from "./members/EditProfileDialog";
import PaymentDialog from "./members/PaymentDialog";
import AddFamilyMemberDialog from "./members/AddFamilyMemberDialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProfileActions from "./members/profile/ProfileActions";
import DiagnosticsPanel from "./members/profile/DiagnosticsPanel";
import FamilyMembersSection from "./members/profile/FamilyMembersSection";

interface MemberProfileCardProps {
  memberProfile: Member | null;
}

const MemberProfileCard = ({ memberProfile }: MemberProfileCardProps) => {
  const { userRole } = useRoleAccess();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showAddFamilyDialog, setShowAddFamilyDialog] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const { data: collectorInfo } = useQuery({
    queryKey: ['collectorInfo', memberProfile?.collector],
    queryFn: async () => {
      if (!memberProfile?.collector) return null;
      
      const { data, error } = await supabase
        .from('members_collectors')
        .select('id, name, phone, prefix, number, email, active, created_at, updated_at')
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

  const { data: diagnostics } = useQuery({
    queryKey: ['memberDiagnostics', memberProfile?.id],
    queryFn: async () => {
      if (!memberProfile?.id) return null;
      
      const { data: roles } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', memberProfile.auth_user_id);

      const { data: payments } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('member_id', memberProfile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        roles: roles || [],
        recentPayments: payments || [],
        accountStatus: {
          isVerified: memberProfile.verified,
          hasAuthId: !!memberProfile.auth_user_id,
          membershipStatus: memberProfile.status,
          paymentStatus: memberProfile.yearly_payment_status,
        }
      };
    },
    enabled: !!memberProfile?.id && !!memberProfile?.auth_user_id
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
    <div className="space-y-4 sm:space-y-6">
      <Card className="bg-dashboard-card border-white/10 shadow-lg hover:border-dashboard-accent1/50 transition-all duration-300">
        <ProfileHeader />
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6">
            <ProfileAvatar memberProfile={memberProfile} />
            
            <div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <ContactInfo memberProfile={memberProfile} />
                  <AddressDetails memberProfile={memberProfile} />
                  <ProfileActions 
                    userRole={userRole}
                    onEditClick={() => setShowEditDialog(true)}
                    onPaymentClick={() => setShowPaymentDialog(true)}
                  />
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

          {userRole === 'admin' && (
            <div className="mt-6 border-t border-white/10 pt-4">
              <Button
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                variant="ghost"
                className="w-full justify-between text-dashboard-text hover:text-white"
              >
                User Diagnostics
                {showDiagnostics ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
              </Button>
              
              <DiagnosticsPanel 
                diagnostics={diagnostics}
                showDiagnostics={showDiagnostics}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <FamilyMembersSection 
        familyMembers={familyMembers || []}
        onAddFamilyMember={() => setShowAddFamilyDialog(true)}
      />

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