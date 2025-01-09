import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TermsDialog = ({ open, onOpenChange }: TermsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-dashboard-card border border-dashboard-cardBorder">
        <DialogHeader>
          <DialogTitle className="text-dashboard-accent2 text-xl">PWA Collector Member Responsibilities</DialogTitle>
          <DialogDescription className="text-dashboard-muted">V1 April 2024</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p className="text-dashboard-text">
            A Collector member is a senior member of the PWA who is responsible for a specific number of paying
            members who are part of the death committee.
          </p>
          <p className="font-semibold text-dashboard-accent1">The Collector will be responsible for the following:</p>
          <ol className="list-decimal pl-6 space-y-2 text-dashboard-text">
            <li className="hover:text-dashboard-accent2 transition-colors">Act as the representative of the death committee for each member on their list.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Act as first point of contact for any enquiries from members or prospective members.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Register new members with the death committee.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Communicate announcements from death committee to members.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Collect member's fees whenever a collection is due.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Keep a record of all members' payments made in to PWA bank account, including date paid, reference
                used and bank account name. When consolidating collection with treasurer share record/evidence of
                online payments if requested.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Act as conduit between the members and death committee Senior Leadership Team (SLT) for any day-to-day issues.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Attending Collectors meetings with other members.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Provide guidance to new members and prospective members seeking membership with the PWA.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Feedback any issues or concerns to the PWA SLT.</li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog;