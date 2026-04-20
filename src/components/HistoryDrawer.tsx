import { History, X, Clock, User, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { HistoryEvent } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  events: HistoryEvent[];
}

export default function HistoryDrawer({ isOpen, onClose, events }: HistoryDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-black text-on-surface uppercase tracking-widest italic">Operational Audit</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors border border-transparent hover:border-slate-300"
              >
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-xs font-black text-on-surface uppercase tracking-tight">{event.action}</p>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-secondary uppercase opacity-60">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {event.user}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <History className="w-12 h-12 text-slate-100 mb-4" />
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-40">No audit records found</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 mt-auto">
              <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] text-center opacity-40 italic">
                Authorized Ledger Access Only • UTC Persistence Enabled
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
