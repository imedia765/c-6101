export const LOGS_TABS = {
  AUDIT: 'AUDIT',
  MONITORING: 'MONITORING'
} as const;

export type LogsTabsType = (typeof LOGS_TABS)[keyof typeof LOGS_TABS];