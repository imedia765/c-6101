import { Card } from "@/components/ui/card";
import PaymentStatistics from './financials/PaymentStatistics';
import CollectorsSummary from './financials/CollectorsSummary';
import AllPaymentsTable from './financials/AllPaymentsTable';

const FinancialsView = () => {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2 text-white">Financial Management</h1>
        <p className="text-dashboard-text">View and manage payment requests</p>
      </header>

      <PaymentStatistics />
      <CollectorsSummary />
      <AllPaymentsTable />
    </div>
  );
};

export default FinancialsView;