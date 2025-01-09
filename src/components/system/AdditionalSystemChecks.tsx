import { supabase } from "@/integrations/supabase/client";
import { SystemCheck } from '@/types/system';

export const runAdditionalChecks = async (): Promise<SystemCheck[]> => {
  const checks: SystemCheck[] = [];

  // Check for payment requests with mismatched collector IDs
  const { data: paymentRequests, error: paymentError } = await supabase
    .from('payment_requests')
    .select(`
      id,
      member_id,
      collector_id,
      members!payment_requests_member_id_fkey (
        collector
      )
    `);

  if (!paymentError && paymentRequests) {
    const mismatchedPayments = paymentRequests.filter(pr => {
      const collectorName = pr.members?.collector;
      return collectorName && pr.collector_id !== collectorName;
    });

    if (mismatchedPayments.length > 0) {
      checks.push({
        check_type: 'Payment Request Collector Mismatch',
        status: 'Warning',
        details: {
          description: 'Payment requests with mismatched collector assignments',
          affected_records: mismatchedPayments.map(p => ({
            payment_id: p.id,
            member_id: p.member_id,
            collector_id: p.collector_id
          }))
        }
      });
    }
  }

  // Check for inactive members with pending payments
  const { data: inactiveMembers, error: membersError } = await supabase
    .from('members')
    .select(`
      id,
      member_number,
      full_name,
      status,
      payment_requests!payment_requests_member_id_fkey (
        id,
        status
      )
    `)
    .eq('status', 'inactive')
    .eq('payment_requests.status', 'pending');

  if (!membersError && inactiveMembers && inactiveMembers.length > 0) {
    checks.push({
      check_type: 'Inactive Members with Pending Payments',
      status: 'Critical',
      details: {
        description: 'Inactive members have pending payment requests',
        affected_members: inactiveMembers.map(m => ({
          member_number: m.member_number,
          full_name: m.full_name,
          payment_count: m.payment_requests?.length || 0
        }))
      }
    });
  }

  // Check for overdue yearly payments
  const { data: overduePayments, error: overdueError } = await supabase
    .from('members')
    .select('*')
    .eq('yearly_payment_status', 'pending')
    .lt('yearly_payment_due_date', new Date().toISOString());

  if (!overdueError && overduePayments && overduePayments.length > 0) {
    checks.push({
      check_type: 'Overdue Yearly Payments',
      status: 'Warning',
      details: {
        description: 'Members with overdue yearly payments',
        affected_members: overduePayments.map(m => ({
          member_number: m.member_number,
          full_name: m.full_name,
          due_date: m.yearly_payment_due_date
        }))
      }
    });
  }

  // Check for emergency collections without due dates
  const { data: emergencyCollections, error: emergencyError } = await supabase
    .from('members')
    .select('*')
    .is('emergency_collection_due_date', null)
    .not('emergency_collection_amount', 'is', null);

  if (!emergencyError && emergencyCollections && emergencyCollections.length > 0) {
    checks.push({
      check_type: 'Incomplete Emergency Collections',
      status: 'Warning',
      details: {
        description: 'Emergency collections missing due dates',
        affected_members: emergencyCollections.map(m => ({
          member_number: m.member_number,
          full_name: m.full_name,
          amount: m.emergency_collection_amount
        }))
      }
    });
  }

  return checks;
};