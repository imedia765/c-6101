import { Card } from "@/components/ui/card";
import { AnnualPaymentSection } from "./payment-card/AnnualPaymentSection";
import { EmergencyPaymentSection } from "./payment-card/EmergencyPaymentSection";

interface PaymentCardProps {
  annualPaymentStatus?: 'completed' | 'pending' | 'due' | 'overdue';
  emergencyCollectionStatus?: 'completed' | 'pending' | 'due' | 'overdue';
  emergencyCollectionAmount?: number;
  annualPaymentDueDate?: string;
  emergencyCollectionDueDate?: string;
  lastAnnualPaymentDate?: string;
  lastEmergencyPaymentDate?: string;
  lastAnnualPaymentAmount?: number;
  lastEmergencyPaymentAmount?: number;
  memberNumber?: string;
}

const PaymentCard = ({
  annualPaymentStatus = 'pending',
  emergencyCollectionStatus = 'pending',
  emergencyCollectionAmount = 0,
  annualPaymentDueDate,
  emergencyCollectionDueDate,
  lastAnnualPaymentDate,
  lastEmergencyPaymentDate,
  lastAnnualPaymentAmount,
  lastEmergencyPaymentAmount,
  memberNumber
}: PaymentCardProps) => {
  const yearlyPaymentPercentage = annualPaymentStatus === 'completed' ? 100 : 0;
  const emergencyPaymentPercentage = emergencyCollectionStatus === 'completed' ? 100 : 0;
  const totalYearlyAmount = 40;
  const collectedYearlyAmount = annualPaymentStatus === 'completed' ? 40 : 0;
  const remainingMembers = annualPaymentStatus === 'completed' ? 0 : 1;
  const totalMembers = 1;
  const emergencyCollectionsCompleted = emergencyCollectionStatus === 'completed' ? 1 : 0;

  return (
    <Card className="p-8 bg-dashboard-card border-dashboard-accent1/20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnnualPaymentSection
          yearlyPaymentPercentage={yearlyPaymentPercentage}
          collectedYearlyAmount={collectedYearlyAmount}
          totalYearlyAmount={totalYearlyAmount}
          remainingMembers={remainingMembers}
          lastAnnualPaymentDate={lastAnnualPaymentDate}
          lastAnnualPaymentAmount={lastAnnualPaymentAmount}
          annualPaymentDueDate={annualPaymentDueDate}
        />

        <EmergencyPaymentSection
          emergencyPaymentPercentage={emergencyPaymentPercentage}
          emergencyCollectionsCompleted={emergencyCollectionsCompleted}
          totalMembers={totalMembers}
          lastEmergencyPaymentDate={lastEmergencyPaymentDate}
          lastEmergencyPaymentAmount={lastEmergencyPaymentAmount}
          emergencyCollectionDueDate={emergencyCollectionDueDate}
        />
      </div>
    </Card>
  );
};

export default PaymentCard;