import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Member } from "@/types/member";

interface ProfileAvatarProps {
  memberProfile: Member;
}

const ProfileAvatar = ({ memberProfile }: ProfileAvatarProps) => {
  return (
    <div className="flex flex-col items-center space-y-3">
      <Avatar className="h-24 w-24 border-2 border-dashboard-accent1/20">
        <AvatarFallback className="bg-dashboard-accent1/20 text-2xl text-dashboard-accent1">
          {memberProfile?.full_name?.charAt(0) || '?'}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <h3 className="text-xl font-medium text-dashboard-softBlue mb-1">{memberProfile?.full_name}</h3>
        <p className="bg-dashboard-accent1/10 px-3 py-1 rounded-full">
          <span className="text-dashboard-accent1">Member #</span>
          <span className="text-dashboard-softBlue font-medium">{memberProfile?.member_number}</span>
        </p>
      </div>
    </div>
  );
};

export default ProfileAvatar;