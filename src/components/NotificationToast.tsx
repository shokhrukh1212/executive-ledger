import { BellRing, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Transaction } from '../types';

interface NotificationToastProps {
  isVisible: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function NotificationToast({ isVisible, onClose, transaction }: NotificationToastProps) {
  if (!transaction) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          className="fixed bottom-8 right-8 bg-white/95 backdrop-blur-xl border border-primary/20 p-5 rounded-2xl shadow-2xl flex items-start gap-5 z-[110] w-80 ring-1 ring-black/5"
        >
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30 relative">
            <BellRing className="text-white w-6 h-6 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary rounded-full border-2 border-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-xs font-black text-on-surface uppercase tracking-widest italic">Live Intelligence</h4>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-on-surface transition-colors -mt-1 -mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-[10px] font-bold text-secondary uppercase leading-relaxed mt-2 italic">
              New Ledger Entry: <span className="text-primary">+${transaction.amount.toLocaleString()}</span>
            </p>
            <p className="text-[9px] font-black text-secondary tracking-widest mt-1 uppercase opacity-60">
              Sender: {transaction.customer}
            </p>
            
            <div className="flex items-center gap-1 text-[9px] font-black text-tertiary mt-3 group cursor-pointer">
              VIEW DETAILED AUDIT
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

