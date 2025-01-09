import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from 'lucide-react';

interface GitOperationLog {
  id: string;
  operation_type: string;
  status: string;
  message: string;
  created_at: string;
}

interface GitOperationLogsProps {
  logs: GitOperationLog[];
}

export const GitOperationLogs = ({ logs }: GitOperationLogsProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <History className="w-4 h-4 text-dashboard-accent1" />
        <h3 className="text-sm font-medium text-white">Recent Operations</h3>
      </div>
      <ScrollArea className="h-[200px] rounded-md border border-white/10">
        <div className="p-4 space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="text-sm p-2 rounded bg-dashboard-card/50 border border-white/10"
            >
              <div className="flex justify-between text-white">
                <span>{log.operation_type}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  log.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  log.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {log.status}
                </span>
              </div>
              <p className="text-dashboard-muted text-xs mt-1">{log.message}</p>
              <p className="text-dashboard-muted text-xs mt-1">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-dashboard-muted text-sm text-center py-4">
              No recent operations
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};