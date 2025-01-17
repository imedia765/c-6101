import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import FamilyMemberCard from "../FamilyMemberCard";

interface FamilyMembersSectionProps {
  familyMembers: any[];
  onAddFamilyMember: () => void;
}

const FamilyMembersSection = ({ familyMembers, onAddFamilyMember }: FamilyMembersSectionProps) => {
  return (
    <Card className="bg-dashboard-card border-white/10 shadow-lg hover:border-dashboard-accent1/50 transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h3 className="text-dashboard-muted text-lg font-medium">Family Members</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddFamilyMember}
            className="bg-dashboard-accent2/10 hover:bg-dashboard-accent2/20 text-dashboard-accent2 border-dashboard-accent2/20 hover:border-dashboard-accent2/30"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Family Member
          </Button>
        </div>
        <div className="space-y-2 overflow-x-auto">
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
  );
};

export default FamilyMembersSection;