import { ScrollArea } from "@/components/ui/scroll-area";

interface DiagnosticsPanelProps {
  diagnostics: any;
  showDiagnostics: boolean;
}

const DiagnosticsPanel = ({ diagnostics, showDiagnostics }: DiagnosticsPanelProps) => {
  if (!showDiagnostics || !diagnostics) return null;

  return (
    <ScrollArea className="h-[300px] mt-4 rounded-md border border-white/10 p-4">
      <div className="space-y-4">
        <div>
          <h4 className="text-dashboard-accent1 mb-2">Account Status</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-dashboard-text">Verified:</div>
            <div className={diagnostics.accountStatus.isVerified ? "text-dashboard-accent3" : "text-dashboard-warning"}>
              {diagnostics.accountStatus.isVerified ? "Yes" : "No"}
            </div>
            <div className="text-dashboard-text">Auth ID:</div>
            <div className={diagnostics.accountStatus.hasAuthId ? "text-dashboard-accent3" : "text-dashboard-warning"}>
              {diagnostics.accountStatus.hasAuthId ? "Linked" : "Not Linked"}
            </div>
            <div className="text-dashboard-text">Member Status:</div>
            <div className="text-dashboard-accent2">{diagnostics.accountStatus.membershipStatus}</div>
            <div className="text-dashboard-text">Payment Status:</div>
            <div className={`${
              diagnostics.accountStatus.paymentStatus === 'completed' 
                ? 'text-dashboard-accent3' 
                : 'text-dashboard-warning'
            }`}>
              {diagnostics.accountStatus.paymentStatus}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-dashboard-accent1 mb-2">User Roles</h4>
          <div className="space-y-1">
            {diagnostics.roles.map((role: any) => (
              <div key={role.id} className="text-dashboard-text">
                {role.role} (since {new Date(role.created_at).toLocaleDateString()})
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-dashboard-accent1 mb-2">Recent Payments</h4>
          <div className="space-y-2">
            {diagnostics.recentPayments.map((payment: any) => (
              <div key={payment.id} className="text-dashboard-text flex justify-between">
                <span>{new Date(payment.created_at).toLocaleDateString()}</span>
                <span className="text-dashboard-accent2">${payment.amount}</span>
                <span className={`${
                  payment.status === 'approved' 
                    ? 'text-dashboard-accent3' 
                    : 'text-dashboard-warning'
                }`}>
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default DiagnosticsPanel;