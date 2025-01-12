import { Button } from "@/components/ui/button";
import { PlayCircle } from 'lucide-react';

interface TestControlsProps {
  isRunning: boolean;
  onRunTests: () => void;
}

const TestControls = ({ isRunning, onRunTests }: TestControlsProps) => {
  return (
    <Button
      onClick={onRunTests}
      disabled={isRunning}
      className="bg-dashboard-accent1 hover:bg-dashboard-accent2 text-white transition-all duration-300"
    >
      {isRunning ? 'Running Tests...' : 'Run All Tests'}
    </Button>
  );
};

export default TestControls;