import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const InvalidateRolesButton = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleInvalidateCache = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        console.log('Invalidating cache for user:', session.user.id);
        await queryClient.invalidateQueries({ queryKey: ['userRoles', session.user.id] });
        await queryClient.refetchQueries({ queryKey: ['userRoles', session.user.id] });
        
        toast({
          title: "Cache Invalidated",
          description: "Role cache has been cleared. Changes should be visible now.",
        });
      } else {
        console.log('No active session found');
        toast({
          title: "No Session Found",
          description: "Please ensure you are logged in.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
      toast({
        title: "Cache Invalidation Failed",
        description: "Please try logging out and back in.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleInvalidateCache}
      className="w-full"
    >
      Refresh Role Cache
    </Button>
  );
};

export default InvalidateRolesButton;