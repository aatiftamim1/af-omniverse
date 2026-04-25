import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Play } from 'lucide-react';

export function LiveInjector() {
  const { setNeonColor, setSettings, settings, themeColor } = useApp();
  const [code, setCode] = useState("setNeonColor('red');");
  const [output, setOutput] = useState('');
  const run = () => {
    try {
      const fn = new Function('ctx', `const { setNeonColor, setSettings, settings } = ctx; ${code}; return 'OK'`);
      const res = fn({ setNeonColor, setSettings, settings });
      setOutput(String(res));
    } catch(e: any) { setOutput('Error: '+e.message); }
  };
  return (
    <div className="space-y-3">
      <textarea value={code} onChange={e=>setCode(e.target.value)} className="w-full h-48 bg-black/80 border border-cyan-500/30 rounded p-2 font-mono text-sm text-green-400" />
      <button onClick={run} className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded"><Play size={14}/> Inject</button>
      {output && <pre className="p-2 bg-black/50 text-xs">{output}</pre>}
    </div>
  );
}
