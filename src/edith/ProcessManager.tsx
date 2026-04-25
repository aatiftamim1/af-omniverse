import { useState, useEffect } from 'react';
import { Cpu, Power, RotateCw } from 'lucide-react';
interface Process {
  pid: string;
  name: string;
  cpu: number;
  mem: number;
  status: 'running' | 'sleeping' | 'idle';
}
export function ProcessManager() {
  const [processes, setProcesses] = useState<Process[]>([
    { pid: '1001', name: 'AF-NeuralCore', cpu: 12.4, mem: 34.2, status: 'running' },
    { pid: '1002', name: 'AF-ChatEngine', cpu: 8.1, mem: 18.6, status: 'running' },
    { pid: '1003', name: 'EDITH-AI', cpu: 5.2, mem: 22.1, status: 'running' },
  ]);
  const killProcess = (pid: string) => {
    setProcesses(prev => prev.filter(p => p.pid !== pid));
  };
  const restartProcess = (pid: string) => {
    alert(`Restarting process ${pid} (simulated)`);
  };
  return (
    <div className="space-y-3">
      <div className="text-xs text-cyan-400 font-mono flex items-center gap-2"><Cpu size={12}/> PROCESS MONITOR</div>
      {processes.map(proc => (
        <div key={proc.pid} className="glass-panel rounded-lg p-3 border border-cyan-500/30">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-mono text-white">{proc.name}</div>
              <div className="text-[10px] text-gray-400">PID: {proc.pid} | CPU: {proc.cpu}% | MEM: {proc.mem}%</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => killProcess(proc.pid)} className="text-red-400 hover:text-red-300"><Power size={14}/></button>
              <button onClick={() => restartProcess(proc.pid)} className="text-yellow-400 hover:text-yellow-300"><RotateCw size={14}/></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
