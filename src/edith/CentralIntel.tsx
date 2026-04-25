import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, Database, FileCode, BookOpen } from 'lucide-react';
export function CentralIntel() {
  const { themeColor } = useApp();
  const [stats, setStats] = useState({
    lessons: 0,
    quizzes: 0,
    codeFiles: 0,
    protocols: 0,
  });
  useEffect(() => {
    const lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const codeFiles = JSON.parse(localStorage.getItem('codeFiles') || '[]');
    const protocols = JSON.parse(localStorage.getItem('protocols') || '[]');
    setStats({
      lessons: lessons.length,
      quizzes: quizzes.length,
      codeFiles: codeFiles.length,
      protocols: protocols.length,
    });
  }, []);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl border border-cyan-500/30 p-4 text-center">
          <BookOpen size={24} className="mx-auto text-cyan-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.lessons}</div>
          <p className="text-xs text-gray-400">Lessons</p>
        </div>
        <div className="glass-panel rounded-xl border border-cyan-500/30 p-4 text-center">
          <FileCode size={24} className="mx-auto text-cyan-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.codeFiles}</div>
          <p className="text-xs text-gray-400">Code Files</p>
        </div>
        <div className="glass-panel rounded-xl border border-cyan-500/30 p-4 text-center">
          <Database size={24} className="mx-auto text-cyan-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.quizzes}</div>
          <p className="text-xs text-gray-400">Quizzes</p>
        </div>
        <div className="glass-panel rounded-xl border border-cyan-500/30 p-4 text-center">
          <Cpu size={24} className="mx-auto text-cyan-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.protocols}</div>
          <p className="text-xs text-gray-400">Protocols</p>
        </div>
      </div>
    </div>
  );
}
