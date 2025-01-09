import { GitBranch } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const QuickPushButton = ({ isProcessing }: { isProcessing: boolean }) => {
  const { toast } = useToast();

  const handleQuickPush = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      console.log('Starting quick push operation...');

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
        console.error('Error creating operation log:', logError);
        throw logError;
      }

      // Call the git operations function
      const { data, error } = await supabase.functions.invoke('git-operations', {
        body: { 
          branch: 'main',
          operation: 'push',
          logId: logData?.id,
          validateOnly: false // Add this flag to ensure full push operation
        }
      });

      if (error) {
        console.error('Quick push error:', error);
        
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

      // Verify the push was actually completed
      if (!data?.pushCompleted) {
        throw new Error('Push operation did not complete successfully');
      }

      console.log('Quick push response:', data);
      
      // Update log with success
      await supabase
        .from('git_operations_logs')
        .update({
          status: 'completed',
          message: 'Successfully pushed to master repository'
        })
        .eq('id', logData?.id);

      toast({
        title: "Success",
        description: "Successfully pushed to master repository",
      });

    } catch (error: any) {
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