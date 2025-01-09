import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const data = [
  { subject: 'North America', value: 85 },
  { subject: 'South America', value: 75 },
  { subject: 'Europe', value: 65 },
  { subject: 'Asia', value: 80 },
  { subject: 'Australia', value: 70 },
];

const CustomerRequests = () => {
  return (
    <div className="dashboard-card h-[400px]">
      <h2 className="text-xl font-medium mb-6">Customer Requests</h2>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" stroke="#828179" />
          <Radar
            name="Value"
            dataKey="value"
            stroke="#61AAF2"
            fill="#61AAF2"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerRequests;