import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Cpu, Sliders, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EdithTerminal } from './EdithTerminal';
import { LiveInjector } from './LiveInjector';
import { CentralIntel } from './CentralIntel';
import { SystemOverride } from './SystemOverride';
import { logoutEdith } from './edithAuth';
import { useNavigate } from 'react-router-dom';

export function EdithPage() {
  const { themeColor } = useApp();
  const [tab, setTab] = useState<'terminal' | 'injector' | 'intel' | 'override'>('terminal');
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutEdith();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Holographic scan lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAwaDQtNHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBkZmZmZjIyIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-20" />
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 animate-scan" />
      </div>

      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center border-b border-cyan-500/30 pb-3">
          <div>
            <h1 className="text-3xl font-mono font-bold text-cyan-400 tracking-wider glitch">EDITH v1.0</h1>
            <p className="text-xs text-gray-400 font-mono">Enhanced Digital Intelligence Tactical Hub</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
            <LogOut size={16} /> Lock EDITH
          </button>
        </div>

        <div className="flex gap-2 mt-6 border-b border-gray-800">
          {[
            { id: 'terminal', label: 'NETWORK TERMINAL', icon: Terminal },
            { id: 'injector', label: 'LIVE INJECTOR', icon: Code },
            { id: 'intel', label: 'CENTRAL INTEL', icon: Cpu },
            { id: 'override', label: 'SYSTEM OVERRIDE', icon: Sliders },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-mono text-sm transition-all ${tab === t.id ? 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'terminal' && <EdithTerminal />}
          {tab === 'injector' && <LiveInjector />}
          {tab === 'intel' && <CentralIntel />}
          {tab === 'override' && <SystemOverride />}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .glitch {
          text-shadow: 0.05em 0 0 rgba(255,0,0,0.5), -0.05em -0.025em 0 rgba(0,255,0,0.5);
        }
      `}</style>
    </div>
  );
}