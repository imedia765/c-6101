export type DatabaseEnums = {
  app_role: "admin" | "collector" | "member";
  audit_operation: "create" | "update" | "delete";
  backup_operation_type: "backup" | "restore";
  monitoring_event_type:
    | "system_performance"
    | "api_latency"
    | "error_rate"
    | "user_activity"
    | "resource_usage";
  payment_method: "bank_transfer" | "cash";
  severity_level: "info" | "warning" | "error" | "critical";
};