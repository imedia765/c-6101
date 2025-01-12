import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface PaymentDueDateProps {
  dueDate?: string;
  color: string;
  statusInfo?: {
    message: string;
    isOverdue: boolean;
    isGracePeriod?: boolean;
  };
}

export const PaymentDueDate = ({ dueDate, color, statusInfo }: PaymentDueDateProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'January 1st, 2025';
    try {
      return format(new Date(dateString), 'MMMM do, yyyy');
    } catch (e) {
      return 'January 1st, 2025';
    }
  };

  return (
    <div className="mt-3">
      <div
        className={cn(
          "w-full px-4 py-2 text-left font-medium bg-dashboard-card border border-dashboard-cardBorder rounded",
          !dueDate && "text-muted-foreground",
          statusInfo?.isOverdue && (statusInfo.isGracePeriod ? "border-yellow-500/30" : "border-rose-500/30")
        )}
      >
        <span className={cn(
          color,
          "font-semibold",
          statusInfo?.isOverdue && (
            statusInfo.isGracePeriod 
              ? "text-yellow-400" 
              : "text-rose-400"
          )
        )}>
          {statusInfo?.message || `Due: ${formatDate(dueDate)}`}
        </span>
      </div>
    </div>
  );
};