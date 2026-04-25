import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Play, AlertCircle } from 'lucide-react';

export function LiveInjector() {
  const { themeColor, setNeonColor, settings, setSettings } = useApp();
  const [code, setCode] = useState(`// Real-time code injection\n// Example: change theme color\nsetNeonColor('red');\n\n// Or modify settings\n// setSettings({ ...settings, sound_enabled: true });`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const runInjection = () => {
    setError('');
    setOutput('');
    try {
      // Create a sandboxed function with access to app context
      const injector = new Function('context', `
        try {
          const { setNeonColor, setSettings, settings, themeColor } = context;
          ${code}
          return { success: true, message: 'Code injected successfully' };
        } catch(e) {
          return { success: false, error: e.message };
        }
      `);
      const result = injector({ setNeonColor, setSettings, settings, themeColor });
      if (result.success) {
        setOutput(result.message || '✓ Injection successful');
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-panel rounded-xl border border-cyan-500/30 p-4">
        <h3 className="text-sm font-mono text-cyan-400 mb-2">LIVE CODE INJECTOR</h3>
        <p className="text-xs text-gray-400 mb-3">Write JavaScript code to manipulate app state, change themes, modify settings, or access any React context.</p>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 bg-black/80 border border-cyan-500/30 rounded-lg p-3 font-mono text-sm text-green-400 focus:outline-none"
          spellCheck={false}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={runInjection}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition"
          >
            <Play size={16} /> INJECT & EXECUTE
          </button>
        </div>
      </div>

      {(output || error) && (
        <div className={`p-3 rounded-lg border ${error ? 'border-red-500/30 bg-red-500/10' : 'border-green-500/30 bg-green-500/10'}`}>
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className={error ? 'text-red-400' : 'text-green-400'} />
            <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap">{error || output}</pre>
          </div>
        </div>
      )}
    </div>
  );
}