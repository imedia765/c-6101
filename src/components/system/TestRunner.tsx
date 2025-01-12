import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TestHeader from './test-runner/TestHeader';
import TestProgress from './test-runner/TestProgress';
import TestResults from './test-runner/TestResults';
import TestLogs from './test-runner/TestLogs';
import { useTestRunner } from './test-runner/useTestRunner';

const TestRunner = () => {
  const {
    testLogs,
    isRunning,
    progress,
    currentTest,
    testResults,
    runTestsMutation
  } = useTestRunner();

  return (
    <Card className="bg-dashboard-card border-dashboard-cardBorder hover:border-dashboard-cardBorderHover transition-all duration-300">
      <CardHeader className="pb-4">
        <TestHeader 
          isRunning={isRunning}
          onRunTests={() => runTestsMutation.mutate()}
        />
      </CardHeader>

      <CardContent className="space-y-6">
        <TestProgress 
          isRunning={isRunning}
          currentTest={currentTest}
          progress={progress}
          error={runTestsMutation.error}
        />

        <TestResults results={testResults} />
        
        <TestLogs logs={testLogs} />
      </CardContent>
    </Card>
  );
};

export default TestRunner;