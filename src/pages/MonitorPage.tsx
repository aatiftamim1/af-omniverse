import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, MemoryStick, HardDrive, Wifi, Clock, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProgressBar } from '../components/ui/ProgressBar';

interface Process {
  pid: string;
  name: string;
  cpu: number;
  mem: number;
  status: 'running' | 'sleeping' | 'idle';
}

interface LogEntry {
  id: string;
  time: string;
  module: string;
  action: string;
  level: 'info' | 'warn' | 'error';
}

const initProcesses: Process[] = [
  { pid: '1001', name: 'AF-NeuralCore', cpu: 12.4, mem: 34.2, status: 'running' },
  { pid: '1002', name: 'AF-ChatEngine', cpu: 8.1, mem: 18.6, status: 'running' },
  { pid: '1003', name: 'AF-TrainingSync', cpu: 2.3, mem: 6.8, status: 'sleeping' },
  { pid: '1004', name: 'AF-CodeCompiler', cpu: 0.5, mem: 12.1, status: 'idle' },
  { pid: '1005', name: 'AF-DataVault', cpu: 1.8, mem: 22.4, status: 'running' },
];

const initLogs: LogEntry[] = [
  { id: 'l1', time: '10:42:01', module: 'NEURAL_CHAT', action: 'Session initialized', level: 'info' },
  { id: 'l2', time: '10:41:55', module: 'CODE_LAB', action: 'File compiled successfully', level: 'info' },
  { id: 'l3', time: '10:41:30', module: 'TRAINING', action: 'Protocol checkpoint saved', level: 'info' },
  { id: 'l4', time: '10:40:12', module: 'AUTH', action: 'Admin access attempted', level: 'warn' },
  { id: 'l5', time: '10:39:44', module: 'SYSTEM', action: 'Memory optimization triggered', level: 'info' },
  { id: 'l6', time: '10:38:20', module: 'SYNC', action: 'Cloud sync timeout — retrying', level: 'warn' },
  { id: 'l7', time: '10:37:05', module: 'DATABASE', action: 'Query executed (45ms)', level: 'info' },
  { id: 'l8', time: '10:36:01', module: 'SYSTEM', action: 'Boot sequence complete', level: 'info' },
];

const statusColor: Record<string, string> = {
  running: '#00ff88',
  sleeping: '#ff8800',
  idle: '#666',
};

const levelColor: Record<string, string> = {
  info: '#00d4ff',
  warn: '#ff8800',
  error: '#ff3366',
};

function useRandomMetrics(base: number, range: number) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    const t = setInterval(() => setVal(Math.min(100, Math.max(0, base + (Math.random() - 0.5) * range * 2))), 2000);
    return () => clearInterval(t); // ✅ FIXED: cleanup added
  }, [base, range]);
  return Math.round(val);
}

export function MonitorPage() {
  const { themeColor } = useApp();
  const [processes, setProcesses] = useState<Process[]>(initProcesses);
  const [logs, setLogs] = useState<LogEntry[]>(initLogs);
  const [tab, setTab] = useState<'processes' | 'logs'>('processes');

  const cpu = useRandomMetrics(42, 15);
  const ram = useRandomMetrics(68, 10);
  const net = useRandomMetrics(24, 30);

  const addLog = useCallback(() => {
    const actions = ['Request processed', 'Cache updated', 'Health check passed', 'Data synced', 'Task queued'];
    const modules = ['NEURAL_CHAT', 'SYSTEM', 'DATABASE', 'TRAINING', 'CODE_LAB'];
    const newLog: LogEntry = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      module: modules[Math.floor(Math.random() * modules.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      level: Math.random() > 0.85 ? 'warn' : 'info',
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  }, []);

  useEffect(() => {
    const t = setInterval(addLog, 5000);
    return () => clearInterval(t);
  }, [addLog]);

  const killProcess = (pid: string) => {
    setProcesses(prev => prev.filter(p => p.pid !== pid));
  };

  return (
    <div className="p-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white">System Monitor</h1>
        <p className="text-xs text-gray-400 font-mono mt-0.5">REAL-TIME DIAGNOSTICS</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Cpu, label: 'CPU', value: cpu, color: themeColor },
          { icon: MemoryStick, label: 'RAM', value: ram, color: '#00ff88' },
          { icon: Wifi, label: 'NET ms', value: net, color: '#ff8800', noPercent: true },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass-panel rounded-2xl border border-white/10 p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <stat.icon size={12} style={{ color: stat.color }} />
              <span className="text-[10px] font-mono text-gray-400">{stat.label}</span>
            </div>
            <div className="text-xl font-bold" style={{ color: stat.color }}>
              {stat.value}{stat.noPercent ? '' : '%'}
            </div>
            {!stat.noPercent && <ProgressBar value={stat.value} color={stat.color} height={3} />}
          </motion.div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 p-3">
        <div className="flex items-center gap-2 mb-2">
          <HardDrive size={12} style={{ color: themeColor }} />
          <span className="text-xs font-mono text-gray-400">STORAGE</span>
          <span className="ml-auto text-xs text-gray-400">14.2 / 32 GB</span>
        </div>
        <ProgressBar value={44} color={themeColor} height={5} />
      </div>

      <div className="flex gap-2 p-1 glass-panel rounded-xl border border-white/10">
        {[{ id: 'processes', label: 'Processes', icon: Activity }, { id: 'logs', label: 'Activity Logs', icon: Clock }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'text-white' : 'text-gray-400'}`}
            style={tab === t.id ? { background: `${themeColor}33`, border: `1px solid ${themeColor}44` } : {}}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'processes' && (
        <div className="space-y-2">
          {processes.map((proc, i) => (
            <motion.div
              key={proc.pid}
              className="glass-panel rounded-xl border border-white/10 p-3 flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusColor[proc.status], boxShadow: `0 0 6px ${statusColor[proc.status]}` }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-white truncate">{proc.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono flex-shrink-0">PID:{proc.pid}</span>
                </div>
                <div className="flex gap-3 mt-0.5">
                  <span className="text-[10px] text-gray-400">CPU: <span style={{ color: themeColor }}>{proc.cpu}%</span></span>
                  <span className="text-[10px] text-gray-400">MEM: <span style={{ color: '#00ff88' }}>{proc.mem}%</span></span>
                </div>
              </div>
              <button
                onClick={() => killProcess(proc.pid)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                title="Kill process"
              >
                <Trash2 size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'logs' && (
        <div className="space-y-1.5">
          <div className="flex justify-end mb-2">
            <button onClick={() => setLogs([])} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
              <Trash2 size={11} /> Clear Logs
            </button>
          </div>
          {logs.map((log, i) => (
            <motion.div
              key={log.id}
              className="glass-panel rounded-xl border border-white/5 p-3 flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
            >
              <span className="text-[10px] font-mono text-gray-500 flex-shrink-0 mt-0.5">{log.time}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: `${levelColor[log.level]}22`, color: levelColor[log.level] }}>{log.level.toUpperCase()}</span>
                  <span className="text-[10px] font-mono text-gray-500">[{log.module}]</span>
                </div>
                <p className="text-xs text-gray-300 mt-0.5">{log.action}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}