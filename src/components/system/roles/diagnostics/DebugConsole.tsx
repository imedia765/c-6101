import { AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DebugConsoleProps {
  logs: string[];
}

const DebugConsole = ({ logs }: DebugConsoleProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-dashboard-accent1" />
        <h5 className="font-medium text-white">Debug Console</h5>
      </div>
      <div className="bg-black/50 rounded-lg p-3 font-mono text-xs">
        <ScrollArea className="h-[200px]">
          {logs.map((log, index) => (
            <div key={index} className="text-dashboard-text">
              {log}
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default DebugConsole;