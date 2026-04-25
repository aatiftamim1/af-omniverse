import { useState, useEffect } from 'react';
import { Activity, Trash2 } from 'lucide-react';
interface LogEntry {
  id: string;
  time: string;
  module: string;
  action: string;
  level: 'info' | 'warn' | 'error';
}
export function LiveLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  useEffect(() => {
    // Load from MonitorPage's log format (localStorage 'activityLogs' or generate mock)
    const stored = localStorage.getItem('activityLogs');
    if (stored) setLogs(JSON.parse(stored));
    else {
      const mockLogs: LogEntry[] = [
        { id: '1', time: new Date().toLocaleTimeString(), module: 'EDITH', action: 'File explorer opened', level: 'info' },
        { id: '2', time: new Date().toLocaleTimeString(), module: 'SYSTEM', action: 'User authenticated', level: 'info' },
      ];
      setLogs(mockLogs);
    }
    // Simulate real-time log addition
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString(),
        module: ['EDITH', 'CODE_LAB', 'MONITOR'][Math.floor(Math.random()*3)],
        action: 'Background check',
        level: 'info',
      };
      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem('activityLogs');
  };
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-xs text-cyan-400 font-mono flex items-center gap-2"><Activity size={12}/> REAL-TIME LOGS</div>
        <button onClick={clearLogs} className="text-red-400 text-xs flex items-center gap-1"><Trash2 size={12}/> Clear</button>
      </div>
      <div className="h-80 overflow-y-auto space-y-1 font-mono text-xs">
        {logs.map(log => (
          <div key={log.id} className="border-b border-gray-800 p-2">
            <span className="text-gray-500">[{log.time}]</span>{' '}
            <span className="text-cyan-400">{log.module}</span>{' '}
            <span className="text-gray-300">{log.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
