import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Receipt } from "lucide-react";
import { formatDate } from "@/lib/dateFormat";

interface EmergencyPaymentSectionProps {
  emergencyPaymentPercentage: number;
  emergencyCollectionsCompleted: number;
  totalMembers: number;
  lastEmergencyPaymentDate?: string;
  lastEmergencyPaymentAmount?: number;
  emergencyCollectionDueDate?: string;
}

export const EmergencyPaymentSection = ({
  emergencyPaymentPercentage,
  emergencyCollectionsCompleted,
  totalMembers,
  lastEmergencyPaymentDate,
  lastEmergencyPaymentAmount,
  emergencyCollectionDueDate
}: EmergencyPaymentSectionProps) => {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5 text-dashboard-accent2" />
        <h4 className="text-dashboard-accent2 font-medium">Emergency Collections</h4>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-white">
            {emergencyCollectionsCompleted}/{totalMembers}
          </p>
          <p className="text-sm text-dashboard-muted">Members paid</p>
          {emergencyCollectionDueDate && (
            <p className="text-sm text-dashboard-muted mt-2">
              Due date: {formatDate(emergencyCollectionDueDate)}
            </p>
          )}
        </div>
        <div className="w-16 h-16">
          <CircularProgressbar
            value={emergencyPaymentPercentage}
            text={`${emergencyPaymentPercentage}%`}
            styles={buildStyles({
              textSize: '1.5rem',
              pathColor: '#FF9800',
              textColor: '#FF9800',
              trailColor: 'rgba(255,255,255,0.1)',
            })}
          />
        </div>
      </div>

      {lastEmergencyPaymentDate && (
        <div className="mt-4 pt-4 border-t border-dashboard-cardBorder/30">
          <p className="text-sm font-medium mb-2 text-dashboard-text/90">
            Last payment details
          </p>
          <div className="space-y-1">
            <p className="text-sm text-dashboard-text/80">
              Date: {formatDate(lastEmergencyPaymentDate)}
            </p>
            {lastEmergencyPaymentAmount && (
              <p className="text-sm text-[#0EA5E9] font-medium">
                Amount paid: £{lastEmergencyPaymentAmount}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};