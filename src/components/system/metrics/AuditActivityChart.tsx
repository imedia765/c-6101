import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AuditActivity {
  hour_bucket: string;
  operation: string;
  count: number;
}

const AuditActivityChart = () => {
  const { data: auditData, isLoading } = useQuery({
    queryKey: ['audit-activity'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_audit_activity_summary');
      if (error) throw error;
      return data as AuditActivity[];
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
        <CardTitle>Audit Activity Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={auditData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="hour_bucket"
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
              <Bar dataKey="count" name="Operations" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditActivityChart;