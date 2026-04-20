import { Search, Filter, ChevronLeft, ChevronRight, ExternalLink, Sparkles, XCircle } from 'lucide-react';
import type { Transaction } from '../types';
import { cn } from '../lib/utils';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TransactionsTableProps {
  transactions: Transaction[];
  onSelect: (transaction: Transaction) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export default function TransactionsTable({ 
  transactions, 
  onSelect, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter 
}: TransactionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return transactions.slice(start, start + itemsPerPage);
  }, [transactions, currentPage]);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const statuses = ["All", "Successful", "Pending", "Failed"];

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
  };

  return (
    <section className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
      <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-50">
        <div>
          <h2 className="text-xl font-black text-on-surface tracking-tighter italic uppercase">Live Transactions</h2>
          <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.1em] mt-1 opacity-60">Settlement Monitoring System</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by ID or company..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-xs font-bold border-0 focus:ring-2 focus:ring-primary/20 outline-none transition-all focus:bg-white"
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-4 py-2 text-[10px] font-black rounded-lg transition-all",
                  statusFilter === s ? "bg-white text-primary shadow-sm" : "text-secondary hover:text-on-surface"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[450px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
              <th className="px-8 py-5">TX ID</th>
              <th className="px-8 py-5">Recipient / Sender</th>
              <th className="px-8 py-5 text-right">Settlement Amount</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Execution Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout" initial={false}>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((trx) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    key={trx.id}
                    onClick={() => onSelect(trx)}
                    className={cn(
                      "hover:bg-primary/[0.02] transition-all cursor-pointer group",
                      trx.isNew && "bg-primary/[0.04]"
                    )}
                  >
                    <td className="px-8 py-6 text-[11px] font-black font-mono text-secondary group-hover:text-primary transition-colors flex items-center gap-2">
                      {trx.id}
                      {trx.isNew && <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-on-surface italic">{trx.customer}</span>
                        <span className="text-[10px] font-bold text-secondary uppercase opacity-60">{trx.customerEmail}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-sm font-black font-mono text-on-surface tracking-tighter">
                        ${trx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ring-inset",
                        trx.status === 'Successful' && "bg-tertiary/10 text-tertiary ring-tertiary/20",
                        trx.status === 'Pending' && "bg-slate-100 text-secondary ring-slate-200",
                        trx.status === 'Failed' && "bg-error/10 text-error ring-error/20"
                      )}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-secondary uppercase tracking-tight">{trx.dateTime}</span>
                        <ExternalLink className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td colSpan={5}>
                    <div className="h-96 flex flex-col items-center justify-center text-center p-8">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-8 h-8 text-slate-200" />
                      </div>
                      <h3 className="text-lg font-black text-on-surface italic uppercase tracking-tight">No Settlement Records</h3>
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest mt-2 max-w-[240px] leading-relaxed mx-auto">
                        Your filter parameters yielded zero matches in the current ledger perspective.
                      </p>
                      <button 
                        onClick={handleClearFilters}
                        className="mt-6 flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                      >
                        <XCircle className="w-4 h-4" />
                        Reset Perspective
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="p-8 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-50">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
            Audit Range: <span className="text-on-surface">{Math.min((currentPage-1)*itemsPerPage + 1, transactions.length)} - {Math.min(currentPage*itemsPerPage, transactions.length)}</span> of {transactions.length} Verified Entries
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-secondary hover:text-primary disabled:opacity-30 transition-all hover:shadow-md active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all",
                    page === currentPage 
                      ? "bg-primary text-white shadow-xl shadow-primary/30" 
                      : "bg-white border border-slate-100 text-secondary hover:bg-slate-50"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-secondary hover:text-primary disabled:opacity-30 transition-all hover:shadow-md active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

