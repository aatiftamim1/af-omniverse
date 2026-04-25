import { useState } from 'react';
import { Terminal, Code, Cpu, Sliders, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EdithTerminal } from './EdithTerminal';
import { LiveInjector } from './LiveInjector';
import { CentralIntel } from './CentralIntel';
import { SystemOverride } from './SystemOverride';

export function EdithPage() {
  const [tab, setTab] = useState<'terminal' | 'injector' | 'intel' | 'override'>('terminal');
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black relative">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxwYXRoIGQ9Ik0wIDBoNHY0SDB6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGZmODgiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-10" />
      <div className="relative z-10 p-4">
        <div className="flex justify-between border-b border-cyan-500/30 pb-2"><h1 className="text-2xl font-mono font-bold text-cyan-400">EDITH v1.0</h1><button onClick={()=>navigate('/')}><LogOut size={18} className="text-gray-400"/></button></div>
        <div className="flex gap-2 mt-4">{['terminal','injector','intel','override'].map(t=><button key={t} onClick={()=>setTab(t as any)} className={`px-3 py-1 rounded-md text-sm ${tab===t?'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400':'text-gray-500'}`}>{t.toUpperCase()}</button>)}</div>
        <div className="mt-4">{tab==='terminal'&&<EdithTerminal/>}{tab==='injector'&&<LiveInjector/>}{tab==='intel'&&<CentralIntel/>}{tab==='override'&&<SystemOverride/>}</div>
      </div>
    </div>
  );
}
