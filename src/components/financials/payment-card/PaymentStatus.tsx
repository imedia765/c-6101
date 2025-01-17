import { Check, Clock, AlertOctagon } from "lucide-react";

interface PaymentStatusProps {
  status: string;
  icon?: React.ReactNode;
}

export const PaymentStatus = ({ status, icon }: PaymentStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'overdue':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 mr-1" />;
      case 'pending':
        return <Clock className="w-4 h-4 mr-1" />;
      case 'overdue':
        return <AlertOctagon className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm ${getStatusColor(status)}`}>
        {icon || getStatusIcon(status)}
        {status}
      </span>
    </div>
  );
};