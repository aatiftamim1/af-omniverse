import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Send, Trash2, Zap, User, Bot } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CommandEntry {
  id: string;
  input: string;
  output: string;
}

export function EdithTerminal() {
  const { themeColor } = useApp();
  const [entries, setEntries] = useState<CommandEntry[]>([
    { id: '1', input: 'help', output: 'Available commands: scan <ip>, status, theme <cyan/blue/red>, clear' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const execute = async (cmd: string) => {
    setLoading(true);
    const lower = cmd.toLowerCase();
    let output = '';
    await new Promise(r => setTimeout(r, 500));
    if (lower === 'help') {
      output = '📟 Commands:\n- scan <ip>\n- status\n- theme <cyan/blue/red>\n- clear';
    } else if (lower.startsWith('scan')) {
      const target = cmd.split(' ')[1] || '192.168.1.1';
      output = `🔍 Scanning ${target}...\nOpen ports: 22, 80, 443\nVulnerabilities: 2`;
    } else if (lower === 'status') {
      output = `🖥️ EDITH active | Uptime: 2h 34m | Connections: 3`;
    } else if (lower.startsWith('theme')) {
      const color = cmd.split(' ')[1];
      if (color === 'cyan') output = '🎨 Theme changed to CYAN';
      else if (color === 'blue') output = '🎨 Theme changed to BLUE';
      else if (color === 'red') output = '🎨 Theme changed to RED';
      else output = '❌ Unknown theme. Use: cyan, blue, red';
    } else if (lower === 'clear') {
      setEntries([]);
      setLoading(false);
      return;
    } else {
      output = `❌ Unknown command: "${cmd}". Type "help".`;
    }
    setEntries(prev => [...prev, { id: Date.now().toString(), input: cmd, output }]);
    setLoading(false);
  };

  const sendCommand = () => {
    if (!input.trim() || loading) return;
    const cmd = input.trim();
    setInput('');
    execute(cmd);
  };

  return (
    <div className="flex flex-col h-full min-h-0 relative">
      <div className="flex justify-between items-center px-2 py-3 border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <TerminalIcon size={18} className="text-cyan-400" />
          <span className="text-sm font-mono font-bold text-white">EDITH TERMINAL</span>
        </div>
        <button onClick={() => setEntries([])} className="text-gray-400 hover:text-red-400 transition"><Trash2 size={16} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="space-y-1">
            <div className="flex items-start gap-2 text-cyan-400 font-mono text-sm"><User size={14} className="mt-0.5" /><span>$ {entry.input}</span></div>
            <div className="ml-6 bg-black/30 border-l-2 border-cyan-500/30 p-2 rounded-r-lg"><pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap">{entry.output}</pre></div>
          </div>
        ))}
        {loading && <div className="flex items-center gap-2 text-gray-500"><div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />Executing...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-white/10 bg-black/40">
        <div className="flex items-center gap-2 bg-white/5 border border-white/20 rounded-full focus-within:border-cyan-500/50 transition-all px-3">
          <input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendCommand()} placeholder="Type command (e.g., scan 192.168.1.1, status, theme cyan)" className="flex-1 bg-transparent text-white text-sm font-mono py-3 outline-none" disabled={loading} />
          <button onClick={sendCommand} disabled={loading} className="p-2 rounded-full bg-cyan-500/30 text-white disabled:opacity-30"><Send size={18} /></button>
        </div>
        <div className="flex justify-center gap-2 mt-2 text-[10px] text-gray-500 font-mono"><Zap size={10} className="text-cyan-400 animate-pulse" /> <span>Real-time execution | No limits</span></div>
      </div>
    </div>
  );
}