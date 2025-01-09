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

      const { data, error } = await supabase.functions.invoke('git-operations', {
        body: { branch: 'main' }
      });

      if (error) {
        console.error('Quick push error:', error);
        throw error;
      }

      console.log('Quick push response:', data);
      
      toast({
        title: "Success",
        description: "Successfully pushed to master repository",
      });

    } catch (error: any) {
      console.error('Quick push error:', error);
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