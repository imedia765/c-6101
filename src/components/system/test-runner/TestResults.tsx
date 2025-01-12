import { Badge } from "@/components/ui/badge";
import TestResultsTable from './TestResultsTable';
import MetricCard from '@/components/MetricCard';

interface TestResultsProps {
  results: any[];
}

const TestResults = ({ results }: TestResultsProps) => {
  if (!results.length) return null;

  // Group results by test type
  const performanceMetrics = results.filter(r => 
    r.test_type === 'performance' || 
    r.test_type === 'monitoring'
  );

  const systemChecks = results.filter(r => 
    r.test_type === 'system' || 
    r.test_type === 'security'
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-dashboard-text">Test Results</h3>
        <Badge 
          variant="outline" 
          className="bg-dashboard-accent3/10 text-dashboard-accent3 border-dashboard-accent3/20"
        >
          {results.length} Tests Completed
        </Badge>
      </div>

      {performanceMetrics.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-dashboard-text">Performance Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceMetrics.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.metric_name}
                value={Number(metric.current_value.toFixed(2))}
                color={metric.status === 'Good' ? '#22c55e' : metric.status === 'Warning' ? '#f59e0b' : '#ef4444'}
                threshold={metric.threshold}
                details={metric.details ? JSON.stringify(metric.details, null, 2) : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {systemChecks.length > 0 && (
        <div className="glass-card p-4 rounded-lg border border-dashboard-cardBorder bg-dashboard-card/50">
          <TestResultsTable 
            results={systemChecks} 
            type={systemChecks[0]?.test_type || 'system'} 
          />
        </div>
      )}
    </div>
  );
};

export default TestResults;