import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Download, Upload, RefreshCw, CheckCircle, Clock, HardDrive, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SyncItem {
  id: string;
  name: string;
  size: string;
  lastSync: string;
  status: 'synced' | 'pending' | 'error';
}

const syncItems: SyncItem[] = [
  { id: '1', name: 'Chat History', size: '2.4 MB', lastSync: '2 min ago', status: 'synced' },
  { id: '2', name: 'Training Protocols', size: '0.8 MB', lastSync: '5 min ago', status: 'synced' },
  { id: '3', name: 'Code Lab Files', size: '4.1 MB', lastSync: '1 hour ago', status: 'pending' },
  { id: '4', name: 'Educator Vault', size: '1.2 MB', lastSync: 'Never', status: 'error' },
  { id: '5', name: 'Settings & Prefs', size: '0.1 MB', lastSync: '10 min ago', status: 'synced' },
];

const statusConfig = {
  synced: { color: '#00ff88', icon: CheckCircle, label: 'Synced' },
  pending: { color: '#ff8800', icon: Clock, label: 'Pending' },
  error: { color: '#ff3366', icon: RefreshCw, label: 'Retry' },
};

export function SyncPage() {
  const { themeColor } = useApp();
  const [items, setItems] = useState<SyncItem[]>(syncItems);
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);

  const syncAll = () => {
    setSyncing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSyncing(false);
          setItems(all => all.map(i => ({ ...i, status: 'synced', lastSync: 'just now' })));
          return 100;
        }
        return prev + 4;
      });
    }, 80);
  };

  const retryItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'synced', lastSync: 'just now' } : i));
  };

  const exportBackup = () => {
    const data = JSON.stringify({ exported: new Date().toISOString(), version: '1.0', modules: items.map(i => i.name) }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `af-omniverse-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalSynced = items.filter(i => i.status === 'synced').length;

  return (
    <div className="p-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white">Cloud Sync</h1>
        <p className="text-xs text-gray-400 font-mono mt-0.5">BACKUP & RESTORE SYSTEM</p>
      </motion.div>

      <motion.div
        className="glass-panel rounded-2xl border border-white/10 p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${themeColor}22`, border: `1px solid ${themeColor}44` }}>
              <Cloud size={22} style={{ color: themeColor }} />
            </div>
            <div>
              <p className="font-bold text-white">AF Cloud Storage</p>
              <p className="text-xs text-gray-400 font-mono">{totalSynced}/{items.length} modules synced</p>
            </div>
          </div>
          <motion.button
            onClick={syncAll}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
            style={{ background: `${themeColor}cc`, opacity: syncing ? 0.7 : 1 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? `${progress}%` : 'Sync All'}
          </motion.button>
        </div>

        {syncing && (
          <div className="mb-4">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${themeColor}88, ${themeColor})`, boxShadow: `0 0 8px ${themeColor}66` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p className="text-[10px] text-gray-400 font-mono mt-1">Synchronizing data...</p>
          </div>
        )}

        <div className="w-full bg-white/5 rounded-xl overflow-hidden mb-3">
          <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${themeColor}88, ${themeColor})`, width: `${(totalSynced / items.length) * 100}%` }} />
        </div>
        <p className="text-xs text-gray-400 font-mono">8.6 MB / 50 MB used</p>
      </motion.div>

      <div className="space-y-2">
        {items.map((item, i) => {
          const cfg = statusConfig[item.status];
          return (
            <motion.div
              key={item.id}
              className="glass-panel rounded-2xl border border-white/10 p-3 flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <HardDrive size={16} className="text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="text-[10px] text-gray-500 font-mono">{item.size} · {item.lastSync}</p>
              </div>
              {item.status === 'error' ? (
                <button
                  onClick={() => retryItem(item.id)}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all"
                  style={{ color: cfg.color, background: `${cfg.color}22` }}
                >
                  <cfg.icon size={11} />
                  Retry
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <cfg.icon size={14} style={{ color: cfg.color }} />
                  <span className="text-[10px] font-mono" style={{ color: cfg.color }}>{cfg.label}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Download, label: 'Export Backup', desc: 'Download JSON backup', action: exportBackup, color: themeColor },
          { icon: Upload, label: 'Import Data', desc: 'Restore from backup', action: () => {}, color: '#00ff88' },
          { icon: Share2, label: 'Share Config', desc: 'Share settings', action: () => {}, color: '#ff8800' },
          { icon: RefreshCw, label: 'Reset & Sync', desc: 'Fresh sync all data', action: syncAll, color: '#ff3366' },
        ].map((btn, i) => (
          <motion.button
            key={btn.label}
            onClick={btn.action}
            className="glass-panel rounded-2xl border border-white/10 p-4 text-left transition-all hover:border-white/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: `${btn.color}22` }}>
              <btn.icon size={15} style={{ color: btn.color }} />
            </div>
            <p className="text-sm font-semibold text-white">{btn.label}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{btn.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
