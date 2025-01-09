import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

const MonthlyChart = () => {
  const { data: paymentHistory } = useQuery({
    queryKey: ['paymentHistory'],
    queryFn: async () => {
      console.log('Fetching payment history...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No user logged in');

      // First get the member number from the user metadata
      const { data: { user } } = await supabase.auth.getUser();
      const memberNumber = user?.user_metadata?.member_number;
      
      if (!memberNumber) {
        console.error('No member number found in user metadata');
        throw new Error('Member number not found');
      }

      // Fetch all payments for this member
      const { data: payments, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('member_number', memberNumber)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Generate last 12 months of data
      const months = [];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        // Filter payments for this month
        const monthPayments = payments?.filter(payment => {
          const paymentDate = new Date(payment.created_at);
          return paymentDate >= monthStart && paymentDate <= monthEnd;
        }) || [];

        // Calculate totals for each payment type
        const annualPayment = monthPayments
          .filter(p => p.payment_type === 'Annual Payment' && p.status === 'completed')
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        const emergencyPayment = monthPayments
          .filter(p => p.payment_type === 'Emergency Collection' && p.status === 'completed')
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        
        months.push({
          month: date.toLocaleString('default', { month: 'short' }),
          annualPayment,
          emergencyPayment,
        });
      }

      return months;
    },
  });

  return (
    <div className="dashboard-card h-[400px] transition-all duration-300 hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-dashboard-accent1">Payment History</h2>
      <div className="h-[calc(100%-4rem)] relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={paymentHistory || []} 
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis 
              dataKey="month" 
              stroke="#828179"
              tick={{ fill: '#828179', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              stroke="#828179"
              tick={{ fill: '#828179', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickFormatter={(value) => `£${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#828179', fontWeight: 600, marginBottom: '8px' }}
              itemStyle={{ color: '#C4C3BB', fontSize: '12px' }}
              formatter={(value) => [`£${value}`, '']}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ 
                color: '#828179',
                paddingBottom: '20px',
              }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="annualPayment"
              name="Annual Payment"
              stroke="#8989DE"
              strokeWidth={3}
              dot={{ fill: '#8989DE', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8989DE', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="emergencyPayment"
              name="Emergency Payment"
              stroke="#61AAF2"
              strokeWidth={3}
              dot={{ fill: '#61AAF2', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#61AAF2', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyChart;