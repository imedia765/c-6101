import { Progress } from "@/components/ui/progress";

interface PDFGenerationProgressProps {
  current: number;
  total: number;
  currentCollector: string;
}

const PDFGenerationProgress = ({ current, total, currentCollector }: PDFGenerationProgressProps) => {
  const progress = (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-dashboard-text">
        <span>Generating PDFs: {current}/{total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-dashboard-text">
        Current: {currentCollector}
      </p>
    </div>
  );
};

export default PDFGenerationProgress;