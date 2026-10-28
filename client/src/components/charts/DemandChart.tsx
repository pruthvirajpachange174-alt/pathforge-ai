/** Renders the Demand Chart interface component. */
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function TrendsChart({ data }: { data: { name: string; demand: number }[] }) {
  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-sm font-display mb-3">Industry Demand Trend</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: '#0a0a0f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
            }}
          />
          <Line type="monotone" dataKey="demand" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}