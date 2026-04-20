/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import TransactionsTable from './components/TransactionsTable';
import TransactionModal from './components/TransactionModal';
import NotificationToast from './components/NotificationToast';
import HistoryDrawer from './components/HistoryDrawer';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import { LayoutDashboard, ReceiptText as ReceiptIcon, Users, Wallet, Settings as SettingsIcon, LineChart as ChartIcon, ShieldCheck, Mail, Database } from 'lucide-react';
import type { Transaction, RevenueData, KPIStats, AppNotification, HistoryEvent, SettingsState } from './types';
import { motion, AnimatePresence } from 'motion/react';

// Helper for generating realistic transactions
const generateTransaction = (isInitial = false): Transaction => {
  const companies = ["Acme Corp Ltd.", "Stark Industries", "Wayne Enterprises", "Global Tech Solutions", "Jane Doe Investments", "Cyberdyne Systems", "Umbrella Corp", "Oscorp", "Gringotts Bank", "Hogwarts Treasury"];
  const company = companies[Math.floor(Math.random() * companies.length)];
  const amount = Math.floor(Math.random() * 85000) + 1000;
  const id = `TRX-${Math.floor(Math.random() * 9000) + 1000}`;
  const now = new Date();
  
  return {
    id,
    customer: company,
    customerEmail: `${company.toLowerCase().replace(/\s/g, '.').replace(/[^a-z.]/g, '')}@settle.com`,
    amount,
    status: Math.random() > 0.05 ? 'Successful' : (Math.random() > 0.6 ? 'Pending' : 'Failed'),
    dateTime: isInitial 
      ? `Today, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
      : `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`,
    hash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    isNew: !isInitial
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [latestTransaction, setLatestTransaction] = useState<Transaction | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Operational States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [chartRange, setChartRange] = useState("1M");
  const [systemThroughput, setSystemThroughput] = useState(12450); // Shared state for analytics
  
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: '1', type: 'success', text: 'System initialized successfully.', time: 'Just now' },
    { id: '2', type: 'info', text: 'Oracle handshake complete.', time: '1m ago' }
  ]);
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([
    { id: 'h1', action: 'System Login', user: 'Alex Thompson', timestamp: 'Today, 08:00' },
    { id: 'h2', action: 'Data Synchronization', user: 'System', timestamp: 'Today, 08:05' }
  ]);

  // Core Data States
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<KPIStats>({
    totalBalance: 1240500,
    transactionsToday: 1432,
    pendingKyc: 42,
    revenue: 84200.50
  });

  // Analytics Visualization
  const revenueData = useMemo(() => {
    const counts = { '1D': 24, '1W': 7, '1M': 6, '1Y': 12 };
    const count = counts[chartRange as keyof typeof counts] || 6;
    return Array.from({ length: count }, (_, i) => ({
      time: chartRange === '1D' ? `${i}:00` : (chartRange === '1W' ? `Day ${i+1}` : (chartRange === '1Y' ? `Month ${i+1}` : `Week ${i+1}`)),
      revenue: Math.floor(Math.random() * 40000) + 40000
    }));
  }, [chartRange]);

  // Initial Load Simulation
  useEffect(() => {
    const initialTransactions = Array.from({ length: 8 }, () => generateTransaction(true));
    setTransactions(initialTransactions);
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  // System Runtime Clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-time Simulation Engine - More realistic pacing
  useEffect(() => {
    const triggerSimulation = () => {
      const isSuccessful = Math.random() > 0.2;
      const newTrx = generateTransaction();
      
      setTransactions(prev => [newTrx, ...prev].slice(0, 20));
      
      if (newTrx.status === 'Successful' && isSuccessful) {
        setStats(prev => ({
          ...prev,
          totalBalance: prev.totalBalance + newTrx.amount,
          revenue: prev.revenue + (newTrx.amount * 0.004),
          transactionsToday: prev.transactionsToday + 1
        }));
        
        setSystemThroughput(prev => prev + 1); // Influence Analytics

        const newNotif: AppNotification = {
          id: Math.random().toString(36),
          type: 'success',
          text: `Settlement ${newTrx.id} protocol verified.`,
          time: 'Just now'
        };
        setNotifications(prev => [newNotif, ...prev]);
        setLatestTransaction(newTrx);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 6000);
      }

      // Cleanup highlight
      setTimeout(() => {
        setTransactions(prev => prev.map(t => t.id === newTrx.id ? { ...t, isNew: false } : t));
      }, 8000);

      // Recursive random scheduling for realism
      const nextDelay = Math.floor(Math.random() * 20000) + 15000;
      setTimeout(triggerSimulation, nextDelay);
    };

    const initialTimeout = setTimeout(triggerSimulation, 10000);
    return () => clearTimeout(initialTimeout);
  }, []);

  // Action Handlers
  const handleGenerateReport = useCallback(() => {
    setIsGeneratingReport(true);
    const event: HistoryEvent = {
      id: Math.random().toString(36),
      action: 'Report Generation Initialized',
      user: 'Alex Thompson',
      timestamp: 'Today, ' + new Date().getHours() + ':' + new Date().getMinutes().toString().padStart(2, '0')
    };
    setHistoryEvents(prev => [event, ...prev]);
    setTimeout(() => setIsGeneratingReport(false), 3000);
  }, []);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(trx => {
      const matchesSearch = trx.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           trx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trx.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || trx.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-20 w-20 border-[6px] border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-black italic text-xl">EL</span>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-xs font-black text-white uppercase tracking-[0.4em] animate-pulse">Node Authentication...</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bridging Financial Oracle Handshake</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary/20">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onGenerateReport={handleGenerateReport}
        isGenerating={isGeneratingReport}
      />
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notifications={notifications}
        clearNotifications={() => setNotifications([])}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHelp={() => {}}
      />
      
      <main className="ml-0 md:ml-64 pt-24 pb-20 px-8 transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* Dashboard Header */}
                <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 overflow-hidden">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                      <span className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase opacity-70">Strategic Analytics Command</span>
                    </div>
                    <h1 className="text-4xl font-black text-on-surface tracking-tighter italic uppercase">EXECUTIVE OPERATIONS DASHBOARD</h1>
                  </div>
                  <div className="text-right flex items-center gap-4 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] font-black text-secondary tracking-widest uppercase opacity-60">System Runtime</span>
                      <p className="text-sm font-black text-primary font-mono tracking-tighter italic">
                        UTC {currentTime.toISOString().split('T')[1].split('.')[0]}
                      </p>
                    </div>
                  </div>
                </section>

                {/* KPI Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Liquid Capital" value={stats.totalBalance} prefix="$" trend="+12.4%" trendType="positive" icon={Wallet} subtext="MOM Growth" />
                  <StatCard label="Live Throughput" value={stats.transactionsToday} trend="Real-time" trendType="neutral" icon={ReceiptIcon} subtext="Execution Monitoring" />
                  <StatCard label="KYC Compliance" value={stats.pendingKyc} trend="Urgent" trendType="urgent" icon={Users} subtext="Pending Review" />
                  <StatCard label="Net Income" value={stats.revenue} prefix="$" trend="+5.2%" trendType="positive" icon={LayoutDashboard} subtext="Quarterly Yield" />
                </section>

                {/* Primary Visuals */}
                <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2">
                    <RevenueChart data={revenueData} range={chartRange} setRange={setChartRange} />
                  </div>
                  <div className="bg-slate-900 rounded-3xl p-8 flex flex-col justify-between text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
                    <div className="relative z-10">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 italic opacity-80 underline underline-offset-8">Intelligence Brief</h3>
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm font-black italic mb-1 text-primary-fixed flex justify-between">
                            Volatility Index
                            <span className="text-tertiary">74.2</span>
                          </p>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary shadow-[0_0_10px_rgba(0,82,255,0.5)] transition-all duration-1000" style={{ width: `${(currentTime.getSeconds() % 30) + 60}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 mt-12 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Automated Forecast</p>
                      <p className="text-xl font-black italic tracking-tight text-white leading-tight">
                        {currentTime.getSeconds() < 30 ? "Projected settlement volume to increase by 14.8%." : "Real-time liquidity indicates a surplus in cross-border settlements."}
                      </p>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-110">
                      <ReceiptIcon className="w-24 h-24 stroke-[1]" />
                    </div>
                  </div>
                </section>

                {/* Latest Entries */}
                <TransactionsTable 
                  transactions={filteredTransactions} 
                  onSelect={setSelectedTransaction}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                />
              </motion.div>
            )}

            {activeTab === 'transactions' && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black text-on-surface uppercase italic italic">Full Ledger Audit</h2>
                    <p className="text-xs font-bold text-secondary uppercase tracking-widest mt-1 opacity-60">Transactional Persistence History</p>
                  </div>
                </div>
                <TransactionsTable 
                  transactions={filteredTransactions} 
                  onSelect={setSelectedTransaction}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                />
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView systemThroughput={systemThroughput} transactions={transactions} />
            )}

            {activeTab === 'settings' && (
              <SettingsView 
                onSave={(s) => {
                  const newNotif: AppNotification = { id: Date.now().toString(), type: 'info', text: 'System Configuration Updated.', time: 'Just now' };
                  setNotifications(prev => [newNotif, ...prev]);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      <TransactionModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
      <NotificationToast isVisible={showToast} onClose={() => setShowToast(false)} transaction={latestTransaction} />
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} events={historyEvents} />
      
      {/* Global Utility Loading Overlay */}
      <AnimatePresence>
        {isGeneratingReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center"
          >
            <div className="text-center space-y-6">
              <div className="h-16 w-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-black text-white uppercase tracking-[0.3em] italic">Synthesizing Asset Ledger</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compiling Encrypted Operational Audit Manifest</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
