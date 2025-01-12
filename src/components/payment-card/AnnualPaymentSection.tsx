import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { CreditCard } from "lucide-react";
import { formatDate } from "@/lib/dateFormat";

interface AnnualPaymentSectionProps {
  yearlyPaymentPercentage: number;
  collectedYearlyAmount: number;
  totalYearlyAmount: number;
  remainingMembers: number;
  lastAnnualPaymentDate?: string;
  lastAnnualPaymentAmount?: number;
  annualPaymentDueDate?: string;
}

export const AnnualPaymentSection = ({
  yearlyPaymentPercentage,
  collectedYearlyAmount,
  totalYearlyAmount,
  remainingMembers,
  lastAnnualPaymentDate,
  lastAnnualPaymentAmount,
  annualPaymentDueDate
}: AnnualPaymentSectionProps) => {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-dashboard-accent1" />
        <h4 className="text-dashboard-accent1 font-medium">Yearly Payments</h4>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-white">
            £{collectedYearlyAmount} / £{totalYearlyAmount}
          </p>
          <p className="text-sm text-dashboard-muted">Amount collected</p>
          <p className="text-sm text-dashboard-warning font-medium mt-1">
            {remainingMembers} {remainingMembers === 1 ? 'member' : 'members'} remaining
          </p>
          {annualPaymentDueDate && (
            <p className="text-sm text-dashboard-muted mt-2">
              Due date: {formatDate(annualPaymentDueDate)}
            </p>
          )}
        </div>
        <div className="w-16 h-16">
          <CircularProgressbar
            value={yearlyPaymentPercentage}
            text={`${yearlyPaymentPercentage}%`}
            styles={buildStyles({
              textSize: '1.5rem',
              pathColor: '#4CAF50',
              textColor: '#4CAF50',
              trailColor: 'rgba(255,255,255,0.1)',
            })}
          />
        </div>
      </div>

      {lastAnnualPaymentDate && (
        <div className="mt-4 pt-4 border-t border-dashboard-cardBorder/30">
          <p className="text-sm font-medium mb-2 text-dashboard-text/90">
            Last payment details
          </p>
          <div className="space-y-1">
            <p className="text-sm text-dashboard-text/80">
              Date: {formatDate(lastAnnualPaymentDate)}
            </p>
            {lastAnnualPaymentAmount && (
              <p className="text-sm text-[#0EA5E9] font-medium">
                Amount paid: £{lastAnnualPaymentAmount}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};