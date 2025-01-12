import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from 'lucide-react';

interface GitSyncLog {
  id: string;
  operation_type: string;
  status: string;
  message: string;
  created_at: string;
  error_details?: string;
}

interface GitSyncLogsProps {
  logs: GitSyncLog[];
}

export const GitSyncLogs = ({ logs }: GitSyncLogsProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <History className="w-4 h-4 text-dashboard-accent1" />
        <h3 className="text-sm font-medium text-white">Sync Operation Logs</h3>
      </div>
      <ScrollArea className="h-[300px] rounded-md border border-dashboard-cardBorder bg-dashboard-card">
        <div className="p-4 space-y-3 font-mono text-sm">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded bg-dashboard-card/50 border transition-colors ${
                log.status === 'failed' 
                  ? 'border-dashboard-error/30 hover:border-dashboard-error/50' 
                  : 'border-dashboard-cardBorder hover:border-dashboard-cardBorderHover'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-dashboard-accent1 font-semibold">
                  {log.operation_type}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  log.status === 'completed' ? 'bg-dashboard-success/20 text-dashboard-success' :
                  log.status === 'failed' ? 'bg-dashboard-error/20 text-dashboard-error' :
                  'bg-dashboard-warning/20 text-dashboard-warning'
                }`}>
                  {log.status}
                </span>
              </div>
              <p className={`mb-1 ${log.status === 'failed' ? 'text-dashboard-error' : 'text-dashboard-text'}`}>
                {log.message}
              </p>
              {log.error_details && (
                <p className="text-dashboard-error text-xs mt-1 bg-dashboard-error/10 p-2 rounded">
                  Error: {log.error_details}
                </p>
              )}
              <p className="text-dashboard-muted text-xs mt-2">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-dashboard-muted text-center py-4">
              No sync operation logs available
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};