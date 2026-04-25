import { useState } from 'react';
import { AlertTriangle, Skull, Lock } from 'lucide-react';
import { logoutEdith } from './edithAuth';
import { useNavigate } from 'react-router-dom';
export function SelfDestruct() {
  const [armed, setArmed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const startDestruct = () => {
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 5000); // auto disarm after 5s
      return;
    }
    // Actual self-destruct
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Wipe EDITH session and reload app
          logoutEdith();
          localStorage.removeItem('edith_encrypted');
          localStorage.removeItem('codeFiles');
          localStorage.removeItem('lessons');
          alert('EDITH SELF-DESTRUCT COMPLETE. System reboot.');
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  return (
    <div className="space-y-4 text-center">
      <div className="text-red-500 font-mono text-sm flex items-center justify-center gap-2">
        <Skull size={20} /> SELF-DESTRUCT PROTOCOL
      </div>
      <button
        onClick={startDestruct}
        className={`px-6 py-3 rounded-lg font-bold transition-all ${armed ? 'bg-red-600 animate-pulse' : 'bg-red-500/20'}`}
      >
        {armed ? (countdown > 0 ? `DESTROYING IN ${countdown}...` : '⚠️ CONFIRM DESTRUCTION ⚠️') : 'ARM SELF-DESTRUCT'}
      </button>
      {armed && !countdown && <div className="text-xs text-gray-400">Click again to confirm. This will wipe all data.</div>}
    </div>
  );
}
