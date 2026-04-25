import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, BookOpen, FileQuestion, Plus, Sparkles, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/Badge';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

interface Lesson {
  id: string;
  title: string;
  subject: string;
  grade_level: string;
  content: string;
  language: string;
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

const subjects = ['english', 'maths', 'urdu', 'science', 'other'];
const subjectColors: Record<string, string> = {
  english: '#00d4ff', maths: '#00ff88', urdu: '#ff8800', science: '#a855f7', other: '#ff3366',
};

export function EducatorPage() {
  const { themeColor } = useApp();
  const { data: lessons, isLoading, add: addLesson, remove: deleteLesson } = useSupabaseQuery<Lesson>('lessons');
  const { data: quizzes, add: addQuiz, remove: deleteQuiz } = useSupabaseQuery<Quiz>('quiz_questions');
  const [tab, setTab] = useState<'lessons' | 'quiz'>('lessons');
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [showGenForm, setShowGenForm] = useState(false);
  const [form, setForm] = useState({ title: '', subject: 'english', grade: '4', language: 'urdu' });
  const [generating, setGenerating] = useState(false);
  const [quizAns, setQuizAns] = useState<Record<string, string>>({});

  const generateLesson = async () => {
    if (!form.title) return;
    setGenerating(true);
    // Simulate AI generation (replace with actual AI call if needed)
    const content = `${form.title} — yeh aik aham sabaq hai jo ${form.subject} ki class ${form.grade} ke liye tayyar kiya gaya hai. Is sabaq mein talba ko buniyadi mafhumat se agah kiya jata hai. Asatiza is content ko apni zaroorat ke mutabiq customize kar sakte hain.`;
    await addLesson.mutateAsync({
      title: form.title,
      subject: form.subject,
      grade_level: form.grade,
      language: form.language,
      content,
    });
    setGenerating(false);
    setShowGenForm(false);
    setForm({ title: '', subject: 'english', grade: '4', language: 'urdu' });
  };

  const generateQuiz = async () => {
    await addQuiz.mutateAsync({
      question: 'What is the main idea of the last lesson?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_answer: 'Option B',
      explanation: 'This is a sample quiz question.',
    });
  };

  if (isLoading) return <div className="text-white p-4">Loading lessons...</div>;

  return (
    <div className="p-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white">Educator's Vault</h1>
        <p className="text-xs text-gray-400 font-mono mt-0.5">AI-POWERED TEACHING TOOLS</p>
      </motion.div>

      <div className="flex gap-2 p-1 glass-panel rounded-xl border border-white/10">
        {[{ id: 'lessons', label: 'Lesson Generator', icon: BookOpen }, { id: 'quiz', label: 'Quiz Maker', icon: FileQuestion }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'text-white' : 'text-gray-400'}`} style={tab === t.id ? { background: `${themeColor}33`, border: `1px solid ${themeColor}44` } : {}}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'lessons' && (
          <motion.div key="lessons" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3">
            <motion.button onClick={() => setShowGenForm(!showGenForm)} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/20 text-sm text-gray-400 hover:text-white" whileHover={{ scale: 1.01 }}>
              <Sparkles size={16} style={{ color: themeColor }} /> Generate New Lesson with AI
            </motion.button>
            <AnimatePresence>
              {showGenForm && (
                <motion.div className="glass-panel rounded-2xl border border-white/10 p-4 space-y-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs text-gray-400 mb-1 block font-mono">LESSON TITLE</label>
                      <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g., Adjectives & Adverbs" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white" />
                    </div>
                    <div><label className="text-xs text-gray-400 mb-1 block font-mono">SUBJECT</label><select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white">{subjects.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    <div><label className="text-xs text-gray-400 mb-1 block font-mono">GRADE LEVEL</label><select value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white">{[1,2,3,4,5,6,7,8].map(g => <option key={g} value={g}>Grade {g}</option>)}</select></div>
                  </div>
                  <button onClick={generateLesson} disabled={generating || !form.title} className="w-full py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2" style={{ background: `${themeColor}cc`, opacity: generating ? 0.7 : 1 }}>{generating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</> : <><Sparkles size={14} /> Generate Lesson</>}</button>
                </motion.div>
              )}
            </AnimatePresence>
            {lessons?.map((lesson, i) => (
              <motion.div key={lesson.id} className="glass-panel rounded-2xl border border-white/10 overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <div className="p-4 cursor-pointer" onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${subjectColors[lesson.subject]}22` }}><GraduationCap size={14} style={{ color: subjectColors[lesson.subject] }} /></div><div><p className="font-semibold text-white text-sm">{lesson.title}</p><div className="flex gap-2 mt-0.5"><Badge color={subjectColors[lesson.subject]}>{lesson.subject}</Badge><Badge color="#666">Grade {lesson.grade_level}</Badge></div></div></div>
                    {expandedLesson === lesson.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>
                <AnimatePresence>
                  {expandedLesson === lesson.id && (<motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/10"><div className="p-4"><p className="text-sm text-gray-300 leading-relaxed">{lesson.content}</p><div className="flex justify-end mt-3"><button onClick={() => deleteLesson.mutate(lesson.id)} className="flex items-center gap-1 text-xs text-red-400"><Trash2 size={12} /> Delete</button></div></div></motion.div>)}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
        {tab === 'quiz' && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <motion.button onClick={generateQuiz} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm text-white font-medium" style={{ background: `${themeColor}22`, border: `1px solid ${themeColor}44` }} whileHover={{ scale: 1.01 }}><Plus size={16} /> Generate Quiz Question</motion.button>
            {quizzes?.map((q, i) => (
              <motion.div key={q.id} className="glass-panel rounded-2xl border border-white/10 p-4 space-y-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <div className="flex items-start gap-2"><span className="text-xs font-bold px-2 py-0.5 rounded-lg font-mono" style={{ background: `${themeColor}22`, color: themeColor }}>Q{i+1}</span><p className="text-sm text-white font-medium flex-1">{q.question}</p></div>
                <div className="grid grid-cols-2 gap-2">{q.options.map((opt, oi) => { const selected = quizAns[q.id] === opt; const correct = opt === q.correct_answer; const revealed = !!quizAns[q.id]; return (<motion.button key={oi} onClick={() => !revealed && setQuizAns(p => ({ ...p, [q.id]: opt }))} className="text-left p-2.5 rounded-xl text-sm border transition-all" style={{ borderColor: revealed ? (correct ? '#00ff88' : selected ? '#ff3366' : 'rgba(255,255,255,0.1)') : 'rgba(255,255,255,0.1)', background: revealed ? (correct ? '#00ff8822' : selected ? '#ff336622' : 'rgba(255,255,255,0.03)') : 'rgba(255,255,255,0.03)', color: revealed && correct ? '#00ff88' : 'white' }} whileHover={!revealed ? { scale: 1.02 } : {}}>{opt}</motion.button>); })}
                </div>
                {quizAns[q.id] && (<p className="text-xs font-mono" style={{ color: quizAns[q.id] === q.correct_answer ? '#00ff88' : '#ff3366' }}>{quizAns[q.id] === q.correct_answer ? '✓ CORRECT!' : `✗ INCORRECT — Answer: ${q.correct_answer}`}</p>)}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}