import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface QuickPushButtonProps {
  isProcessing: boolean;
}

export const QuickPushButton = ({ isProcessing }: QuickPushButtonProps) => {
  return (
    <Button
      disabled={isProcessing}
      className="w-full bg-dashboard-accent2 hover:bg-dashboard-accent2/80"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        'Quick Push to Master'
      )}
    </Button>
  );
};