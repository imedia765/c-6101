import { Progress } from "@/components/ui/progress";

interface GitSyncProgressProps {
  currentOperation: string;
  progress: number;
}

export const GitSyncProgress = ({ currentOperation, progress }: GitSyncProgressProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-dashboard-text">
        <span>{currentOperation}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};