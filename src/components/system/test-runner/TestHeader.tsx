import { PlayCircle } from 'lucide-react';
import { CardTitle } from "@/components/ui/card";
import TestControls from './TestControls';

interface TestHeaderProps {
  isRunning: boolean;
  onRunTests: () => void;
}

const TestHeader = ({ isRunning, onRunTests }: TestHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <PlayCircle className="w-6 h-6 text-dashboard-accent1" />
        <CardTitle className="text-xl font-medium text-dashboard-text">
          System Test Runner
        </CardTitle>
      </div>
      <TestControls isRunning={isRunning} onRunTests={onRunTests} />
    </div>
  );
};

export default TestHeader;