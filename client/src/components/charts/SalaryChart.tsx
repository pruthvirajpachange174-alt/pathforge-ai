/** Renders the Salary Chart interface component. */
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';

export function SalaryChart({ data }: { data: { name: string; salary: number }[] }) {
  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-sm font-display mb-3">Salary Range (LPA)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: '#0a0a0f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
            }}
          />
          <Bar dataKey="salary" radius={[8, 8, 0, 0]} fill="url(#g2)" />
          <defs>
            <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}