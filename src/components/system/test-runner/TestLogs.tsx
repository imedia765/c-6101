import { Terminal } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { DebugConsole } from '../../logs/DebugConsole';

interface TestLogsProps {
  logs: string[];
}

const TestLogs = ({ logs }: TestLogsProps) => {
  return (
    <>
      <Separator className="my-6 bg-dashboard-cardBorder" />
      <div className="glass-card p-4 rounded-lg border border-dashboard-cardBorder bg-dashboard-card/50">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-4 h-4 text-dashboard-accent2" />
          <h3 className="text-sm font-medium text-dashboard-text">Debug Console</h3>
        </div>
        <DebugConsole logs={logs} />
      </div>
    </>
  );
};

export default TestLogs;