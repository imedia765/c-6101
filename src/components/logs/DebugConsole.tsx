import React from 'react';
import { Copy, Terminal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DebugConsoleProps {
  logs: string[];
}

export const DebugConsole: React.FC<DebugConsoleProps> = ({ logs }) => {
  const copyLogs = () => {
    const logText = logs.join('\n');
    navigator.clipboard.writeText(logText);
    toast.success("Logs copied to clipboard");
  };

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-4 font-mono text-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-dashboard-accent1" />
          <h2 className="text-lg font-semibold text-dashboard-text">Debug Console</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={copyLogs}
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy Logs
        </Button>
      </div>
      
      {logs.length === 0 ? (
        <div className="text-dashboard-muted italic p-4 text-center border border-dashed rounded">
          No logs available. Run tests to see output.
        </div>
      ) : (
        <div className="space-y-1 max-h-[300px] overflow-y-auto border border-dashboard-border rounded p-2">
          {logs.map((log, index) => (
            <div key={index} className="text-dashboard-muted flex items-start hover:bg-dashboard-hover/10 p-1 rounded">
              <span className="text-dashboard-accent1 mr-2 select-none">&gt;</span>
              <span className="whitespace-pre-wrap">{log}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};