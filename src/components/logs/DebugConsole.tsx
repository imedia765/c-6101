import React from 'react';

interface DebugConsoleProps {
  logs: string[];
}

export const DebugConsole: React.FC<DebugConsoleProps> = ({ logs }) => {
  return (
    <div className="bg-background border rounded-lg p-4 font-mono text-sm">
      <h2 className="text-lg font-semibold mb-4">Debug Console</h2>
      <div className="space-y-1">
        {logs.map((log, index) => (
          <div key={index} className="text-muted-foreground">
            &gt; {log}
          </div>
        ))}
      </div>
    </div>
  );
};