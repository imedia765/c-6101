import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { formatDate } from "@/lib/dateFormat";

interface PaymentTableRowProps {
  payment: any;
  onApprove: (paymentId: string) => void;
  onReject: (paymentId: string) => void;
}

export const PaymentTableRow = ({ payment, onApprove, onReject }: PaymentTableRowProps) => {
  return (
    <TableRow className="border-white/10 hover:bg-white/5">
      <TableCell className="text-dashboard-text">
        {formatDate(payment.created_at)}
      </TableCell>
      <TableCell className="text-white font-medium">
        {payment.members?.full_name}
      </TableCell>
      <TableCell className="text-dashboard-text">
        {payment.members?.member_number}
      </TableCell>
      <TableCell className="text-dashboard-text">
        <div className="flex flex-col">
          <span>{payment.members?.phone}</span>
          <span className="text-sm text-gray-400">{payment.members?.email}</span>
        </div>
      </TableCell>
      <TableCell className="text-dashboard-accent1">
        {payment.collectors?.name}
      </TableCell>
      <TableCell className="text-dashboard-text">
        <div className="flex flex-col">
          <span>{payment.collectors?.phone}</span>
          <span className="text-sm text-gray-400">{payment.collectors?.email}</span>
        </div>
      </TableCell>
      <TableCell className="capitalize text-dashboard-text">
        {payment.payment_type}
      </TableCell>
      <TableCell className="text-dashboard-accent3">
        £{payment.amount}
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${payment.status === 'approved' ? 'bg-dashboard-accent3/20 text-dashboard-accent3' : 
            payment.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 
            'bg-dashboard-warning/20 text-dashboard-warning'}`}>
          {payment.status}
        </span>
      </TableCell>
      <TableCell>
        {payment.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-dashboard-accent3 hover:text-dashboard-accent3 hover:bg-dashboard-accent3/20"
              onClick={() => onApprove(payment.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-red-400 hover:text-red-400 hover:bg-red-500/20"
              onClick={() => onReject(payment.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};