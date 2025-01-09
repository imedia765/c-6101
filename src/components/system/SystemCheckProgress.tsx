import { Progress } from "@/components/ui/progress";

interface SystemCheckProgressProps {
  currentCheck: string;
  progress: number;
  totalChecks: number;
  completedChecks: number;
}

const SystemCheckProgress = ({ currentCheck, progress, totalChecks, completedChecks }: SystemCheckProgressProps) => {
  return (
    <div className="space-y-2 mb-6">
      <div className="flex justify-between text-sm text-dashboard-text">
        <span>Running system checks: {completedChecks}/{totalChecks}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-dashboard-text">
        Current: {currentCheck}
      </p>
    </div>
  );
};

export default SystemCheckProgress;