import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaymentDueDateProps {
  dueDate?: string;
  color: string;
}

export const PaymentDueDate = ({ dueDate, color }: PaymentDueDateProps) => {
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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-medium bg-dashboard-card border-dashboard-cardBorder hover:bg-dashboard-cardHover",
              !dueDate && "text-muted-foreground"
            )}
          >
            <span className={`${color} font-semibold`}>
              Due: {formatDate(dueDate)}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-dashboard-card border-dashboard-cardBorder" align="start">
          <Calendar
            mode="single"
            selected={dueDate ? new Date(dueDate) : undefined}
            disabled
            initialFocus
            className="bg-dashboard-card text-dashboard-text"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};