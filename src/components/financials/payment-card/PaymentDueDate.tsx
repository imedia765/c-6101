import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface PaymentDueDateProps {
  dueDate?: string;
  color: string;
  statusInfo?: {
    message: string;
    isOverdue: boolean;
    isGracePeriod?: boolean;
    isPaid?: boolean;
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

  const getStatusColor = () => {
    if (statusInfo?.isPaid) {
      return "text-dashboard-accent3"; // Green for paid
    }
    if (statusInfo?.isOverdue) {
      return "text-rose-400"; // Red for overdue
    }
    if (dueDate && new Date(dueDate).getTime() - new Date().getTime() <= 30 * 24 * 60 * 60 * 1000) {
      return "text-dashboard-accent1"; // Blue for approaching due date
    }
    return color;
  };

  const getStatusMessage = () => {
    if (statusInfo?.isPaid) {
      return "Paid ✓";
    }
    if (statusInfo?.isOverdue) {
      return "Payment Overdue!";
    }
    if (dueDate && new Date(dueDate).getTime() - new Date().getTime() <= 30 * 24 * 60 * 60 * 1000) {
      return `Due Soon: ${formatDate(dueDate)}`;
    }
    return `Due: ${formatDate(dueDate)}`;
  };

  return (
    <div className="mt-3">
      <div
        className={cn(
          "w-full px-4 py-2 text-left font-medium bg-dashboard-card border border-dashboard-cardBorder rounded",
          !dueDate && "text-muted-foreground",
          statusInfo?.isOverdue && (statusInfo.isGracePeriod ? "border-yellow-500/30" : "border-rose-500/30"),
          statusInfo?.isPaid && "border-dashboard-accent3/30"
        )}
      >
        <span className={cn(
          "font-semibold",
          getStatusColor()
        )}>
          {statusInfo?.message || getStatusMessage()}
        </span>
      </div>
    </div>
  );
};