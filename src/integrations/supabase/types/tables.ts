import { Json } from './json';

export type DatabaseTables = {
  audit_logs: {
    Row: {
      compressed: boolean | null;
      id: string;
      new_values: Json | null;
      old_values: Json | null;
      operation: "create" | "update" | "delete";
      record_id: string | null;
      severity: "info" | "warning" | "error" | "critical" | null;
      table_name: string;
      timestamp: string | null;
      user_id: string | null;
    };
    Insert: {
      compressed?: boolean | null;
      id?: string;
      new_values?: Json | null;
      old_values?: Json | null;
      operation: "create" | "update" | "delete";
      record_id?: string | null;
      severity?: "info" | "warning" | "error" | "critical" | null;
      table_name: string;
      timestamp?: string | null;
      user_id?: string | null;
    };
    Update: {
      compressed?: boolean | null;
      id?: string;
      new_values?: Json | null;
      old_values?: Json | null;
      operation?: "create" | "update" | "delete";
      record_id?: string | null;
      severity?: "info" | "warning" | "error" | "critical" | null;
      table_name?: string;
      timestamp?: string | null;
      user_id?: string | null;
    };
    Relationships: [];
  };
  backup_history: {
    Row: {
      backup_file_name: string | null;
      collectors_count: number | null;
      error_message: string | null;
      id: string;
      members_count: number | null;
      operation_type: "backup" | "restore";
      performed_at: string | null;
      performed_by: string | null;
      policies_count: number | null;
      roles_count: number | null;
      status: string | null;
    };
    Insert: {
      backup_file_name?: string | null;
      collectors_count?: number | null;
      error_message?: string | null;
      id?: string;
      members_count?: number | null;
      operation_type: "backup" | "restore";
      performed_at?: string | null;
      performed_by?: string | null;
      policies_count?: number | null;
      roles_count?: number | null;
      status?: string | null;
    };
    Update: {
      backup_file_name?: string | null;
      collectors_count?: number | null;
      error_message?: string | null;
      id?: string;
      members_count?: number | null;
      operation_type?: "backup" | "restore";
      performed_at?: string | null;
      performed_by?: string | null;
      policies_count?: number | null;
      roles_count?: number | null;
      status?: string | null;
    };
    Relationships: [];
  };
  git_operations_logs: {
    Row: {
      created_at: string | null;
      created_by: string | null;
      id: string;
      message: string | null;
      operation_type: string;
      status: string;
    };
    Insert: {
      created_at?: string | null;
      created_by?: string | null;
      id?: string;
      message?: string | null;
      operation_type: string;
      status: string;
    };
    Update: {
      created_at?: string | null;
      created_by?: string | null;
      id?: string;
      message?: string | null;
      operation_type?: string;
      status?: string;
    };
    Relationships: [];
  };
  members: {
    Row: {
      address: string | null;
      admin_note: string | null;
      auth_user_id: string | null;
      collector: string | null;
      collector_id: string | null;
      cors_enabled: boolean | null;
      created_at: string;
      created_by: string | null;
      date_of_birth: string | null;
      email: string | null;
      emergency_collection_amount: number | null;
      emergency_collection_created_at: string | null;
      emergency_collection_due_date: string | null;
      emergency_collection_status: string | null;
      family_member_dob: string | null;
      family_member_gender: string | null;
      family_member_name: string | null;
      family_member_relationship: string | null;
      full_name: string;
      gender: string | null;
      id: string;
      marital_status: string | null;
      member_number: string;
      membership_type: string | null;
      payment_amount: number | null;
      payment_date: string | null;
      payment_notes: string | null;
      payment_type: string | null;
      phone: string | null;
      postcode: string | null;
      status: string | null;
      ticket_description: string | null;
      ticket_priority: string | null;
      ticket_status: string | null;
      ticket_subject: string | null;
      town: string | null;
      updated_at: string;
      verified: boolean | null;
      yearly_payment_amount: number | null;
      yearly_payment_due_date: string | null;
      yearly_payment_status: string | null;
    };
    Insert: {
      address?: string | null;
      admin_note?: string | null;
      auth_user_id?: string | null;
      collector?: string | null;
      collector_id?: string | null;
      cors_enabled?: boolean | null;
      created_at?: string;
      created_by?: string | null;
      date_of_birth?: string | null;
      email?: string | null;
      emergency_collection_amount?: number | null;
      emergency_collection_created_at?: string | null;
      emergency_collection_due_date?: string | null;
      emergency_collection_status?: string | null;
      family_member_dob?: string | null;
      family_member_gender?: string | null;
      family_member_name?: string | null;
      family_member_relationship?: string | null;
      full_name: string;
      gender?: string | null;
      id?: string;
      marital_status?: string | null;
      member_number: string;
      membership_type?: string | null;
      payment_amount?: number | null;
      payment_date?: string | null;
      payment_notes?: string | null;
      payment_type?: string | null;
      phone?: string | null;
      postcode?: string | null;
      status?: string | null;
      ticket_description?: string | null;
      ticket_priority?: string | null;
      ticket_status?: string | null;
      ticket_subject?: string | null;
      town?: string | null;
      updated_at?: string;
      verified?: boolean | null;
      yearly_payment_amount?: number | null;
      yearly_payment_due_date?: string | null;
      yearly_payment_status?: string | null;
    };
    Update: {
      address?: string | null;
      admin_note?: string | null;
      auth_user_id?: string | null;
      collector?: string | null;
      collector_id?: string | null;
      cors_enabled?: boolean | null;
      created_at?: string;
      created_by?: string | null;
      date_of_birth?: string | null;
      email?: string | null;
      emergency_collection_amount?: number | null;
      emergency_collection_created_at?: string | null;
      emergency_collection_due_date?: string | null;
      emergency_collection_status?: string | null;
      family_member_dob?: string | null;
      family_member_gender?: string | null;
      family_member_name?: string | null;
      family_member_relationship?: string | null;
      full_name?: string;
      gender?: string | null;
      id?: string;
      marital_status?: string | null;
      member_number?: string;
      membership_type?: string | null;
      payment_amount?: number | null;
      payment_date?: string | null;
      payment_notes?: string | null;
      payment_type?: string | null;
      phone?: string | null;
      postcode?: string | null;
      status?: string | null;
      ticket_description?: string | null;
      ticket_priority?: string | null;
      ticket_status?: string | null;
      ticket_subject?: string | null;
      town?: string | null;
      updated_at?: string;
      verified?: boolean | null;
      yearly_payment_amount?: number | null;
      yearly_payment_due_date?: string | null;
      yearly_payment_status?: string | null;
    };
    Relationships: [];
  };
  members_collectors: {
    Row: {
      active: boolean | null;
      created_at: string;
      email: string | null;
      id: string;
      member_number: string | null;
      name: string | null;
      number: string | null;
      phone: string | null;
      prefix: string | null;
      updated_at: string;
    };
    Insert: {
      active?: boolean | null;
      created_at?: string;
      email?: string | null;
      id?: string;
      member_number?: string | null;
      name?: string | null;
      number?: string | null;
      phone?: string | null;
      prefix?: string | null;
      updated_at?: string;
    };
    Update: {
      active?: boolean | null;
      created_at?: string;
      email?: string | null;
      id?: string;
      member_number?: string | null;
      name?: string | null;
      number?: string | null;
      phone?: string | null;
      prefix?: string | null;
      updated_at?: string;
    };
    Relationships: [];
  };
  monitoring_logs: {
    Row: {
      details: Json | null;
      event_type: "system_performance" | "api_latency" | "error_rate" | "user_activity" | "resource_usage";
      id: string;
      metric_name: string;
      metric_value: number;
      severity: "info" | "warning" | "error" | "critical" | null;
      timestamp: string | null;
    };
    Insert: {
      details?: Json | null;
      event_type: "system_performance" | "api_latency" | "error_rate" | "user_activity" | "resource_usage";
      id?: string;
      metric_name: string;
      metric_value: number;
      severity?: "info" | "warning" | "error" | "critical" | null;
      timestamp?: string | null;
    };
    Update: {
      details?: Json | null;
      event_type?: "system_performance" | "api_latency" | "error_rate" | "user_activity" | "resource_usage";
      id?: string;
      metric_name?: string;
      metric_value?: number;
      severity?: "info" | "warning" | "error" | "critical" | null;
      timestamp?: string | null;
    };
    Relationships: [];
  };
  payment_requests: {
    Row: {
      amount: number;
      approved_at: string | null;
      approved_by: string | null;
      collector_id: string;
      created_at: string | null;
      id: string;
      member_id: string;
      member_number: string;
      notes: string | null;
      payment_method: "bank_transfer" | "cash";
      payment_type: string;
      status: string | null;
    };
    Insert: {
      amount: number;
      approved_at?: string | null;
      approved_by?: string | null;
      collector_id: string;
      created_at?: string | null;
      id?: string;
      member_id: string;
      member_number: string;
      notes?: string | null;
      payment_method: "bank_transfer" | "cash";
      payment_type: string;
      status?: string | null;
    };
    Update: {
      amount?: number;
      approved_at?: string | null;
      approved_by?: string | null;
      collector_id?: string;
      created_at?: string | null;
      id?: string;
      member_id?: string;
      member_number?: string;
      notes?: string | null;
      payment_method?: "bank_transfer" | "cash";
      payment_type?: string;
      status?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "payment_requests_collector_id_fkey";
        columns: ["collector_id"];
        isOneToOne: false;
        referencedRelation: "members_collectors";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "payment_requests_member_id_fkey";
        columns: ["member_id"];
        isOneToOne: false;
        referencedRelation: "members";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "payment_requests_member_number_fkey";
        columns: ["member_number"];
        isOneToOne: false;
        referencedRelation: "members";
        referencedColumns: ["member_number"];
      },
    ];
  };
  user_roles: {
    Row: {
      created_at: string;
      id: string;
      role: "admin" | "collector" | "member";
      user_id: string | null;
    };
    Insert: {
      created_at?: string;
      id?: string;
      role: "admin" | "collector" | "member";
      user_id?: string | null;
    };
    Update: {
      created_at?: string;
      id?: string;
      role?: "admin" | "collector" | "member";
      user_id?: string | null;
    };
    Relationships: [];
  };
};
