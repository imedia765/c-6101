import { Member } from "@/types/member";

interface ContactInfoProps {
  memberProfile: Member;
}

const ContactInfo = ({ memberProfile }: ContactInfoProps) => {
  return (
    <div className="space-y-2">
      <p className="text-dashboard-muted text-sm">Contact Information</p>
      <div className="space-y-1">
        <p className="text-dashboard-text">
          <span className="text-dashboard-accent2">Email:</span> {memberProfile?.email || 'Not provided'}
        </p>
        <p className="text-dashboard-text">
          <span className="text-dashboard-accent2">Phone:</span> {memberProfile?.phone || 'Not provided'}
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;