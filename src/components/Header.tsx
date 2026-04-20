import { Search, Bell, History, CircleHelp, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { AppNotification } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notifications: AppNotification[];
  clearNotifications: () => void;
  onOpenHistory: () => void;
  onOpenHelp: () => void;
}

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  notifications, 
  clearNotifications,
  onOpenHistory,
  onOpenHelp
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [utcTime, setUtcTime] = useState(new Date().toUTCString().split(' ')[4]);

  useEffect(() => {
    const timer = setInterval(() => {
      setUtcTime(new Date().toUTCString().split(' ')[4]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 border-b border-surface-container-highest/50 shadow-sm transition-all duration-300">
      <div className="flex-1 max-w-md relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search global ledgers..."
          className="w-full pl-10 pr-4 py-2.5 bg-surface-variant/40 border-0 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-secondary/60 transition-all focus:bg-white"
        />
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
          <Clock className="w-3.5 h-3.5 text-secondary" />
          <span className="text-[10px] font-black text-on-surface font-mono tracking-tighter">
            {utcTime} <span className="opacity-40">UTC</span>
          </span>
        </div>

        <div className="flex items-center gap-2 border-r border-slate-200 pr-5">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-secondary hover:text-primary transition-all relative p-2.5 rounded-xl hover:bg-white active:scale-95 group/bell"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-slate-50 group-hover/bell:scale-110 transition-transform"></span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowNotifications(false)}
                    className="fixed inset-0 z-10"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-20 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                      <h4 className="text-[10px] font-black text-on-surface uppercase tracking-widest italic">Recent Events</h4>
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearNotifications}
                          className="text-[9px] font-black text-primary uppercase hover:underline"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div key={n.id} className="p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                            <div className="flex gap-3">
                              <div className={`mt-0.5 ${n.type === 'success' ? 'text-tertiary' : (n.type === 'alert' ? 'text-error' : 'text-primary')}`}>
                                {n.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-[11px] font-bold text-on-surface leading-normal">{n.text}</p>
                                <p className="text-[9px] font-black text-secondary uppercase opacity-50 mt-1">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center">
                          <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] opacity-40">No pending alerts</p>
                        </div>
                      )}
                    </div>
                    <button className="w-full py-3 text-[10px] font-black text-secondary uppercase tracking-widest hover:bg-slate-50 transition-colors">
                      View All Alerts
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={onOpenHistory}
            className="text-secondary hover:text-primary transition-all p-2.5 rounded-xl hover:bg-white active:scale-95"
          >
            <History className="w-5 h-5" />
          </button>
          <button 
            onClick={onOpenHelp}
            className="text-secondary hover:text-primary transition-all p-2.5 rounded-xl hover:bg-white active:scale-95"
          >
            <CircleHelp className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-on-surface italic">Alex Thompson</p>
            <p className="text-[9px] font-black text-secondary uppercase tracking-tighter opacity-70">Chief Financial Officer</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary-fixed overflow-hidden ring-2 ring-white shadow-md cursor-pointer hover:ring-primary/20 transition-all active:scale-95">
            <img
              src="https://picsum.photos/seed/executive_alex/100/100"
              alt="CFO Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

