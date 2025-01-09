import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogsTabsType } from '../../constants/logs';

interface LogsTabsProps {
  activeTab: LogsTabsType;
  onTabChange: (tab: LogsTabsType) => void;
}

export const LogsTabs: React.FC<LogsTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="AUDIT">Audit Logs</TabsTrigger>
        <TabsTrigger value="MONITORING">Monitoring Logs</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};