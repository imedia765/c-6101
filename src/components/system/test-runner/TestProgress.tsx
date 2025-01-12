import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import SystemCheckProgress from '../SystemCheckProgress';

interface TestProgressProps {
  isRunning: boolean;
  currentTest: string;
  progress: number;
  error?: Error;
}

const TestProgress = ({ isRunning, currentTest, progress, error }: TestProgressProps) => {
  if (!isRunning && !error) return null;

  return (
    <>
      {isRunning && (
        <div className="glass-card p-4 rounded-lg border border-dashboard-cardBorder bg-dashboard-card/50">
          <SystemCheckProgress
            currentCheck={currentTest}
            progress={progress}
            totalChecks={100}
            completedChecks={Math.floor(progress)}
          />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="bg-dashboard-card border-dashboard-error">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Running Tests</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default TestProgress;