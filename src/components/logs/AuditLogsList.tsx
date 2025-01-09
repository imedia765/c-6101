import React from 'react';

export const AuditLogsList: React.FC = () => {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Audit Logs</h2>
      <div className="space-y-2">
        <p>No audit logs available</p>
      </div>
    </div>
  );
};