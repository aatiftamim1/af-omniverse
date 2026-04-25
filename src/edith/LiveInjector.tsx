import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Code, Play, Save, Trash2, Plus, User, Bot, Zap, Check, AlertCircle } from 'lucide-react';

interface InjectionPreset {
  id: string;
  name: string;
  code: string;
}

export function LiveInjector() {
  const { setNeonColor, setSettings, settings, themeColor } = useApp();
  const [code, setCode] = useState(`// Live JavaScript Injection
// Example: Change theme
setNeonColor('red');

// Or modify settings
// setSettings({ ...settings, sound_enabled: true });`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [presets, setPresets] = useState<InjectionPreset[]>([
    { id: '1', name: 'Theme Cyan', code: "setNeonColor('cyan');" },
    { id: '2', name: 'Sound On', code: "setSettings({ ...settings, sound_enabled: true });" },
  ]);
  const [presetName, setPresetName] = useState('');
  const [copied, setCopied] = useState(false);

  const runInjection = () => {
    setError('');
    setOutput('');
    try {
      const injector = new Function('context', `
        try {
          const { setNeonColor, setSettings, settings } = context;
          ${code}
          return { success: true, message: '✓ Code injected successfully' };
        } catch(e) {
          return { success: false, error: e.message };
        }
      `);
      const result = injector({ setNeonColor, setSettings, settings });
      if (result.success) {
        setOutput(result.message);
        setTimeout(() => setOutput(''), 3000);
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const savePreset = () => {
    if (!presetName.trim()) return;
    const newPreset = { id: Date.now().toString(), name: presetName, code };
    setPresets([...presets, newPreset]);
    setPresetName('');
  };

  const loadPreset = (preset: InjectionPreset) => setCode(preset.code);
  const deletePreset = (id: string) => setPresets(presets.filter(p => p.id !== id));
  const copyCode = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="flex flex-col h-full min-h-0 relative">
      <div className="flex justify-between items-center px-2 py-3 border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Code size={18} className="text-cyan-400" />
          <span className="text-sm font-mono font-bold text-white">LIVE INJECTOR</span>
        </div>
        <button onClick={copyCode} className="text-gray-400 hover:text-cyan-400 text-xs">{copied ? <Check size={14} /> : 'Copy'}</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <div className="text-xs text-cyan-400 font-mono mb-2">💉 PRESETS</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {presets.map(preset => (
              <div key={preset.id} className="flex items-center gap-1 bg-white/5 rounded-full border border-white/10">
                <button onClick={() => loadPreset(preset)} className="px-3 py-1 text-xs text-gray-300 hover:text-cyan-400">{preset.name}</button>
                <button onClick={() => deletePreset(preset.id)} className="pr-2 text-gray-500 hover:text-red-400"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-cyan-400 font-mono mb-2">📝 JAVASCRIPT CODE</div>
          <textarea value={code} onChange={e => setCode(e.target.value)} className="w-full h-48 bg-black/80 border border-cyan-500/30 rounded-lg p-3 font-mono text-sm text-green-400 focus:outline-none resize-none" spellCheck={false} />
        </div>

        <div className="flex gap-2">
          <input type="text" value={presetName} onChange={e => setPresetName(e.target.value)} placeholder="Preset name..." className="flex-1 bg-black/60 border border-cyan-500/30 rounded-lg px-3 py-2 text-sm text-white outline-none" />
          <button onClick={savePreset} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-500/20 text-green-400"><Save size={14} /> Save</button>
        </div>

        <button onClick={runInjection} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition"><Play size={16} /> EXECUTE INJECTION</button>

        {(output || error) && (
          <div className={`p-3 rounded-lg border ${error ? 'border-red-500/30 bg-red-500/10' : 'border-green-500/30 bg-green-500/10'}`}>
            <div className="flex items-start gap-2"><AlertCircle size={16} className={error ? 'text-red-400' : 'text-green-400'} /><pre className="text-xs font-mono whitespace-pre-wrap">{error || output}</pre></div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10 bg-black/40">
        <div className="flex justify-center gap-2 text-[10px] text-gray-500 font-mono"><Zap size={10} className="text-cyan-400 animate-pulse" /> <span>Real-time state manipulation | Owner-only</span></div>
      </div>
    </div>
  );
}