import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Mail, Database, Save, RotateCcw, CheckCircle2, AlertCircle, Clock, ArrowRight, Settings2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import type { SettingsState } from '../types';

interface SettingsViewProps {
  onSave: (settings: SettingsState) => void;
}

const INITIAL_SETTINGS: SettingsState = {
  securityProtocol: true,
  alertPreferences: {
    failures: true,
    largeSettlements: false,
    kycReview: true,
    frequency: 'Instant'
  },
  persistence: {
    retentionDays: 90,
    backupFrequency: 'Daily'
  }
};

export default function SettingsView({ onSave }: SettingsViewProps) {
  const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);
  const [savedSettings, setSavedSettings] = useState<SettingsState>(INITIAL_SETTINGS);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: 'Security Handshake Protocol Optimized', type: 'security', time: '2m ago' },
    { id: 2, action: 'Regional Node Routing Manifest Updated', type: 'system', time: '1h ago' },
    { id: 3, action: 'Retention Policy Adjusted: 90 Day Cycle', type: 'data', time: '4h ago' },
  ]);

  const hasChanges = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(savedSettings);
  }, [settings, savedSettings]);

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSavedSettings({ ...settings });
      setSaveStatus('success');
      onSave(settings);
      
      const newAction = settings.securityProtocol !== savedSettings.securityProtocol 
        ? 'Security Protocol State Toggled' 
        : 'System Parameter Commitment';

      setAuditLogs(prev => [
        { id: Date.now(), action: newAction, type: 'commit', time: 'Just now' },
        ...prev
      ]);

      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1800);
  };

  const handleReset = () => {
    setSettings({ ...savedSettings });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-12 pb-32"
    >
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-on-surface uppercase italic tracking-tighter">Node Configuration</h2>
          <p className="text-xs font-bold text-secondary uppercase tracking-[0.15em] mt-1 opacity-60 italic">Hardware-Level Systems & Operational Sovereignty</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">
           <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
           <span className="text-[10px] font-black text-secondary uppercase tracking-widest leading-none">Status: Encrypted Connection</span>
        </div>
      </header>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden divide-y divide-slate-50 transition-all ring-1 ring-black/5">
        {/* Security Protocol */}
        <section className="p-10 hover:bg-slate-50/30 transition-colors group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className={cn(
                "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 shadow-inner",
                settings.securityProtocol ? "bg-primary text-white shadow-xl shadow-primary/30 rotate-3" : "bg-slate-100 text-slate-400"
              )}>
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-black uppercase italic tracking-tight leading-tight text-on-surface">Hardened Security Protocol</p>
                <div className="flex items-center gap-2 mt-1.5">
                   <div className={cn("w-1.5 h-1.5 rounded-full", settings.securityProtocol ? "bg-tertiary" : "bg-slate-300")} />
                   <p className="text-[11px] font-bold text-secondary uppercase opacity-60 tracking-wider">Level 4 Multi-Signature Manifest</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setSettings(s => ({ ...s, securityProtocol: !s.securityProtocol }))}
              className={cn(
                "w-16 h-8 rounded-full transition-all duration-500 relative p-1.5 outline-none ring-offset-2 focus:ring-4 focus:ring-primary/20",
                settings.securityProtocol ? "bg-primary" : "bg-slate-200"
              )}
            >
              <motion.div 
                animate={{ x: settings.securityProtocol ? 32 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow-lg" 
              />
            </button>
          </div>
        </section>

        {/* Alert Preferences */}
        <section className="p-10 hover:bg-slate-50/30 transition-colors group">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setExpandedSection(expandedSection === 'alerts' ? null : 'alerts')}
          >
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-[1.5rem] bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:bg-tertiary group-hover:text-white transition-all duration-500 shadow-inner">
                <Mail className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-black uppercase italic tracking-tight leading-tight text-on-surface">Intelligence Alert Mesh</p>
                <p className="text-[11px] font-bold text-secondary uppercase opacity-60 mt-1.5 tracking-wider">Configure high-priority notification corridors</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex -space-x-2">
                 <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white" />
                 <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                 <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                <ArrowRight className={cn("w-5 h-5 text-slate-400 transition-transform duration-500 group-hover:text-primary", expandedSection === 'alerts' && "rotate-90")} />
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {expandedSection === 'alerts' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12 pt-10 border-t border-slate-50">
                  {[
                    { key: 'failures', label: 'Protocol Disruptions', sub: 'Critical failover & node drops' },
                    { key: 'largeSettlements', label: 'Whale Capital Alerts', sub: 'Values exceeding institutional cap' },
                    { key: 'kycReview', label: 'Compliance Red-Flags', sub: 'Urgent biometric verification' },
                  ].map(item => (
                    <motion.div 
                      key={item.key} 
                      whileHover={{ scale: 1.01 }}
                      className="p-6 bg-slate-50/50 rounded-[1.75rem] flex items-center justify-between group/item hover:bg-white border border-transparent hover:border-slate-100 transition-all shadow-sm"
                    >
                      <div>
                        <p className="text-[12px] font-black uppercase italic text-on-surface">{item.label}</p>
                        <p className="text-[10px] font-bold text-secondary uppercase opacity-50 mt-0.5 tracking-tight">{item.sub}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSettings(s => ({ ...s, alertPreferences: { ...s.alertPreferences, [item.key]: !s.alertPreferences[item.key as keyof typeof s.alertPreferences] } }));
                        }}
                        className={cn(
                          "w-10 h-5 rounded-full relative transition-all duration-300",
                          settings.alertPreferences[item.key as keyof typeof settings.alertPreferences] ? "bg-tertiary" : "bg-slate-200"
                        )}
                      >
                        <motion.div 
                          animate={{ x: settings.alertPreferences[item.key as keyof typeof settings.alertPreferences] ? 20 : 0 }}
                          className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 left-0.75 shadow-sm" 
                        />
                      </button>
                    </motion.div>
                  ))}
                  
                  <div className="p-6 bg-slate-900 rounded-[1.75rem] flex items-center justify-between md:col-span-2 shadow-xl shadow-slate-900/10">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <Settings2 className="w-5 h-5 text-primary" />
                       </div>
                       <div>
                          <p className="text-[12px] font-black uppercase italic text-white">Verification Refresh Delta</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase opacity-70 mt-0.5 tracking-tight">System heartbeat polling interval</p>
                       </div>
                    </div>
                    <select 
                      value={settings.alertPreferences.frequency}
                      onChange={(e) => setSettings(s => ({ ...s, alertPreferences: { ...s.alertPreferences, frequency: e.target.value as any } }))}
                      className="bg-white/10 border-0 text-[11px] font-black uppercase tracking-widest px-5 py-3 rounded-xl text-white focus:ring-4 focus:ring-primary/20 outline-none cursor-pointer hover:bg-white/20 transition-all"
                    >
                      {['Instant', 'Daily', 'Weekly'].map(f => <option key={f} value={f} className="text-slate-900">{f} Frequency</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Data Persistence */}
        <section className="p-10 hover:bg-slate-50/30 transition-colors group">
          <div 
             className="flex items-center justify-between cursor-pointer"
             onClick={() => setExpandedSection(expandedSection === 'data' ? null : 'data')}
          >
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 text-on-surface flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                <Database className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-black uppercase italic tracking-tight leading-tight text-on-surface">Audit Trail Persistence</p>
                <p className="text-[11px] font-bold text-secondary uppercase opacity-60 mt-1.5 tracking-wider">Configure historical nodes & deep-storage retention</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <span className="px-5 py-2.5 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-secondary group-hover:bg-primary/5 group-hover:text-primary transition-all border border-transparent group-hover:border-primary/20">
                 {settings.persistence.retentionDays} Day Buffer
               </span>
               <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                <ArrowRight className={cn("w-5 h-5 text-slate-400 transition-transform duration-500 group-hover:text-primary", expandedSection === 'data' && "rotate-90")} />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {expandedSection === 'data' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-10 border-t border-slate-50">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary ml-1 italic">Retention Timeline</label>
                    <div className="flex gap-3">
                    {[30, 90, 365].map(d => (
                      <button
                        key={d}
                        onClick={() => setSettings(s => ({ ...s, persistence: { ...s.persistence, retentionDays: d } }))}
                        className={cn(
                          "flex-1 py-4 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-sm ring-1",
                          settings.persistence.retentionDays === d 
                            ? "bg-primary text-white ring-primary shadow-xl shadow-primary/20" 
                            : "bg-white text-secondary ring-slate-100 hover:ring-slate-300 hover:bg-slate-50"
                        )}
                      >
                        {d}D Node
                      </button>
                    ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary ml-1 italic">Backup Sequence</label>
                    <div className="flex gap-3">
                    {['Hourly', 'Daily'].map(f => (
                      <button
                        key={f}
                        onClick={() => setSettings(s => ({ ...s, persistence: { ...s.persistence, backupFrequency: f as any } }))}
                        className={cn(
                          "flex-1 py-4 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-sm ring-1",
                          settings.persistence.backupFrequency === f 
                            ? "bg-on-surface text-white ring-on-surface shadow-xl shadow-on-surface/20" 
                            : "bg-white text-secondary ring-slate-100 hover:ring-slate-300 hover:bg-slate-50"
                        )}
                      >
                        {f} Cycle
                      </button>
                    ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Audit Logs */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-slate-400" />
              <h3 className="text-sm font-black uppercase tracking-[0.25em] text-on-surface italic">System Integrity Log</h3>
            </div>
            <button className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] hover:text-error transition-colors flex items-center gap-2">
               <Trash2 className="w-3.5 h-3.5" />
               Purge Logs
            </button>
        </div>
        <div className="space-y-4">
          {auditLogs.map(log => (
            <motion.div 
              layout
              key={log.id} 
              className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm group hover:border-primary/20 hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black",
                    log.type === 'security' && "bg-error/10 text-error",
                    log.type === 'system' && "bg-primary/10 text-primary",
                    log.type === 'data' && "bg-tertiary/10 text-tertiary",
                    log.type === 'commit' && "bg-slate-900 text-white"
                )}>
                   {log.type.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="text-[12px] font-black uppercase italic tracking-tight text-on-surface">{log.action}</p>
                    <p className="text-[10px] font-bold text-secondary uppercase opacity-50 mt-0.5 tracking-wider">Verification Complete • Hash verified</p>
                </div>
              </div>
              <p className="text-[10px] font-black text-secondary uppercase opacity-60 font-mono tracking-tighter">{log.time}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className="fixed bottom-12 left-[calc(50%+4rem)] -translate-x-1/2 w-full max-w-2xl z-[110] px-4"
          >
            <div className="bg-slate-900 border border-white/5 p-5 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between gap-8 backdrop-blur-2xl ring-1 ring-white/10">
              <div className="flex items-center gap-6 pl-6 border-l-4 border-primary">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                   {saveStatus === 'success' ? <CheckCircle2 className="w-6 h-6 animate-bounce" /> : <AlertCircle className="w-6 h-6" />}
                </div>
                <div className="space-y-0.5">
                  <p className="text-[12px] font-black text-white uppercase italic tracking-[0.2em] leading-none">
                    {saveStatus === 'success' ? 'Protocol Synchronized' : 'Uncommitted Changes'}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {saveStatus === 'success' ? 'Handshake verified successfully' : 'Pending parameter synchronization'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleReset}
                  className="px-8 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Discard
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saveStatus !== 'idle'}
                  className={cn(
                    "px-10 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl transition-all duration-500 outline-none active:scale-95",
                    saveStatus === 'success' ? "bg-tertiary text-white shadow-tertiary/20" : "bg-primary text-white shadow-primary/20 hover:scale-105 active:scale-95"
                  )}
                >
                  {saveStatus === 'saving' && (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <RotateCcw className="w-4 h-4" />
                    </motion.div>
                  )}
                  {saveStatus === 'idle' && <Save className="w-4 h-4" />}
                  {saveStatus === 'success' && <CheckCircle2 className="w-4 h-4" />}
                  <span className="relative">
                    {saveStatus === 'idle' && 'Commit Protocol'}
                    {saveStatus === 'saving' && 'Synchronizing'}
                    {saveStatus === 'success' && 'Verified'}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
