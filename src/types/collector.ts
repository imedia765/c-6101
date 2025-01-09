export interface Collector {
  id: string;
  name: string;
  prefix: string;
  number: string;
  email: string | null;
  phone: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}