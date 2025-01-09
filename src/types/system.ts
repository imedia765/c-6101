import { Member } from './member';

export interface SystemCheck {
  check_type: string;
  status: string;
  details: any;
}

export interface MemberNumberCheck {
  issue_type: string;
  description: string;
  affected_table: string;
  member_number: string;
  details: any;
}

export interface SystemCheckReport {
  title: string;
  description: string;
  status: string;
  details?: string;
}

export type SystemCheckPDFData = Pick<Member, 'member_number' | 'full_name' | 'collector'>;