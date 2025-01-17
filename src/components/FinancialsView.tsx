import { Card } from "@/components/ui/card";
import PaymentStatistics from './financials/PaymentStatistics';
import CollectorsSummary from './financials/CollectorsSummary';
import AllPaymentsTable from './financials/AllPaymentsTable';
import { DashboardTabs, DashboardTabsList, DashboardTabsTrigger, DashboardTabsContent } from "@/components/ui/dashboard-tabs";

const FinancialsView = () => {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2 text-white">Financial Management</h1>
        <p className="text-dashboard-text">View and manage payment requests</p>
      </header>

      <DashboardTabs defaultValue="overview" className="w-full">
        <DashboardTabsList>
          <DashboardTabsTrigger value="overview">Payment Overview</DashboardTabsTrigger>
          <DashboardTabsTrigger value="collectors">Collectors Overview</DashboardTabsTrigger>
          <DashboardTabsTrigger value="payments">All Payments</DashboardTabsTrigger>
          <DashboardTabsTrigger value="stats">Member Stats</DashboardTabsTrigger>
        </DashboardTabsList>

        <DashboardTabsContent value="overview" className="mt-6">
          <PaymentStatistics />
        </DashboardTabsContent>

        <DashboardTabsContent value="collectors" className="mt-6">
          <CollectorsSummary />
        </DashboardTabsContent>

        <DashboardTabsContent value="payments" className="mt-6">
          <AllPaymentsTable />
        </DashboardTabsContent>

        <DashboardTabsContent value="stats" className="mt-6">
          <Card className="bg-dashboard-card border-dashboard-accent1/20 p-6">
            <h2 className="text-xl font-medium text-white mb-4">Member Payment Statistics</h2>
            <div className="text-dashboard-text">
              Member payment statistics and analytics will be displayed here.
            </div>
          </Card>
        </DashboardTabsContent>
      </DashboardTabs>
    </div>
  );
};

export default FinancialsView;