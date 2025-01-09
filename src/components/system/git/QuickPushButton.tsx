import { GitBranch } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuickPushButtonProps {
  isProcessing: boolean;
  onLog?: (message: string) => void;
}

export const QuickPushButton = ({ isProcessing, onLog }: QuickPushButtonProps) => {
  const { toast } = useToast();

  const handleQuickPush = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        onLog?.('Error: No active session');
        throw new Error('No active session');
      }

      onLog?.('Starting quick push operation...');

      // First, log the operation start
      const { data: logData, error: logError } = await supabase
        .from('git_operations_logs')
        .insert({
          operation_type: 'quick_push',
          status: 'started',
          message: 'Initiating quick push to master repository',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (logError) {
        onLog?.(`Error creating operation log: ${logError.message}`);
        throw logError;
      }

      onLog?.('Created operation log');

      // Call the git operations function
      onLog?.('Calling git operations function...');
      const { data, error } = await supabase.functions.invoke('git-operations', {
        body: { 
          branch: 'main',
          operation: 'push',
          logId: logData?.id,
          validateOnly: false
        }
      });

      if (error) {
        onLog?.(`Quick push error: ${error.message}`);
        
        // Update log with error details
        await supabase
          .from('git_operations_logs')
          .update({
            status: 'failed',
            message: 'Push operation failed',
            error_details: error.message
          })
          .eq('id', logData?.id);

        throw error;
      }

      onLog?.('Git operations response received');

      // Verify the push was actually completed
      if (!data?.pushCompleted) {
        const errorMessage = 'Push operation did not complete successfully';
        onLog?.(`Error: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      // Update log with success
      await supabase
        .from('git_operations_logs')
        .update({
          status: 'completed',
          message: 'Successfully pushed to master repository'
        })
        .eq('id', logData?.id);

      onLog?.('Push operation completed successfully');
      
      toast({
        title: "Success",
        description: "Successfully pushed to master repository",
      });

    } catch (error: any) {
      onLog?.(`Push error: ${error.message}`);
      console.error('Push error:', error);
      
      toast({
        title: "Push Failed",
        description: error.message || "Failed to push changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleQuickPush}
      disabled={isProcessing}
      className="w-full bg-dashboard-accent1 hover:bg-dashboard-accent1/80 mb-4"
    >
      <GitBranch className="w-4 h-4 mr-2" />
      Quick Push to Master
    </Button>
  );
};