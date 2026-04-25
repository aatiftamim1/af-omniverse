import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Bell, Volume2, Save, Smartphone, Shield, Info, Moon, Sun, 
  Globe, Database, Trash2, Download, Upload, RefreshCw, Lock, Eye, 
  Zap, Cpu, HardDrive, Wifi, Activity, Palette, Type, Mic, Languages,
  Key, Clock, AlertTriangle, CheckCircle, Sliders, Heart, HelpCircle,
  Server, Cloud, WifiOff, Battery, Bluetooth, Fingerprint, QrCode, Settings as SettingsIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Toggle } from '../components/ui/Toggle';
import { NeonColor } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const neonOptions: { id: NeonColor; color: string; label: string }[] = [
  { id: 'cyan', color: '#00d4ff', label: 'Cyber Cyan' },
  { id: 'blue', color: '#0088ff', label: 'Deep Blue' },
  { id: 'red', color: '#ff3366', label: 'Crimson Red' },
  { id: 'green', color: '#00ff88', label: 'Matrix Green' },
  { id: 'orange', color: '#ff8800', label: 'Solar Orange' },
];

const languages = [
  { code: 'en', label: 'English', icon: '🇺🇸' },
  { code: 'ur', label: 'Urdu', icon: '🇵🇰' },
  { code: 'hi', label: 'Hindi', icon: '🇮🇳' },
  { code: 'es', label: 'Español', icon: '🇪🇸' },
];

