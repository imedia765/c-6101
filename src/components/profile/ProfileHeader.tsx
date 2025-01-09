import { CardHeader, CardTitle } from "@/components/ui/card";

const ProfileHeader = () => {
  return (
    <CardHeader className="border-b border-white/5 pb-6">
      <CardTitle className="text-white flex items-center gap-2">
        <span className="text-dashboard-accent1">Member Profile</span>
      </CardTitle>
    </CardHeader>
  );
};

export default ProfileHeader;