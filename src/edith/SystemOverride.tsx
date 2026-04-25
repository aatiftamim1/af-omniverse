import { useApp } from '../context/AppContext';
import { Toggle } from '../components/ui/Toggle';
import { RefreshCw, Shield, AlertTriangle, Zap } from 'lucide-react';
export function SystemOverride() {
  const { themeColor, setNeonColor, neonColor, settings, setSettings } = useApp();
  const resetSystem = () => {
    if (confirm('⚠️ This will reset all settings and clear local data. Continue?')) {
      localStorage.clear();
      window.location.reload();
    }
  };
  return (
    <div className="space-y-4">
      <div className="glass-panel rounded-xl border border-cyan-500/30 p-4">
        <div className="flex items-center gap-2 mb-3"><Shield size={14} className="text-cyan-400" /><h3 className="text-sm font-mono text-cyan-400">SECURITY OVERRIDE</h3></div>
        <div className="space-y-3">
          <Toggle checked={settings.notifications_enabled ?? true} onChange={v => setSettings({ ...settings, notifications_enabled: v })} label="Force Notifications" />
          <Toggle checked={settings.sound_enabled ?? false} onChange={v => setSettings({ ...settings, sound_enabled: v })} label="Sound Protocol" />
          <div className="border-t border-white/10 pt-3">
            <label className="text-xs text-gray-400 block mb-2">NEON THEME INJECTION</label>
            <div className="flex gap-2">
              {(['cyan', 'blue', 'red', 'green', 'orange'] as const).map(c => (
                <button key={c} onClick={() => setNeonColor(c)} className={`w-6 h-6 rounded-full ${neonColor === c ? 'ring-2 ring-white' : ''}`} style={{ backgroundColor: c === 'cyan' ? '#00d4ff' : c === 'blue' ? '#0088ff' : c === 'red' ? '#ff3366' : c === 'green' ? '#00ff88' : '#ff8800' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="glass-panel rounded-xl border border-cyan-500/30 p-4">
        <div className="flex items-center gap-2 mb-3"><Zap size={14} className="text-cyan-400" /><h3 className="text-sm font-mono text-cyan-400">EMERGENCY PROTOCOLS</h3></div>
        <div className="space-y-3">
          <button onClick={() => alert('[GHOST PROTOCOL] Security scan initiated...')} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"><AlertTriangle size={14} /> Activate Ghost Protocol</button>
          <button onClick={resetSystem} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"><RefreshCw size={14} /> Factory Reset System</button>
        </div>
      </div>
    </div>
  );
}
