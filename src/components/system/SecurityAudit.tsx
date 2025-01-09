import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { AlertOctagon, Shield, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface AuditResult {
  check_type: string;
  status: string;
  details: any;
}

const SecurityAudit = ({ 
  isAuditingSecurity,
  setIsAuditingSecurity,
  onAuditComplete
}: { 
  isAuditingSecurity: boolean;
  setIsAuditingSecurity: (value: boolean) => void;
  onAuditComplete: (success: boolean) => void;
}) => {
  const { data: securityAudit, refetch: refetchSecurityAudit } = useQuery({
    queryKey: ['security_audit'],
    queryFn: async () => {
      console.log('Starting security audit...');
      const { data, error } = await supabase.rpc('audit_security_settings');
      if (error) {
        console.error('Error in security audit:', error);
        throw error;
      }
      console.log('Security audit completed:', data);
      return data as AuditResult[];
    },
    enabled: false,
  });

  const handleSecurityAudit = async () => {
    console.log('Initiating security audit...');
    setIsAuditingSecurity(true);
    try {
      await refetchSecurityAudit();
      console.log('Security audit completed successfully');
      onAuditComplete(true);
    } catch (error) {
      console.error('Security audit failed:', error);
      onAuditComplete(false);
    } finally {
      setIsAuditingSecurity(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Audit
        </h2>
        <Button 
          onClick={handleSecurityAudit}
          disabled={isAuditingSecurity}
        >
          Run Audit
        </Button>
      </div>

      {securityAudit && securityAudit.length > 0 ? (
        <div className="space-y-4">
          {securityAudit.map((result, index) => (
            <Alert 
              key={index}
              variant={result.status === 'Critical' ? 'destructive' : 'default'}
            >
              <AlertOctagon className="h-4 w-4" />
              <AlertTitle>{result.check_type}</AlertTitle>
              <AlertDescription>
                <p className="mb-2">Status: {result.status}</p>
                <pre className="p-2 bg-black/10 rounded text-sm">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      ) : securityAudit?.length === 0 ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>All Clear</AlertTitle>
          <AlertDescription>
            No security issues were found.
          </AlertDescription>
        </Alert>
      ) : null}
    </section>
  );
};

export default SecurityAudit;