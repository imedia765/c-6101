export type LogTab = 'audit' | 'monitoring';

export type MonitoringEventType = 'system_performance' | 'api_latency' | 'error_rate' | 'user_activity' | 'resource_usage';
export type SeverityLevel = 'info' | 'warning' | 'error' | 'critical';

export interface MonitoringLog {
  id: string;
  timestamp: string;
  event_type: MonitoringEventType;
  metric_name: string;
  metric_value: number;
  details: any;
  severity: SeverityLevel;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  operation: 'create' | 'update' | 'delete';
  table_name: string;
  record_id: string;
  old_values: any;
  new_values: any;
  severity: SeverityLevel;
  compressed: boolean;
}