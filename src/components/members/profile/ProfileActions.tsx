import { Button } from "@/components/ui/button";
import { Edit, CreditCard } from "lucide-react";

interface ProfileActionsProps {
  userRole: string;
  onEditClick: () => void;
  onPaymentClick: () => void;
}

const ProfileActions = ({ userRole, onEditClick, onPaymentClick }: ProfileActionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      {(userRole === 'collector' || userRole === 'admin' || userRole === 'member') && (
        <Button
          onClick={onEditClick}
          className="w-full bg-dashboard-accent2 hover:bg-dashboard-accent2/80 text-white transition-colors"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      )}
      
      <Button
        onClick={onPaymentClick}
        className="w-full bg-dashboard-accent1 hover:bg-dashboard-accent1/80 text-white transition-colors"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Make Payment
      </Button>
    </div>
  );
};

export default ProfileActions;