import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const PaymentTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="border-white/10 hover:bg-white/5">
        <TableHead className="text-dashboard-text">Date</TableHead>
        <TableHead className="text-dashboard-text">Payment #</TableHead>
        <TableHead className="text-dashboard-text">Member Name</TableHead>
        <TableHead className="text-dashboard-text">Member #</TableHead>
        <TableHead className="text-dashboard-text">Contact</TableHead>
        <TableHead className="text-dashboard-text">Collector</TableHead>
        <TableHead className="text-dashboard-text">Collector Contact</TableHead>
        <TableHead className="text-dashboard-text">Type</TableHead>
        <TableHead className="text-dashboard-text">Amount</TableHead>
        <TableHead className="text-dashboard-text">Status</TableHead>
        <TableHead className="text-dashboard-text">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};