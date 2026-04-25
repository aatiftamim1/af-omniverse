import { useState } from 'react';
import { runHackingTask } from './HackingEngine';
import { VoiceControl } from './VoiceControl';
import { Zap, Shield, Wifi, Activity, Trash2 } from 'lucide-react';
export function HackingConsole() {
  const [output, setOutput] = useState('Ready. Select a task or use voice command.');
  const [loading, setLoading] = useState(false);
  const runTask = async (type: any, target?: string) => {
    setLoading(true);
    setOutput(`Executing ${type}...\n`);
    const result = await runHackingTask({ type, target });
    setOutput(result);
    setLoading(false);
  };
  const handleVoice = (transcript: string) => {
    const lower = transcript.toLowerCase();
    if (lower.includes('port scan')) runTask('portscan', lower.split('scan')[1]?.trim() || 'localhost');
    else if (lower.includes('vulnerability scan')) runTask('vulnscan');
    else if (lower.includes('wifi scan')) runTask('wifiscan');
    else if (lower.includes('antivirus')) runTask('antivirus');
    else if (lower.includes('system info')) runTask('systeminfo');
    else setOutput(`Voice command not recognized: "${transcript}"`);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => runTask('portscan', 'localhost')} className="flex items-center gap-1 px-3 py-1 bg-red-500/20 rounded"><Zap size={14} /> Port Scan</button>
          <button onClick={() => runTask('vulnscan')} className="flex items-center gap-1 px-3 py-1 bg-red-500/20 rounded"><Shield size={14} /> Vuln Scan</button>
          <button onClick={() => runTask('wifiscan')} className="flex items-center gap-1 px-3 py-1 bg-red-500/20 rounded"><Wifi size={14} /> WiFi Scan</button>
          <button onClick={() => runTask('antivirus')} className="flex items-center gap-1 px-3 py-1 bg-red-500/20 rounded"><Activity size={14} /> Antivirus</button>
        </div>
        <VoiceControl onCommand={handleVoice} />
      </div>
      <pre className="bg-black/80 border border-cyan-500/30 rounded-lg p-3 text-green-400 text-xs font-mono h-96 overflow-auto whitespace-pre-wrap">
        {loading ? 'Executing...' : output}
      </pre>
    </div>
  );
}
