import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import SystemHealthCheck from './system/SystemHealthCheck';
import RoleManagementCard from './system/RoleManagementCard';
import GitSyncCard from './system/git/GitSyncCard';
import { Card } from './ui/card';
import { useTestRunner } from './system/test-runner/useTestRunner';
import TestHeader from './system/test-runner/TestHeader';
import TestProgress from './system/test-runner/TestProgress';
import TestResults from './system/test-runner/TestResults';
import TestLogs from './system/test-runner/TestLogs';
import SystemMetricsChart from './system/metrics/SystemMetricsChart';
import AuditActivityChart from './system/metrics/AuditActivityChart';

const SystemToolsView = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    testLogs,
    isRunning,
    progress,
    currentTest,
    testResults,
    runTestsMutation
  } = useTestRunner();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          console.error('Auth error:', error);
          toast({
            title: "Authentication Error",
            description: "Please sign in again",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }
        queryClient.invalidateQueries({ queryKey: ['security_audit'] });
        queryClient.invalidateQueries({ queryKey: ['member_number_check'] });
      } catch (error) {
        console.error('Session check error:', error);
        toast({
          title: "Session Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate('/login');
      }
    };
    checkAuth();
  }, [queryClient, toast, navigate]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-medium mb-2 text-white">System Tools</h1>
        <p className="text-dashboard-muted">Manage and monitor system health</p>
      </header>

      <div className="grid gap-6">
        <SystemHealthCheck />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemMetricsChart />
          <AuditActivityChart />
        </div>

        <Card className="dashboard-card">
          <div className="p-6 space-y-6">
            <TestHeader 
              isRunning={isRunning}
              onRunTests={() => runTestsMutation.mutate()}
            />
            <TestProgress 
              isRunning={isRunning}
              currentTest={currentTest}
              progress={progress}
              error={runTestsMutation.error}
            />
            <TestResults results={testResults} />
            <TestLogs logs={testLogs} />
          </div>
        </Card>

        <GitSyncCard />
        <RoleManagementCard />
      </div>
    </div>
  );
};

export default SystemToolsView;