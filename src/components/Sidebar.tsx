import { LayoutDashboard, ReceiptText, LineChart, Settings, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onGenerateReport: () => void;
  isGenerating: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, onGenerateReport, isGenerating }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-900 z-50 flex flex-col py-8 px-6 text-white hidden md:flex shadow-2xl">
      <div className="mb-12 px-2 transition-all duration-300 group cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-12 transition-all">
            <span className="font-black text-xl italic uppercase tracking-tighter">EL</span>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white uppercase italic group-hover:text-primary transition-colors leading-tight">Executive Ledger</h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Ops Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all group relative",
              activeTab === item.id 
                ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform group-hover:scale-110",
              activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-primary"
            )} />
            {item.label}
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-indicator" 
                className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" 
              />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-8">
        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 group cursor-pointer hover:bg-white/[0.07] transition-all">
          <button 
            onClick={onGenerateReport}
            disabled={isGenerating}
            className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all hover:scale-[0.98] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <Download className="w-3 h-3" />
                </motion.div>
                Processing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                Generate Report
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden shadow-lg">
            <img src="https://picsum.photos/seed/executive_alex/100/100" alt="" referrerPolicy="no-referrer" />
          </div>
          <div>
            <p className="text-[10px] font-black italic tracking-tight text-white">Alex Thompson</p>
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">CFO • Admin Node</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
