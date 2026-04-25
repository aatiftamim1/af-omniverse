import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, Check, ChevronDown, ChevronUp, Trash2, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  order_index: number;
}

interface Protocol {
  id: string;
  title: string;
  description: string;
  level: number;
  progress: number;
  color: string;
  status: 'active' | 'completed' | 'paused';
  tasks: Task[];
}

const levelBadges = ['Initiate', 'Apprentice', 'Adept', 'Expert', 'Master', 'Grand Master', 'Legend', 'Mythic', 'Divine', 'Omniversal'];

export function TrainingPage() {
  const { themeColor } = useApp();
  const { data: protocols, isLoading, add: addProtocol, update: updateProtocol, remove: deleteProtocol } = useSupabaseQuery<Protocol>('protocols');
  const { add: addTask, update: updateTask, remove: deleteTask } = useSupabaseQuery<Task>('protocol_tasks');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const toggleTask = async (pId: string, tId: string, currentCompleted: boolean) => {
    await updateTask.mutateAsync({ id: tId, completed: !currentCompleted });
    // Recalculate protocol progress
    const protocol = protocols?.find(p => p.id === pId);
    if (protocol) {
      const updatedTasks = protocol.tasks.map(t => t.id === tId ? { ...t, completed: !currentCompleted } : t);
      const newProgress = Math.round((updatedTasks.filter(t => t.completed).length / updatedTasks.length) * 100);
      await updateProtocol.mutateAsync({ id: pId, progress: newProgress });
    }
  };

  const addNewTask = async (pId: string) => {
    if (!newTaskTitle.trim()) return;
    const protocol = protocols?.find(p => p.id === pId);
    const newOrder = protocol?.tasks.length || 0;
    await addTask.mutateAsync({ protocol_id: pId, title: newTaskTitle, order_index: newOrder, completed: false });
    setNewTaskTitle('');
  };

  const deleteTaskHandler = async (taskId: string) => {
    await deleteTask.mutateAsync(taskId);
  };

  if (isLoading) return <div className="text-white p-4">Loading protocols...</div>;

  return (
    <div className="p-4 space-y-4">
      <motion.div><h1 className="text-xl font-bold text-white">Protocol Training</h1><p className="text-xs text-gray-400 font-mono">SELF-MASTERY SYSTEMS ACTIVE</p></motion.div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active', value: protocols?.filter(p => p.status === 'active').length || 0, color: themeColor },
          { label: 'Completed', value: protocols?.filter(p => p.status === 'completed').length || 0, color: '#00ff88' },
          { label: 'Avg Level', value: Math.round((protocols?.reduce((a, p) => a + p.level, 0) || 0) / (protocols?.length || 1)), color: '#ff8800' },
        ].map((stat, i) => (<motion.div key={stat.label} className="glass-panel rounded-2xl border border-white/10 p-3 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}><div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div><div className="text-[10px] text-gray-400 font-mono">{stat.label}</div></motion.div>))}
      </div>
      <div className="space-y-3">
        {protocols?.map((protocol, pi) => (
          <motion.div key={protocol.id} className="glass-panel rounded-2xl border border-white/10 overflow-hidden" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: pi * 0.1 }}>
            <div className="p-4 cursor-pointer" onClick={() => setExpanded(expanded === protocol.id ? null : protocol.id)}>
              <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${protocol.color}22`, border: `1px solid ${protocol.color}44` }}><Zap size={16} style={{ color: protocol.color }} /></div><div><div className="flex items-center gap-2"><h3 className="font-bold text-white">{protocol.title}</h3><Badge color={protocol.status === 'completed' ? '#00ff88' : protocol.color}>{protocol.status === 'completed' ? 'DONE' : `LVL ${protocol.level}`}</Badge></div><p className="text-xs text-gray-400">{protocol.description}</p></div></div><div>{expanded === protocol.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div></div>
              <div className="mt-3"><ProgressBar value={protocol.progress} color={protocol.color} showLabel /></div>
              <div className="flex items-center gap-2 mt-2">{[...Array(Math.min(protocol.level, 10))].map((_, i) => (<Star key={i} size={10} fill={protocol.color} style={{ color: protocol.color }} />))}<span className="text-[10px] text-gray-400 font-mono">{levelBadges[Math.min(protocol.level-1, 9)]}</span></div>
            </div>
            <AnimatePresence>{expanded === protocol.id && (<motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/10"><div className="p-4 space-y-2">{protocol.tasks?.map((task, ti) => (<motion.div key={task.id} className="flex items-center gap-3 group" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ti * 0.04 }}><button onClick={() => toggleTask(protocol.id, task.id, task.completed)} className="w-5 h-5 rounded-lg border-2 flex items-center justify-center" style={{ borderColor: task.completed ? protocol.color : 'rgba(255,255,255,0.2)', background: task.completed ? `${protocol.color}33` : 'transparent' }}>{task.completed && <Check size={10} style={{ color: protocol.color }} />}</button><span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>{task.title}</span><button onClick={() => deleteTaskHandler(task.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-500 hover:text-red-400"><Trash2 size={12} /></button></motion.div>))}<div className="flex gap-2 mt-3 pt-3 border-t border-white/10"><input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNewTask(protocol.id)} placeholder="Add new task..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white" /><button onClick={() => addNewTask(protocol.id)} className="p-2 rounded-xl" style={{ background: `${protocol.color}22`, color: protocol.color }}><Plus size={16} /></button></div></div></motion.div>)}</AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}