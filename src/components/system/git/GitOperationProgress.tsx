interface GitOperationProgressProps {
  currentOperation: string;
  progress: number;
}

export const GitOperationProgress = ({ currentOperation, progress }: GitOperationProgressProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-dashboard-text">
        <span>{currentOperation}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 bg-dashboard-card/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-dashboard-accent1 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};