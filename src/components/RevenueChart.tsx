import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueData } from '../types';

interface RevenueChartProps {
  data: RevenueData[];
  range: string;
  setRange: (range: string) => void;
}

export default function RevenueChart({ data, range, setRange }: RevenueChartProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-surface-container/50 min-h-[440px]">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-xl font-black text-on-surface tracking-tighter uppercase italic">Revenue over Time</h2>
          <p className="text-xs font-bold text-secondary tracking-widest uppercase mt-0.5 opacity-60">Global Settlement Performance</p>
        </div>
        <div className="flex gap-2 bg-surface-container-low p-1 rounded-xl">
          {['1D', '1W', '1M', '1Y'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                range === r 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#003ec7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#003ec7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
              dy={15}
            />
            <YAxis 
              hide 
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                padding: '12px 16px'
              }}
              labelStyle={{ fontWeight: 900, marginBottom: '4px', color: '#111827', fontSize: '10px', textTransform: 'uppercase' }}
              itemStyle={{ fontWeight: 700, fontSize: '14px', color: '#003ec7' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#003ec7"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
