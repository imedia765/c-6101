import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from 'lucide-react';

interface GitOperationLog {
  id: string;
  operation_type: string;
  status: string;
  message: string;
  created_at: string;
  error_details?: string;
}

interface GitOperationLogsProps {
  logs: GitOperationLog[];
}

export const GitOperationLogs = ({ logs }: GitOperationLogsProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <History className="w-4 h-4 text-dashboard-accent1" />
        <h3 className="text-sm font-medium text-white">Operation Logs</h3>
      </div>
      <ScrollArea className="h-[200px] rounded-md border border-white/10">
        <div className="p-4 space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded bg-dashboard-card/50 border ${
                log.status === 'failed' 
                  ? 'border-red-500/30' 
                  : 'border-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-dashboard-accent1 font-medium">
                  {log.operation_type}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  log.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  log.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {log.status}
                </span>
              </div>
              <p className="text-sm text-dashboard-text">{log.message}</p>
              {log.error_details && (
                <p className="mt-2 text-xs text-red-400 bg-red-500/10 p-2 rounded">
                  {log.error_details}
                </p>
              )}
              <p className="text-xs text-dashboard-muted mt-2">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-center text-dashboard-muted py-4">
              No operation logs available
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};