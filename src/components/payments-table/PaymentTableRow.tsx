import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, Trash2, X } from "lucide-react";
import { formatDate } from "@/lib/dateFormat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface PaymentTableRowProps {
  payment: any;
  onApprove: (paymentId: string) => void;
  onReject: (paymentId: string) => void;
  onDelete: (paymentId: string) => void;
}

export const PaymentTableRow = ({ payment, onApprove, onReject, onDelete }: PaymentTableRowProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(payment.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <TableRow className="border-white/10 hover:bg-white/5">
      <TableCell className="text-dashboard-text">
        {formatDate(payment.created_at)}
      </TableCell>
      <TableCell className="text-dashboard-accent2 font-mono">
        {payment.payment_number || '-'}
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
        <div className="flex gap-2">
          {payment.status === 'pending' && (
            <>
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
            </>
          )}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-400 hover:text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-dashboard-card border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete Payment Record</AlertDialogTitle>
                <AlertDialogDescription className="text-dashboard-text">
                  Are you sure you want to delete this payment record? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};