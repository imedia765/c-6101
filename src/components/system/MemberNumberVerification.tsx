import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { AlertOctagon, Database, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface MemberNumberIssue {
  issue_type: string;
  description: string;
  affected_table: string;
  member_number: string;
  details: any;
}

const MemberNumberVerification = ({ 
  isCheckingMembers,
  setIsCheckingMembers,
  onCheckComplete
}: { 
  isCheckingMembers: boolean;
  setIsCheckingMembers: (value: boolean) => void;
  onCheckComplete: (success: boolean) => void;
}) => {
  const { data: memberIssues, refetch: refetchMemberIssues } = useQuery({
    queryKey: ['member_number_checks'],
    queryFn: async () => {
      console.log('Starting member number verification...');
      const { data, error } = await supabase.rpc('check_member_numbers');
      if (error) {
        console.error('Error in member number verification:', error);
        throw error;
      }
      console.log('Member number verification completed:', data);
      return data as MemberNumberIssue[];
    },
    enabled: false,
  });

  const handleCheckMembers = async () => {
    console.log('Initiating member number check...');
    setIsCheckingMembers(true);
    try {
      await refetchMemberIssues();
      console.log('Member check completed successfully');
      onCheckComplete(true);
    } catch (error) {
      console.error('Member check failed:', error);
      onCheckComplete(false);
    } finally {
      setIsCheckingMembers(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-white flex items-center gap-2">
          <Database className="w-5 h-5" />
          Member Number Verification
        </h2>
        <Button 
          onClick={handleCheckMembers} 
          disabled={isCheckingMembers}
        >
          Run Check
        </Button>
      </div>

      {memberIssues && memberIssues.length > 0 ? (
        <div className="space-y-4">
          {memberIssues.map((issue, index) => (
            <Alert 
              key={index}
              variant={issue.issue_type === 'Duplicate Member Number' ? 'destructive' : 'default'}
            >
              <AlertOctagon className="h-4 w-4" />
              <AlertTitle>{issue.issue_type}</AlertTitle>
              <AlertDescription>
                <p>{issue.description}</p>
                <p className="mt-2">
                  <strong>Table:</strong> {issue.affected_table}<br />
                  <strong>Member Number:</strong> {issue.member_number}
                </p>
                <pre className="mt-2 p-2 bg-black/10 rounded text-sm">
                  {JSON.stringify(issue.details, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      ) : memberIssues?.length === 0 ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>All Clear</AlertTitle>
          <AlertDescription>
            No member number issues were found.
          </AlertDescription>
        </Alert>
      ) : null}
    </section>
  );
};

export default MemberNumberVerification;