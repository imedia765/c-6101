import { Member } from '@/types/member';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Edit } from "lucide-react";

interface MemberCardProps {
  member: Member;
  userRole: string | null;
  onPaymentClick: () => void;
  onEditClick: () => void;
}

const MemberCard = ({ member, userRole, onPaymentClick, onEditClick }: MemberCardProps) => {
  return (
    <AccordionItem 
      key={member.id} 
      value={member.id}
      className="bg-dashboard-card border-white/10 shadow-lg hover:border-dashboard-accent1/50 transition-all duration-300 p-6 rounded-lg border"
    >
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-6 w-full">
          <Avatar className="h-16 w-16 border-2 border-dashboard-accent1/20">
            <AvatarFallback className="bg-dashboard-accent1/20 text-lg text-dashboard-accent1">
              {member.full_name?.charAt(0) || 'M'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex justify-between items-center w-full">
            <div>
              <h3 className="text-xl font-medium text-dashboard-accent2 mb-1">{member.full_name}</h3>
              <p className="bg-dashboard-accent1/10 px-3 py-1 rounded-full inline-flex items-center">
                <span className="text-dashboard-accent1">Member #</span>
                <span className="text-dashboard-accent2 font-medium ml-1">{member.member_number}</span>
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${
              member.status === 'active' 
                ? 'bg-dashboard-accent3/20 text-dashboard-accent3' 
                : 'bg-dashboard-muted/20 text-dashboard-muted'
            }`}>
              {member.status || 'Pending'}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-dashboard-muted mb-1">Contact Information</p>
            <p className="text-dashboard-text">{member.email || 'No email provided'}</p>
            <p className="text-dashboard-text">{member.phone || 'No phone provided'}</p>
          </div>
          <div>
            <p className="text-dashboard-muted mb-1">Address</p>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-dashboard-text">
                {member.address || 'No address provided'}
                {member.town && `, ${member.town}`}
                {member.postcode && ` ${member.postcode}`}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-dashboard-muted mb-1">Membership Type</p>
              <p className="text-dashboard-text">{member.membership_type || 'Standard'}</p>
            </div>
            <div>
              <p className="text-dashboard-muted mb-1">Collector</p>
              <p className="text-dashboard-text">{member.collector || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-dashboard-muted mb-1">Status</p>
              <p className="text-dashboard-text">{member.status || 'Pending'}</p>
            </div>
          </div>
        </div>
          
        {userRole === 'collector' && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={onPaymentClick}
                className="w-full bg-dashboard-accent1 hover:bg-dashboard-accent1/80 text-white transition-colors"
              >
                Record Payment
              </Button>
              <Button
                onClick={onEditClick}
                className="w-full bg-dashboard-accent2 hover:bg-dashboard-accent2/80 text-white transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default MemberCard;
