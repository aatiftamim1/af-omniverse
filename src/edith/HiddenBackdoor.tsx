import { useApp } from '../context/AppContext';
import { Zap, Code, MessageSquare, Activity, Settings } from 'lucide-react';
export function HiddenBackdoor() {
  const { setActivePage } = useApp();
  const pages = [
    { id: 'dashboard', label: 'Command Center', icon: Zap },
    { id: 'chat', label: 'Neural Chat', icon: MessageSquare },
    { id: 'codelab', label: 'Code Lab', icon: Code },
    { id: 'monitor', label: 'Monitor', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  return (
    <div className="space-y-3">
      <div className="text-xs text-cyan-400 font-mono">DIRECT NAVIGATION (BYPASS SIDEBAR)</div>
      <div className="grid grid-cols-2 gap-2">
        {pages.map(page => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-cyan-500/20 transition text-left"
          >
            <page.icon size={14} className="text-cyan-400" />
            <span className="text-sm text-white">{page.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
