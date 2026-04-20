import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { LineChart as ChartIcon, Users, Globe, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import type { RegionalData, Transaction } from '../types';

interface AnalyticsViewProps {
  systemThroughput: number;
  transactions: Transaction[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-white italic">
          {payload[0].name === 'value' ? 'Volume: ' : ''}
          {payload[0].name === 'velocity' ? 'Speed: ' : ''}
          {payload[0].value.toLocaleString()} 
          <span className="text-[10px] text-primary ml-1 font-mono">
            {payload[0].name === 'value' ? 'USD' : 'pts'}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsView({ systemThroughput, transactions }: AnalyticsViewProps) {
  const [range, setRange] = useState('7D');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsRefreshing(true);
    const timer = setTimeout(() => setIsRefreshing(false), 600);
    return () => clearTimeout(timer);
  }, [range]);

  // Grounding regional data in transaction history for realism
  const regionalData: RegionalData[] = useMemo(() => {
    const weights: Record<string, number> = { EMEA: 0.4, APAC: 0.3, AMER: 0.2, LATAM: 0.1 };
    const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0) || 1240500;
    
    return [
      { region: 'EMEA', value: Math.floor(totalVolume * (weights.EMEA + Math.random() * 0.05)), color: '#0052FF' },
      { region: 'APAC', value: Math.floor(totalVolume * (weights.APAC + Math.random() * 0.05)), color: '#32E36A' },
      { region: 'AMER', value: Math.floor(totalVolume * (weights.AMER + Math.random() * 0.05)), color: '#FFB800' },
      { region: 'LATAM', value: Math.floor(totalVolume * (weights.LATAM + Math.random() * 0.05)), color: '#FF4D4D' },
    ];
  }, [range, transactions]);

  const kycData = useMemo(() => {
    const points = range === '24H' ? 12 : (range === '7D' ? 7 : 12);
    const seed = range.charCodeAt(0); // Deterministic-ish based on range
    return Array.from({ length: points }, (_, i) => ({
      time: range === '24H' ? `${i * 2}:00` : `Day ${i + 1}`,
      velocity: 65 + (Math.sin(i + seed) * 15) + (systemThroughput % 10),
      target: 80
    }));
  }, [range, systemThroughput]);

  const ranges = ['24H', '7D', '30D', '90D'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface uppercase italic tracking-tighter">System Analytics</h2>
          <p className="text-xs font-bold text-secondary uppercase tracking-[0.15em] mt-1 opacity-60">High-Density Multi-Node Performance Audit</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm ring-1 ring-black/5">
          {ranges.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all relative overflow-hidden",
                range === r ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-secondary hover:text-on-surface"
              )}
            >
              <span className="relative z-10">{r}</span>
              {range === r && (
                <motion.div 
                  layoutId="activeRange" 
                  className="absolute inset-0 bg-primary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regional Density */}
        <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 space-y-10 group relative transition-all hover:shadow-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase italic tracking-tight text-on-surface">Regional Settlement Density</h3>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                   <p className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60">Global Distribution Audit</p>
                </div>
              </div>
            </div>
            <div className={cn("transition-all duration-500", isRefreshing ? "animate-spin text-primary" : "text-slate-300 opacity-40")}>
               <RefreshCw className="w-5 h-5" />
            </div>
          </div>

          <div className="h-[300px] w-full relative">
            <AnimatePresence>
              {isRefreshing && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center"
                >
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-10 bg-slate-100 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-10 bg-slate-100 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                      <div className="w-1.5 h-10 bg-slate-100 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} layout="vertical" margin={{ left: -30, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="region" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc', radius: 12 }} content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={28} animationDuration={1000}>
                  {regionalData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 bg-slate-50/80 rounded-[2rem] flex items-start gap-4 border border-slate-100">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-[11px] font-bold text-secondary uppercase leading-relaxed tracking-tight group-hover:text-on-surface transition-colors">
              Node <span className="text-primary font-black italic">EMEA-CORRIDOR-01</span> is handling peak volume. AMER synchronization latency is within 4ms baseline. APAC node remains optimal.
            </p>
          </div>
        </section>

        {/* KYC Velocity */}
        <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 space-y-10 group relative transition-all hover:shadow-tertiary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-[1.25rem] bg-tertiary/10 flex items-center justify-center text-tertiary shadow-inner">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase italic tracking-tight text-on-surface">KYC Velocity Index</h3>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                   <p className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60">Verification Efficiency Matrix</p>
                </div>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-tertiary/10 text-tertiary rounded-xl text-[10px] font-black uppercase tracking-widest border border-tertiary/20">
              +14.2% Efcy
            </div>
          </div>

          <div className="h-[300px] w-full relative">
            <AnimatePresence>
              {isRefreshing && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center"
                >
                   <div className="flex items-center gap-2">
                       <RefreshCw className="w-8 h-8 text-slate-200 animate-spin" />
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kycData} margin={{ right: 20 }}>
                <defs>
                  <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#32E36A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#32E36A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} domain={[40, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="velocity" 
                  stroke="#32E36A" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorVelocity)" 
                  animationDuration={1200}
                />
                <Area 
                  type="step" 
                  dataKey="target" 
                  stroke="#cbd5e1" 
                  strokeDasharray="8 8" 
                  fill="transparent"
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 bg-tertiary/5 rounded-[2rem] flex items-start gap-4 border border-tertiary/10">
            <Zap className="w-5 h-5 text-tertiary mt-0.5 flex-shrink-0" />
            <p className="text-[11px] font-bold text-secondary uppercase leading-relaxed tracking-tight group-hover:text-on-surface transition-colors">
              AI-Augmented KYC processing has reduced friction by <span className="text-tertiary font-black italic">8.4%</span> since the last synchronization cycle. Compliance nodes report zero bottlenecks.
            </p>
          </div>
        </section>
      </div>

      <footer className="p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -skew-x-12 translate-x-full group-hover:translate-x-[-200%] pointer-events-none" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-2xl">
            <Zap className="w-10 h-10 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2 italic">Intelligence Insights</h4>
            <p className="text-xl font-black italic tracking-tighter leading-snug max-w-xl text-white/90">
              Overall system integrity is <span className="text-primary font-black underline underline-offset-8 decoration-4">99.98%</span>. Node metrics confirm optimal settlement throughput across all active high-frequency corridors.
            </p>
          </div>
        </div>
        <button className="px-12 py-6 bg-white text-slate-900 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.25em] shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3 active:bg-slate-50">
          Sync Persistence Audit
          <RefreshCw className="w-4 h-4" />
        </button>
      </footer>
    </motion.div>
  );
}
