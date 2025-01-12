import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TestResult {
  check_type: string;
  metric_name: string | null;
  current_value: number | null;
  threshold: number | null;
  status: string;
  details: Record<string, any>;
  test_category: string;
}

export const useTestRunner = () => {
  const [testLogs, setTestLogs] = useState<string[]>(['Test runner initialized and ready']);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const runAllTests = async () => {
    setIsRunning(true);
    setTestLogs(prev => [...prev, '🚀 Starting system checks...']);
    setProgress(0);
    setCurrentTest('Initializing tests...');
    
    try {
      console.log('Initiating system checks...');
      
      const { data, error } = await supabase
        .rpc('run_combined_system_checks')
        .single();

      if (error) {
        console.error('Test run error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        const errorMessage = error.message || 'Unknown error occurred';
        const errorDetails = error.details || '';
        setTestLogs(prev => [
          ...prev,
          `❌ Error running checks: ${errorMessage}`,
          `📝 Error details: ${errorDetails}`
        ]);
        throw new Error(`${errorMessage}\n${errorDetails}`);
      }

      if (!data) {
        const message = 'Invalid response format from system checks';
        setTestLogs(prev => [...prev, `❌ ${message}`]);
        throw new Error(message);
      }

      console.log('System checks results:', data);

      // Process and validate each result
      const processedResults = Array.isArray(data) ? data : [data];
      const validatedResults = processedResults.map((result: any) => ({
        check_type: result.check_type || 'Unknown Check',
        metric_name: result.metric_name,
        current_value: typeof result.current_value === 'number' ? result.current_value : null,
        threshold: typeof result.threshold === 'number' ? result.threshold : null,
        status: result.status || 'Unknown',
        details: result.details || {},
        test_category: result.test_category || 'system'
      }));

      // Group results by category for progress tracking
      const categories = [...new Set(validatedResults.map(r => r.test_category))];
      const totalSteps = categories.length;
      
      // Update progress as we process each category
      categories.forEach((category, index) => {
        const progress = Math.round(((index + 1) / totalSteps) * 100);
        setProgress(progress);
        setCurrentTest(`Processing ${category} tests...`);
      });

      setTestResults(validatedResults);
      setProgress(100);
      setCurrentTest('All checks complete');
      
      const resultSummary = categories.map(category => {
        const categoryResults = validatedResults.filter(r => r.test_category === category);
        const warnings = categoryResults.filter(r => r.status.toLowerCase() === 'warning').length;
        const critical = categoryResults.filter(r => r.status.toLowerCase() === 'critical').length;
        return `${category}: ${categoryResults.length} tests (${warnings} warnings, ${critical} critical)`;
      });

      setTestLogs(prev => [
        ...prev, 
        '✅ System checks completed successfully',
        ...resultSummary.map(summary => `📊 ${summary}`)
      ]);

      toast.success('System checks completed successfully');
      
      return validatedResults;
    } catch (error: any) {
      console.error('System checks error:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      setTestLogs(prev => [
        ...prev, 
        `❌ Error running checks: ${errorMessage}`,
        '⚠️ Check console for detailed error information'
      ]);
      toast.error(`System checks failed: ${errorMessage}`);
      throw error;
    } finally {
      setIsRunning(false);
    }
  };

  const runTestsMutation = useMutation({
    mutationFn: runAllTests,
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      setTestLogs(prev => [
        ...prev, 
        `❌ Error: ${error.message}`,
        '⚠️ Check console for detailed error information'
      ]);
      setProgress(0);
      setCurrentTest('Test run failed');
      toast.error(`Failed to run system checks: ${error.message}`);
    }
  });

  // Subscribe to real-time test logs
  useQuery({
    queryKey: ['test-logs'],
    queryFn: async () => {
      const channel = supabase
        .channel('test-logs')
        .on('broadcast', { event: 'test-log' }, ({ payload }) => {
          if (payload?.message) {
            setTestLogs(prev => [...prev, `📝 ${payload.message}`]);
          }
          if (payload?.progress) {
            setProgress(payload.progress);
          }
          if (payload?.currentTest) {
            setCurrentTest(payload.currentTest);
          }
        })
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    },
    enabled: isRunning
  });

  return {
    testLogs,
    isRunning,
    progress,
    currentTest,
    testResults,
    runTestsMutation
  };
};