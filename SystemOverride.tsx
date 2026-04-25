import { useApp } from '../context/AppContext';
import { Toggle } from '../components/ui/Toggle';
import { RefreshCw } from 'lucide-react';
export function SystemOverride() {
  const { setNeonColor, neonColor, settings, setSettings } = useApp();
  const reset = () => { localStorage.clear(); window.location.reload(); };
  return (
    <div className="space-y-4">
      <div><label className="text-xs text-gray-400">Theme</label><div className="flex gap-2 mt-1">{(['cyan','blue','red','green','orange'] as const).map(c=><button key={c} onClick={()=>setNeonColor(c)} className={`w-6 h-6 rounded-full ${neonColor===c?'ring-2 ring-white':''}`} style={{backgroundColor: c==='cyan'?'#00d4ff':c==='blue'?'#0088ff':c==='red'?'#ff3366':c==='green'?'#00ff88':'#ff8800'}} />)}</div></div>
      <Toggle checked={settings.sound_enabled??false} onChange={v=>setSettings({...settings, sound_enabled:v})} label="Sound" />
      <button onClick={reset} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded"><RefreshCw size={14}/> Factory Reset</button>
    </div>
  );
}