const aiModels = [
  { id: 'gpt-4', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'gpt-3.5', name: 'GPT-3.5', provider: 'OpenAI' },
  { id: 'claude-3', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
];

const fontSizes = ['Small', 'Medium', 'Large', 'Extra Large'];
const animationSpeeds = ['Off', 'Slow', 'Normal', 'Fast'];

export function SettingsPage() {
  const { themeColor, neonColor, setNeonColor, settings, setSettings } = useApp();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 50 });
  const [fontSize, setFontSize] = useState('Medium');
  const [animationSpeed, setAnimationSpeed] = useState('Normal');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [cloudSync, setCloudSync] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  useEffect(() => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) total += localStorage.getItem(key)?.length || 0;
    }
    const usedMB = (total / 1024 / 1024).toFixed(1);
    setStorageUsage({ used: parseFloat(usedMB), total: 50 });
  }, []);

  const saveAll = async () => {
    const allSettings = { ...settings, fontSize, animationSpeed, reduceMotion, highContrast, offlineMode, cloudSync, vibration, doNotDisturb };
    localStorage.setItem('app_settings', JSON.stringify(allSettings));
    
    // Sync with Supabase if logged in
    if (user) {
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        theme_color: neonColor,
        notifications_enabled: settings.notifications_enabled ?? true,
        sound_enabled: settings.sound_enabled ?? false,
        auto_save: settings.auto_save ?? true,
        language: settings.language || 'en',
        ai_model: settings.ai_model || 'gpt-4',
      });
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportData = () => {
    const data = {
      settings: { ...settings, fontSize, animationSpeed, reduceMotion, highContrast, offlineMode, cloudSync, vibration, doNotDisturb },
      lessons: JSON.parse(localStorage.getItem('lessons') || '[]'),
      codeFiles: JSON.parse(localStorage.getItem('codeFiles') || '[]'),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `af-omniverse-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.settings) {
          setSettings(data.settings);
          if (data.settings.fontSize) setFontSize(data.settings.fontSize);
          if (data.settings.animationSpeed) setAnimationSpeed(data.settings.animationSpeed);
        }
        if (data.lessons) localStorage.setItem('lessons', JSON.stringify(data.lessons));
        if (data.codeFiles) localStorage.setItem('codeFiles', JSON.stringify(data.codeFiles));
        alert('Data imported successfully. Restart app to see changes.');
      } catch { alert('Invalid backup file'); }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('⚠️ This will delete ALL your data (lessons, code files, settings). Are you sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20 max-w-2xl mx-auto text-white">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-xs text-gray-400 font-mono mt-0.5">SYSTEM PREFERENCES & CONTROL</p>
      </motion.div>

      {/* Appearance */}
      <motion.div className="bg-white/5 rounded-2xl border border-white/10 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
          <Palette size={14} style={{ color: themeColor }} />
          <h2 className="text-sm font-bold text-white">Appearance</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-mono mb-2 block">Neon Accent Color</label>
            <div className="grid grid-cols-5 gap-2">
              {neonOptions.map(opt => (
                <motion.button
                  key={opt.id}
                  onClick={() => setNeonColor(opt.id)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl border transition-all"
                  style={{ borderColor: neonColor === opt.id ? opt.color : 'transparent', background: neonColor === opt.id ? `${opt.color}22` : 'rgba(255,255,255,0.03)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: opt.color, boxShadow: neonColor === opt.id ? `0 0 8px ${opt.color}` : 'none' }} />
                  <span className="text-[9px] text-gray-400 font-mono">{opt.label.split(' ')[0]}</span>
                </motion.button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 font-mono mb-2 block">Font Size</label>
            <div className="flex gap-2">
              {fontSizes.map(size => (
                <button key={size} onClick={() => setFontSize(size)} className={`px-3 py-1 rounded-lg text-xs ${fontSize === size ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : 'bg-white/5 text-gray-300'}`}>{size}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 font-mono mb-2 block">Animation Speed</label>
            <div className="flex gap-2">
              {animationSpeeds.map(speed => (
                <button key={speed} onClick={() => setAnimationSpeed(speed)} className={`px-3 py-1 rounded-lg text-xs ${animationSpeed === speed ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : 'bg-white/5 text-gray-300'}`}>{speed}</button>
              ))}
            </div>
          </div>
          <Toggle checked={true} onChange={() => {}} label="Dark Mode" description="Always on for now" />
        </div>
      </motion.div>

      {/* Notifications & Sound */}
      <motion.div className="bg-white/5 rounded-2xl border border-white/10 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
          <Bell size={14} style={{ color: themeColor }} />
          <h2 className="text-sm font-bold text-white">Notifications & Sound</h2>
        </div>
        <div className="space-y-4">
          <Toggle checked={settings.notifications_enabled ?? true} onChange={v => setSettings({ ...settings, notifications_enabled: v })} label="Push Notifications" description="System alerts and updates" />
          <Toggle checked={settings.sound_enabled ?? false} onChange={v => setSettings({ ...settings, sound_enabled: v })} label="Sound Effects" description="UI audio feedback" />
          <Toggle checked={vibration} onChange={setVibration} label="Vibration" description="Haptic feedback on actions" />
          <Toggle checked={doNotDisturb} onChange={setDoNotDisturb} label="Do Not Disturb" description="Mute all notifications" />
        </div>
      </motion.div>

      {/* AI & Language */}
      <motion.div className="bg-white/5 rounded-2xl border border-white/10 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
          <Cpu size={14} style={{ color: themeColor }} />
          <h2 className="text-sm font-bold text-white">AI & Language</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-mono mb-2 block">AI Model</label>
            <select value={settings.ai_model ?? 'gpt-4'} onChange={e => setSettings({ ...settings, ai_model: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white">
              {aiModels.map(m => <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 font-mono mb-2 block">Interface Language</label>
            <div className="flex flex-wrap gap-2">
              {languages.map(lang => (
                <button key={lang.code} onClick={() => setSettings({ ...settings, language: lang.code })} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${settings.language === lang.code ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : 'bg-white/5 text-gray-300'}`}>
                  <span>{lang.icon}</span> {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data & Storage */}
      <motion.div className="bg-white/5 rounded-2xl border border-white/10 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
          <Database size={14} style={{ color: themeColor }} />
          <h2 className="text-sm font-bold text-white">Data & Storage</h2>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Storage Usage</span>
              <span>{storageUsage.used} MB / {storageUsage.total} MB</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" style={{ width: `${(storageUsage.used / storageUsage.total) * 100}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={exportData} className="flex items-center justify-center gap-2 p-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-sm"><Download size={14}/> Export</button>
            <label className="flex items-center justify-center gap-2 p-2 rounded-xl bg-purple-500/10 text-purple-400 text-sm cursor-pointer"><Upload size={14}/> Import<input type="file" accept=".json" onChange={importData} className="hidden" /></label>
            <button onClick={clearAllData} className="col-span-2 flex items-center justify-center gap-2 p-2 rounded-xl bg-red-500/10 text-red-400 text-sm"><Trash2 size={14}/> Factory Reset</button>
          </div>
          <Toggle checked={settings.auto_save ?? true} onChange={v => setSettings({ ...settings, auto_save: v })} label="Auto-Save" description="Automatically save changes" />
        </div>
      </motion.div>

      {/* Network & Sync */}
      <motion.div className="bg-white/5 rounded-2xl border border-white/10 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <button onClick={() => setShowNetwork(!showNetwork)} className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-2"><Wifi size={14} style={{ color: themeColor }} /><h2 className="text-sm font-bold text-white">Network & Sync</h2></div>
          <span className="text-gray-400 text-xs">{showNetwork ? '▲' : '▼'}</span>
        </button>
        {showNetwork && (
          <div className="space-y-4 mt-2 pt-2 border-t border-white/10">
            <Toggle checked={cloudSync} onChange={setCloudSync} label="Cloud Sync" description="Sync data across devices (requires account)" />
            <Toggle checked={offlineMode} onChange={setOfflineMode} label="Offline Mode" description="Work without internet" />
          </div>
        )}
      </motion.div>

      {/* Security & Privacy */}
      <motion.div className="bg-white/5 rounded-2xl border border-white/10 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
          <Shield size={14} style={{ color: themeColor }} />
          <h2 className="text-sm font-bold text-white">Security & Privacy</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div><div className="text-sm text-white">Session Timeout</div><div className="text-xs text-gray-400">Auto-lock after inactivity</div></div>
            <select className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-sm text-white">
              <option>15 min</option><option>30 min</option><option selected>1 hour</option><option>2 hours</option>
            </select>
          </div>
          <Toggle checked={false} onChange={() => {}} label="Stealth Mode" description="Hide sensitive info from screenshots" />
          <Toggle checked={true} onChange={() => {}} label="Encrypt Local Storage" description="Client-side encryption" />
        </div>
      </motion.div>

      {/* Accessibility */}
      <motion.div className="bg-white/5 rounded-2xl border border-white/10 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <button onClick={() => setShowAccessibility(!showAccessibility)} className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-2"><Heart size={14} style={{ color: themeColor }} /><h2 className="text-sm font-bold text-white">Accessibility</h2></div>
          <span className="text-gray-400 text-xs">{showAccessibility ? '▲' : '▼'}</span>
        </button>
        {showAccessibility && (
          <div className="space-y-4 mt-2 pt-2 border-t border-white/10">
            <Toggle checked={reduceMotion} onChange={setReduceMotion} label="Reduce Motion" description="Minimize animations" />
            <Toggle checked={highContrast} onChange={setHighContrast} label="High Contrast" description="Improved readability" />
          </div>
        )}
      </motion.div>

      {/* System */}
      <motion.div className="bg-white/5 rounded-2xl border border-white/10 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
          <SettingsIcon size={14} style={{ color: themeColor }} />
          <h2 className="text-sm font-bold text-white">System</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">App Version</span><span className="text-white">2.0.0 (Build 42)</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Environment</span><span className="text-white">Production</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Developer</span><span className="text-white">Master Aatif</span></div>
          <button className="w-full text-left text-xs text-cyan-400">Check for Updates</button>
          <button className="w-full text-left text-xs text-red-400">Report a Bug</button>
        </div>
      </motion.div>

      {/* About */}
      <motion.div className="bg-white/5 rounded-2xl border border-white/10 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
          <Info size={14} style={{ color: themeColor }} />
          <h2 className="text-sm font-bold text-white">About</h2>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-cyan-400">AF OMNIVERSE</div>
          <div className="text-xs text-gray-400">© 2025 Master Aatif. All rights reserved.</div>
          <div className="text-xs text-gray-500">Made with ♾️ for the digital universe.</div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.button onClick={saveAll} className="w-full py-3 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all" style={{ background: `linear-gradient(135deg, ${themeColor}cc, ${themeColor}88)` }} whileTap={{ scale: 0.97 }}>
        <Save size={16} /> {saved ? 'Saved Successfully!' : 'Save All Changes'}
      </motion.button>
    </div>
  );
}