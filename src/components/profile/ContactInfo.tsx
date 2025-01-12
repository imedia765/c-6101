import { Member } from "@/types/member";
import { format } from "date-fns";

interface ContactInfoProps {
  memberProfile: Member;
}

const ContactInfo = ({ memberProfile }: ContactInfoProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-dashboard-muted text-sm font-medium">Contact Information</h3>
      <div className="space-y-1">
        <p className="text-dashboard-text">
          {memberProfile.email || 'No email provided'}
        </p>
        <p className="text-dashboard-text">
          {memberProfile.phone || 'No phone provided'}
        </p>
        <p className="text-dashboard-text">
          DOB: {memberProfile.date_of_birth ? format(new Date(memberProfile.date_of_birth), 'dd/MM/yyyy') : 'Not provided'}
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;