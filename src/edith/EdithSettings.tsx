import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Toggle } from '../components/ui/Toggle';
import { Shield, Lock, Skull, Zap, RefreshCw, AlertTriangle, Eye, Server, Wifi, Battery, Clock, Key, Fingerprint, QrCode, Globe, Database, Activity } from 'lucide-react';
import { logoutEdith } from './edithAuth';
export function EdithSettings() {
  const { themeColor, neonColor, setNeonColor, settings, setSettings } = useApp();
  const [selfDestructArmed, setSelfDestructArmed] = useState(false);
  const [stealthMode, setStealthMode] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [encryptStorage, setEncryptStorage] = useState(true);
  const resetEdith = () => {
    if (confirm('Reset EDITH session? You will need to re-enter passcode.')) {
      localStorage.removeItem('edith_session');
      localStorage.removeItem('edith_encrypted');
      alert('Session cleared. Redirecting...');
      window.location.href = '/';
    }
  };
  const triggerSelfDestruct = () => {
    if (selfDestructArmed) {
      if (confirm('💣 ALL DATA WILL BE WIPED. Continue?')) {
        localStorage.clear();
        alert('System wiped. Restarting...');
        window.location.href = '/';
      }
    } else {
      setSelfDestructArmed(true);
      setTimeout(() => setSelfDestructArmed(false), 5000);
    }
  };
  return (
    <div className="space-y-4 max-h-full overflow-y-auto p-1">
      {/* EDITH Security */}
      <div className="glass-panel rounded-xl border border-cyan-500/30 p-4">
        <div className="flex items-center gap-2 border-b border-cyan-500/30 pb-2 mb-3">
          <Shield size={14} className="text-cyan-400" />
          <h3 className="text-sm font-mono font-bold text-cyan-400">EDITH SECURITY</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div><div className="text-sm text-white">Session Timeout</div><div className="text-xs text-gray-400">Auto-lock EDITH</div></div>
            <select value={sessionTimeout} onChange={e => setSessionTimeout(Number(e.target.value))} className="bg-black/60 border border-cyan-500/30 rounded-lg px-2 py-1 text-sm">
              <option value={15}>15 min</option><option value={30}>30 min</option><option value={60} selected>1 hour</option><option value={120}>2 hours</option>
            </select>
          </div>
          <Toggle checked={stealthMode} onChange={setStealthMode} label="Stealth Mode" description="Hide EDITH from console & logs" />
          <Toggle checked={encryptStorage} onChange={setEncryptStorage} label="Encrypt EDITH Storage" description="AES-256 client-side" />
          <button onClick={resetEdith} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm">
            <RefreshCw size={14} /> Reset EDITH Session
          </button>
        </div>
      </div>
      {/* System Override */}
      <div className="glass-panel rounded-xl border border-cyan-500/30 p-4">
        <div className="flex items-center gap-2 border-b border-cyan-500/30 pb-2 mb-3">
          <Zap size={14} className="text-cyan-400" />
          <h3 className="text-sm font-mono font-bold text-cyan-400">SYSTEM OVERRIDE</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Theme (Dashboard sync)</label>
            <div className="flex gap-2">
              {(['cyan','blue','red','green','orange'] as const).map(c => (
                <button key={c} onClick={() => setNeonColor(c)} className={`w-6 h-6 rounded-full ${neonColor === c ? 'ring-2 ring-white' : ''}`} style={{backgroundColor: c === 'cyan' ? '#00d4ff' : c === 'blue' ? '#0088ff' : c === 'red' ? '#ff3366' : c === 'green' ? '#00ff88' : '#ff8800'}} />
              ))}
            </div>
          </div>
          <Toggle checked={settings.sound_enabled ?? false} onChange={v => setSettings({...settings, sound_enabled: v})} label="Sound Effects" description="EDITH audio feedback" />
          <Toggle checked={settings.notifications_enabled ?? true} onChange={v => setSettings({...settings, notifications_enabled: v})} label="EDITH Notifications" description="Show system alerts" />
          <div className="flex justify-between items-center">
            <div><div className="text-sm text-white">Performance Mode</div><div className="text-xs text-gray-400">Prioritize speed</div></div>
            <select className="bg-black/60 border border-cyan-500/30 rounded-lg px-2 py-1 text-sm">
              <option>Balanced</option><option>High Performance</option><option>Power Saver</option>
            </select>
          </div>
        </div>
      </div>
      {/* Network & Tools */}
      <div className="glass-panel rounded-xl border border-cyan-500/30 p-4">
        <div className="flex items-center gap-2 border-b border-cyan-500/30 pb-2 mb-3">
          <Wifi size={14} className="text-cyan-400" />
          <h3 className="text-sm font-mono font-bold text-cyan-400">NETWORK & TOOLS</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white">Proxy Settings</span>
            <button className="text-xs text-cyan-400">Configure</button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white">DNS Override</span>
            <button className="text-xs text-cyan-400">Set Custom DNS</button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white">Packet Sniffer</span>
            <span className="text-xs text-gray-500">Simulated</span>
          </div>
        </div>
      </div>
      {/* Danger Zone */}
      <div className="glass-panel rounded-xl border border-red-500/30 p-4">
        <div className="flex items-center gap-2 border-b border-red-500/30 pb-2 mb-3">
          <Skull size={14} className="text-red-400" />
          <h3 className="text-sm font-mono font-bold text-red-400">DANGER ZONE</h3>
        </div>
        <div className="space-y-3">
          <button onClick={logoutEdith} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-yellow-500/20 text-yellow-400">
            <Lock size={14} /> Lock EDITH (Logout)
          </button>
          <button onClick={triggerSelfDestruct} className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${selfDestructArmed ? 'bg-red-600 animate-pulse text-white' : 'bg-red-500/20 text-red-400'}`}>
            <AlertTriangle size={14} /> {selfDestructArmed ? '⚠️ CONFIRM SELF-DESTRUCT ⚠️' : 'Arm Self-Destruct'}
          </button>
          <div className="text-[10px] text-gray-500 text-center">This will wipe ALL app data.</div>
        </div>
      </div>
    </div>
  );
}
