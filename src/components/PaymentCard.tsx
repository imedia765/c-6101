import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { PaymentStatus } from "./financials/payment-card/PaymentStatus";
import { PaymentDueDate } from "./financials/payment-card/PaymentDueDate";

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
  lastEmergencyPaymentAmount
}: PaymentCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'January 1st, 2025';
    try {
      return format(new Date(dateString), 'MMMM do, yyyy');
    } catch (e) {
      return 'January 1st, 2025';
    }
  };

  return (
    <Card className="dashboard-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Annual Payment Section */}
        <div className="p-6 glass-card rounded-lg border border-dashboard-highlight/20 hover:border-dashboard-highlight/40 transition-colors">
          <h3 className="text-xl font-semibold text-dashboard-highlight mb-4">Annual Payment</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-dashboard-accent1">£40</p>
              <PaymentDueDate 
                dueDate={annualPaymentDueDate} 
                color="text-dashboard-highlight"
              />
              {lastAnnualPaymentDate && (
                <div className="mt-3">
                  <p className="text-sm text-dashboard-text font-medium">
                    Last payment: {formatDate(lastAnnualPaymentDate)}
                  </p>
                  {lastAnnualPaymentAmount && (
                    <p className="text-sm text-emerald-400 font-semibold">
                      Amount: £{lastAnnualPaymentAmount}
                    </p>
                  )}
                </div>
              )}
            </div>
            <PaymentStatus status={annualPaymentStatus} />
          </div>
        </div>

        {/* Emergency Collection Section */}
        <div className="p-6 glass-card rounded-lg border border-dashboard-highlight/20 hover:border-dashboard-highlight/40 transition-colors">
          <h3 className="text-xl font-semibold text-dashboard-highlight mb-4">Emergency Collection</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-dashboard-accent2">
                £{emergencyCollectionAmount}
              </p>
              <PaymentDueDate 
                dueDate={emergencyCollectionDueDate}
                color="text-dashboard-highlight"
              />
              {lastEmergencyPaymentDate && (
                <div className="mt-3">
                  <p className="text-sm text-dashboard-text font-medium">
                    Last payment: {formatDate(lastEmergencyPaymentDate)}
                  </p>
                  {lastEmergencyPaymentAmount && (
                    <p className="text-sm text-emerald-400 font-semibold">
                      Amount: £{lastEmergencyPaymentAmount}
                    </p>
                  )}
                </div>
              )}
            </div>
            <PaymentStatus status={emergencyCollectionStatus} />
          </div>
          <div className="text-sm text-dashboard-text font-medium">
            {emergencyCollectionStatus === 'completed' 
              ? 'Payment completed' 
              : (
                <div className="space-y-1">
                  <p>Payment {emergencyCollectionStatus}</p>
                  <p className="text-dashboard-muted">
                    {emergencyCollectionStatus === 'overdue'
                      ? 'Emergency collection payment is overdue'
                      : 'One-time emergency collection payment required'}
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PaymentCard;