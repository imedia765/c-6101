import { Users } from "lucide-react";
import { Payment } from "./types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatDate } from "@/lib/dateFormat";

interface GroupedPayments {
  [key: string]: Payment[];
}

interface CollectorPaymentsListProps {
  payments: Payment[];
}

export const CollectorPaymentsList = ({ payments }: CollectorPaymentsListProps) => {
  const groupedPayments = payments.reduce((acc: GroupedPayments, payment) => {
    const memberName = payment.member_name || 'Unknown Member';
    if (!acc[memberName]) {
      acc[memberName] = [];
    }
    acc[memberName].push(payment);
    return acc;
  }, {});

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {Object.entries(groupedPayments).map(([memberName, memberPayments]) => (
        <AccordionItem
          key={memberName}
          value={memberName}
          className="border border-dashboard-highlight/20 rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-dashboard-accent1 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-dashboard-highlight">{memberName}</p>
                <span className="text-sm text-dashboard-warning">
                  {memberPayments.length} pending payment{memberPayments.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="rounded-md border border-dashboard-highlight/20">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-dashboard-highlight">Date</TableHead>
                    <TableHead className="text-dashboard-highlight">Type</TableHead>
                    <TableHead className="text-dashboard-highlight">Amount</TableHead>
                    <TableHead className="text-dashboard-highlight">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-dashboard-text">
                        {formatDate(payment.date)}
                      </TableCell>
                      <TableCell className="text-dashboard-text">{payment.type}</TableCell>
                      <TableCell className="text-dashboard-accent3">
                        <span className="text-dashboard-accent3">£</span>{payment.amount}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-dashboard-warning/20 text-dashboard-warning">
                          {payment.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};