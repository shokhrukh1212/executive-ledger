import { X, CheckCircle2, Download, RefreshCw, Copy, Mail, ShieldCheck, Check } from 'lucide-react';
import type { Transaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useCallback } from 'react';

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export default function TransactionModal({ transaction, onClose }: TransactionModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const copyToClipboard = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const handleAction = useCallback((action: string) => {
    setIsProcessing(action);
    setTimeout(() => {
      setIsProcessing(null);
      if (action === 'reverse') setShowConfirm(false);
      onClose();
    }, 2000);
  }, [onClose]);

  if (!transaction) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-on-surface/40 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col relative z-10"
        >
          {showConfirm ? (
            <div className="p-12 text-center space-y-6">
              <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
                <RefreshCw className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-on-surface uppercase italic italic">Confirm Reversal?</h3>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest max-w-xs mx-auto">
                  This action is permanent and will initiate a protocol-level settlement rollback.
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-on-surface rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleAction('reverse')}
                  disabled={!!isProcessing}
                  className="flex-1 px-6 py-3 bg-error text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-error/90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing === 'reverse' ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirm Rollback'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="px-8 py-6 border-b border-surface-container-highest/30 flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-xl font-black text-on-surface italic tracking-tight italic">Settlement Review</h3>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-0.5">Audit Trail #{transaction.id}</p>
                </div>
                <button 
                  onClick={onClose}
                  className="text-secondary hover:bg-slate-100 p-2 rounded-full transition-all active:scale-95"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 bg-slate-50/30 flex-1 overflow-y-auto space-y-8">
                <div className="text-center py-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="text-5xl font-black text-on-surface tracking-tighter mb-4 italic">
                    ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black bg-tertiary/10 text-tertiary gap-2 uppercase tracking-widest ring-1 ring-tertiary/20">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified & Settled
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60">Settlement ID</span>
                    <button 
                      onClick={() => copyToClipboard(transaction.id, 'id')}
                      className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1 -ml-2 rounded-lg transition-colors group"
                    >
                      <p className="font-mono text-on-surface font-black">{transaction.id}</p>
                      {copiedField === 'id' ? <Check className="w-3 h-3 text-tertiary" /> : <Copy className="w-3 h-3 text-slate-300 group-hover:text-primary" />}
                    </button>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60">Timestamp</span>
                    <p className="text-on-surface font-black italic">{transaction.dateTime} UTC</p>
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60">Beneficiary Information</span>
                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg shadow-sm">
                        {transaction.customer.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-on-surface italic text-base leading-tight">{transaction.customer}</div>
                        <div className="text-xs font-bold text-secondary uppercase opacity-60 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {transaction.customerEmail}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60">Blockchain Ledger Hash</span>
                      <div className="flex items-center gap-1 text-tertiary text-[10px] font-black bg-tertiary/5 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        Immutable Record
                      </div>
                    </div>
                    <div 
                      onClick={() => copyToClipboard(transaction.hash, 'hash')}
                      className="bg-slate-900 p-4 rounded-2xl font-mono text-[10px] text-slate-400 break-all leading-relaxed relative group border-l-4 border-primary cursor-pointer hover:bg-slate-800 transition-colors"
                    >
                      {transaction.hash}
                      <div className="absolute right-3 top-3">
                        {copiedField === 'hash' ? <Check className="w-4 h-4 text-tertiary" /> : <Copy className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60">Accounting Reconciliation</span>
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                    <div className="flex justify-between text-secondary font-bold text-xs uppercase tracking-tight">
                      <span>Principal Asset Value</span>
                      <span className="font-black text-on-surface">${(transaction.amount * 0.996).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-secondary font-bold text-xs uppercase tracking-tight">
                      <span>Protocol Servicing Fee</span>
                      <span className="font-black text-on-surface">${(transaction.amount * 0.004).toLocaleString()}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="font-black text-on-surface uppercase text-xs tracking-widest italic">Total Settled</span>
                      <span className="font-black text-primary text-xl tracking-tighter">${transaction.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-5 bg-white border-t border-slate-100 flex justify-end gap-4">
                <button 
                  onClick={() => handleAction('manifest')}
                  disabled={!!isProcessing}
                  className="px-6 py-2.5 bg-slate-100 text-on-surface-variant rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2 min-w-[140px] justify-center"
                >
                  {isProcessing === 'manifest' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4" /> Manifest</>}
                </button>
                <button 
                  onClick={() => setShowConfirm(true)}
                  disabled={!!isProcessing}
                  className="px-6 py-2.5 bg-error text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-error/90 transition-all shadow-lg shadow-error/20 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reverse Settlement
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

