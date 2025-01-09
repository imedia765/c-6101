import React, { useState } from 'react';
import LogsHeader from './logs/LogsHeader';
import { LogsTabs } from './logs/LogsTabs';
import { AuditLogsList } from './logs/AuditLogsList';
import MonitoringLogsList from './logs/MonitoringLogsList';
import { DebugConsole } from './logs/DebugConsole';
import { LOGS_TABS, LogsTabsType } from '@/constants/logs';

const AuditLogsView = () => {
  const [activeTab, setActiveTab] = useState<LogsTabsType>(LOGS_TABS.AUDIT);
  const [debugLogs] = useState(['Debug logging initialized', 'Real-time subscriptions active']);

  return (
    <div className="space-y-6">
      <LogsHeader 
        title="System Logs"
        subtitle="View and manage system audit and monitoring logs"
      />
      
      <LogsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === LOGS_TABS.AUDIT && <AuditLogsList />}
      {activeTab === LOGS_TABS.MONITORING && <MonitoringLogsList />}
      
      <DebugConsole logs={debugLogs} />
    </div>
  );
};

export default AuditLogsView;