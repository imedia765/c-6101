export interface GitOperationLog {
  id: string;
  operation_type: string;
  message: string | null;
  error_details?: string | null;
  status: string;
  created_at: string | null;
  created_by: string | null;
}

export interface GitRealtimePayload {
  new: GitOperationLog;
  old: GitOperationLog;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}