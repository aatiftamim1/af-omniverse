import { useEffect, useState } from 'react';
export function CentralIntel() {
  const [stats, setStats] = useState({ lessons: 0, codeFiles: 0 });
  useEffect(() => {
    const lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
    const codeFiles = JSON.parse(localStorage.getItem('codeFiles') || '[]');
    setStats({ lessons: lessons.length, codeFiles: codeFiles.length });
  }, []);
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="glass-panel rounded-xl p-4 border border-cyan-500/30"><div className="text-2xl font-bold text-white">{stats.lessons}</div><div className="text-xs text-gray-400">Lessons</div></div>
      <div className="glass-panel rounded-xl p-4 border border-cyan-500/30"><div className="text-2xl font-bold text-white">{stats.codeFiles}</div><div className="text-xs text-gray-400">Code Files</div></div>
    </div>
  );
}
