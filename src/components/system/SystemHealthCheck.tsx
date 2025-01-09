import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Shield, Info, FileDown, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import SystemCheckProgress from './SystemCheckProgress';
import SystemCheckResults from './SystemCheckResults';
import { generateSystemCheckPDF } from '@/utils/systemPdfGenerator';
import { SystemCheck, MemberNumberCheck } from '@/types/system';
import { runAdditionalChecks } from './AdditionalSystemChecks';

type CheckFunction = 'audit_security_settings' | 'check_member_numbers' | 'validate_user_roles';

const CHECKS: Array<{ name: string; fn: CheckFunction }> = [
  { name: 'Security Audit', fn: 'audit_security_settings' },
  { name: 'Member Number Verification', fn: 'check_member_numbers' },
  { name: 'Role Validation', fn: 'validate_user_roles' }
];

const SystemHealthCheck = () => {
  const { toast } = useToast();
  const [isRunningChecks, setIsRunningChecks] = useState(false);
  const [systemChecks, setSystemChecks] = useState<SystemCheck[]>([]);
  const [currentCheck, setCurrentCheck] = useState('');
  const [completedChecks, setCompletedChecks] = useState(0);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const clearResults = () => {
    setSystemChecks([]);
    toast({
      title: "Results Cleared",
      description: "System check results have been cleared",
    });
  };

  const generatePDFReport = () => {
    if (systemChecks.length === 0) {
      toast({
        title: "No Results",
        description: "Run system checks first to generate a PDF report",
        variant: "destructive",
      });
      return;
    }

    try {
      const doc = generateSystemCheckPDF(systemChecks, "System Health Check Report");
      doc.save("system-health-report.pdf");
      
      toast({
        title: "PDF Generated",
        description: "System health report has been downloaded",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

  const runSystemChecks = async () => {
    console.log('Starting system checks...');
    setIsRunningChecks(true);
    setSystemChecks([]);
    setCompletedChecks(0);
    
    try {
      let allChecks: SystemCheck[] = [];
      
      for (const check of CHECKS) {
        setCurrentCheck(check.name);
        console.log(`Running ${check.name}...`);
        
        const { data, error } = await supabase.rpc(check.fn);
        if (error) throw error;

        if (check.fn === 'check_member_numbers') {
          const memberChecks = (data as MemberNumberCheck[]).map(check => ({
            check_type: check.issue_type,
            status: 'Warning',
            details: {
              description: check.description,
              affected_table: check.affected_table,
              member_number: check.member_number,
              ...check.details
            }
          }));
          allChecks = [...allChecks, ...memberChecks];
        } else {
          allChecks = [...allChecks, ...(data as SystemCheck[])];
        }
        
        setCompletedChecks(prev => prev + 1);
        await delay(800);
      }

      setCurrentCheck('Additional System Checks');
      const additionalChecks = await runAdditionalChecks();
      allChecks = [...allChecks, ...additionalChecks];
      setCompletedChecks(prev => prev + 1);

      setSystemChecks(allChecks);
      toast({
        title: "System Checks Complete",
        description: `Found ${allChecks.length} items to review`,
      });
    } catch (error) {
      console.error('Error running system checks:', error);
      toast({
        title: "Error Running Checks",
        description: "An error occurred while running system checks",
        variant: "destructive",
      });
    } finally {
      setIsRunningChecks(false);
    }
  };

  return (
    <Card className="bg-dashboard-card border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-dashboard-accent1" />
            <CardTitle className="text-xl text-white">System Health Check</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={clearResults}
              variant="outline"
              className="border-dashboard-accent1/20 hover:bg-dashboard-accent1/10"
              disabled={isRunningChecks || systemChecks.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Results
            </Button>
            <Button 
              onClick={generatePDFReport}
              variant="outline"
              className="border-dashboard-accent1/20 hover:bg-dashboard-accent1/10"
              disabled={isRunningChecks || systemChecks.length === 0}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button 
              onClick={runSystemChecks}
              disabled={isRunningChecks}
              className="bg-dashboard-accent1 hover:bg-dashboard-accent1/80"
            >
              Run System Checks
            </Button>
          </div>
        </div>
        <CardDescription className="text-dashboard-muted">
          Comprehensive system analysis and security audit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md">
          {isRunningChecks ? (
            <SystemCheckProgress
              currentCheck={currentCheck}
              progress={(completedChecks / CHECKS.length) * 100}
              totalChecks={CHECKS.length}
              completedChecks={completedChecks}
            />
          ) : null}
          
          {systemChecks.length > 0 ? (
            <SystemCheckResults checks={systemChecks} />
          ) : !isRunningChecks ? (
            <Card className="border-dashboard-accent1/20 bg-dashboard-card/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-dashboard-accent1" />
                  <CardTitle className="text-dashboard-accent1">No Issues Found</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-dashboard-accent1/80">
                  All system checks passed successfully. Your system is healthy and secure.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SystemHealthCheck;