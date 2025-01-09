import React from 'react';

const MonitoringLogsList: React.FC = () => {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Monitoring Logs</h2>
      <div className="space-y-2">
        <p>No monitoring logs available</p>
      </div>
    </div>
  );
};

export default MonitoringLogsList;