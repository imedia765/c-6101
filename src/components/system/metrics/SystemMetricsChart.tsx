import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface MetricData {
  recorded_at: string;
  metric_name: string;
  metric_value: number;
  category: string;
}

const SystemMetricsChart = () => {
  const { data: metricsData, isLoading } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_system_metrics_history');
      if (error) throw error;
      return data as MetricData[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>System Metrics History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={metricsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="recorded_at"
                stroke="#828179"
                tick={{ fill: '#828179', fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis
                stroke="#828179"
                tick={{ fill: '#828179', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="metric_value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemMetricsChart;