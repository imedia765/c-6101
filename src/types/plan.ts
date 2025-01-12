export interface PlanningData {
  member_number: string;
  full_name: string;
  status: string;
  collector: string | null;
  yearly_payment_amount: number | null;
  yearly_payment_status: string | null;
  yearly_payment_due_date: string | null;
  emergency_collection_amount: number | null;
  emergency_collection_status: string | null;
  emergency_collection_due_date: string | null;
  payment_amount: number | null;
  payment_type: string | null;
  payment_date: string | null;
  collector_name: string | null;
  collector_phone: string | null;
}