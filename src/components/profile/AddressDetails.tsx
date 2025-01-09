import { Member } from "@/types/member";

interface AddressDetailsProps {
  memberProfile: Member;
}

const AddressDetails = ({ memberProfile }: AddressDetailsProps) => {
  return (
    <div className="space-y-2">
      <p className="text-dashboard-muted text-sm">Address Details</p>
      <div className="space-y-1 bg-white/5 p-3 rounded-lg">
        <p className="text-dashboard-text">
          {memberProfile?.address || 'No street address provided'}
        </p>
        <p className="text-dashboard-text">
          {memberProfile?.town ? `${memberProfile.town}` : 'No town provided'}
          {memberProfile?.postcode ? `, ${memberProfile.postcode}` : ''}
        </p>
      </div>
    </div>
  );
};

export default AddressDetails;