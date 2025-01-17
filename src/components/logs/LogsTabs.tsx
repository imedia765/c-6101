import React from 'react';
import { DashboardTabs, DashboardTabsList, DashboardTabsTrigger } from '@/components/ui/dashboard-tabs';
import { LogsTabsType } from '../../constants/logs';

interface LogsTabsProps {
  activeTab: LogsTabsType;
  onTabChange: (tab: LogsTabsType) => void;
}

export const LogsTabs: React.FC<LogsTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <DashboardTabs value={activeTab} onValueChange={onTabChange}>
      <DashboardTabsList className="grid grid-cols-2 gap-0">
        <DashboardTabsTrigger value="AUDIT">Audit Logs</DashboardTabsTrigger>
        <DashboardTabsTrigger value="MONITORING">Monitoring Logs</DashboardTabsTrigger>
      </DashboardTabsList>
    </DashboardTabs>
  );
};