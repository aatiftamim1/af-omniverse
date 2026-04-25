import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Database, FileCode, GraduationCap, Activity } from 'lucide-react';

export function CentralIntel() {
  const { themeColor } = useApp();
  const [stats, setStats] = useState({
    lessons: 0,
    quizzes: 0,
    codeFiles: 0,
    totalLines: 0,
    lastSync: '',
  });

  useEffect(() => {
    // Read from localStorage (real data from Educator and CodeLab)
    const lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const codeFiles = JSON.parse(localStorage.getItem('codeFiles') || '[]'); // CodeLab stores under 'codeFiles'
    const totalLines = codeFiles.reduce((sum: number, file: any) => sum + (file.content?.split('\n').length || 0), 0);
    setStats({
      lessons: lessons.length,
      quizzes: quizzes.length,
      codeFiles: codeFiles.length,
      totalLines,
      lastSync: new Date().toLocaleString(),
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl border border-cyan-500/30 p-4">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <GraduationCap size={18} />
            <span className="font-mono text-sm">EDUCATOR VAULT</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.lessons}</div>
          <p className="text-xs text-gray-400">Lessons Generated</p>
          <div className="text-lg font-mono text-green-400 mt-2">{stats.quizzes} Quizzes</div>
        </div>
        <div className="glass-panel rounded-xl border border-cyan-500/30 p-4">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <FileCode size={18} />
            <span className="font-mono text-sm">CODE LAB</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.codeFiles}</div>
          <p className="text-xs text-gray-400">Active Files</p>
          <div className="text-lg font-mono text-green-400 mt-2">{stats.totalLines} LOC</div>
        </div>
      </div>

      <div className="glass-panel rounded-xl border border-cyan-500/30 p-4">
        <div className="flex items-center gap-2 text-cyan-400 mb-2">
          <Activity size={18} />
          <span className="font-mono text-sm">SYSTEM FUSION</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>AI Model Sync</span>
            <span className="text-green-400">ACTIVE</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Last Data Fusion</span>
            <span className="text-gray-400">{stats.lastSync}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Neural Bridge Status</span>
            <span className="text-cyan-400">CONNECTED</span>
          </div>
        </div>
      </div>
    </div>
  );
}