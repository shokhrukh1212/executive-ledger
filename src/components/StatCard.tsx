import { type LucideIcon, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, useSpring, useTransform, animate } from 'motion/react';
import { useEffect, useState } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral' | 'urgent';
  icon?: LucideIcon;
  subtext: string;
}

function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1,
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString(undefined, { 
        minimumFractionDigits: prefix ? 2 : 0, 
        maximumFractionDigits: prefix ? 2 : 0 
      })}
    </span>
  );
}

export default function StatCard({ label, value, prefix, trend, trendType, icon: Icon, subtext }: StatCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container/50 relative overflow-hidden group cursor-default"
    >
      <div className="relative z-10 flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary">{label}</span>
        <div className="text-3xl font-black tracking-tighter text-on-surface my-1 italic">
          <AnimatedNumber value={value} prefix={prefix} />
        </div>
        
        <div className="flex items-center gap-2">
          {trendType === 'positive' && <TrendingUp className="w-4 h-4 text-tertiary" />}
          {trendType === 'negative' && <TrendingDown className="w-4 h-4 text-error" />}
          {trendType === 'urgent' && <AlertCircle className="w-4 h-4 text-error" />}
          
          <span className={cn(
            "text-xs font-bold tracking-tight",
            trendType === 'positive' && "text-tertiary",
            trendType === 'negative' && "text-error",
            trendType === 'urgent' && "text-error",
            trendType === 'neutral' && "text-secondary",
            !trendType && "text-secondary"
          )}>
            {trend} {subtext}
          </span>
        </div>
      </div>

      {Icon && (
        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500">
          <Icon className="w-32 h-32 text-primary" strokeWidth={1} />
        </div>
      )}
      
      <div className="absolute top-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.div>
  );
}
