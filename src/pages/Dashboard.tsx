import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Calendar, ChevronDown, TrendingUp, MemoryStick, 
  MessageSquare, Code2, GraduationCap, Activity, Wifi
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// --- SUB-COMPONENTS (same as before) ---
function MetricCircle({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min(value / max, 1);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
          <motion.circle
            cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="text-[10px] text-gray-400 font-mono">{label}</span>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        className="text-7xl font-bold font-mono text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
      </motion.div>
      <div className="flex items-center gap-1.5 mt-2 text-cyan-400/80 text-sm font-mono tracking-widest uppercase">
        <Calendar size={14} />
        <span>{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { themeColor, setActivePage } = useApp();
  const [userInput, setUserInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDashSend = () => {
    if (!userInput.trim()) return;
    setIsChatting(true);
    const newMsgs = [...messages, { role: 'user' as const, text: userInput }];
    setMessages(newMsgs);
    setUserInput('');
    setTimeout(() => {
      setMessages([...newMsgs, { role: 'bot', text: `Master Aatif, AF Infinity system has acknowledged: "${userInput}".` }]);
    }, 1000);
  };

  const quickActions = [
    { icon: MessageSquare, label: 'Chat', page: 'chat', color: '#00d4ff' },
    { icon: Zap, label: 'Protocols', page: 'training', color: '#00ff88' },
    { icon: Code2, label: 'Code Lab', page: 'codelab', color: '#ff8800' },
    { icon: GraduationCap, label: 'Educator', page: 'educator', color: '#ff3366' },
    { icon: Activity, label: 'Monitor', page: 'monitor', color: '#a855f7' },
    { icon: Wifi, label: 'Breach', page: 'breach', color: '#ff0000' },
  ];

  return (
    <div className="h-screen overflow-y-auto no-scrollbar snap-y snap-mandatory bg-black text-white">
      {/* SECTION 1: DYNAMIC INTERFACE */}
      <section className="relative h-screen w-full flex flex-col justify-between p-6 snap-start overflow-hidden">
        {/* NO HEADER HERE – GLOBAL HEADER ALREADY RENDERED */}

        {/* Chat/Clock Display */}
        <div className="flex-1 flex flex-col min-h-0 pt-20">
          <AnimatePresence mode="wait">
            {!isChatting ? (
              <motion.div key="clock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex items-center justify-center">
                <LiveClock />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-24 pt-4 px-2">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-mono ${msg.role === 'user' ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-white/5 border border-white/10'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input & Label */}
        <div className="w-full space-y-4 pb-4 bg-black/80 backdrop-blur-xl border-t border-white/5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-black/40 border border-white/10 rounded-2xl p-1 flex items-center">
              <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleDashSend()} placeholder="Ask AF Infinity..." className="bg-transparent w-full p-4 text-sm outline-none font-mono" />
              <button onClick={handleDashSend} className="p-3 text-cyan-400"><Zap size={20} /></button>
            </div>
          </div>
          <div className="flex flex-col items-center text-gray-600">
            <span className="text-[9px] font-mono tracking-widest uppercase opacity-40">SYSTEM_DASHBOARD</span>
            <ChevronDown size={14} className="animate-bounce opacity-40" />
          </div>
        </div>
      </section>

      {/* SECTION 2: COMMAND CENTER (same as before) */}
      <section className="min-h-screen p-4 space-y-4 snap-start bg-black pt-16">
        <div className="grid grid-cols-2 gap-3">
           <div className="col-span-2 p-4 rounded-2xl border border-white/10 bg-white/5 flex justify-around">
                <MetricCircle value={42} max={100} label="CPU" color={themeColor} />
                <MetricCircle value={68} max={100} label="RAM" color="#00ff88" />
           </div>
           <div className="p-4 rounded-2xl border border-white/10 bg-white/5 h-32 flex flex-col justify-between">
              <TrendingUp size={14} className="text-purple-500" />
              <div><span className="text-2xl font-bold">07</span><p className="text-[10px] text-gray-400 uppercase">Level</p></div>
           </div>
           <div className="p-4 rounded-2xl border border-white/10 bg-white/5 h-32 flex flex-col justify-between">
              <MemoryStick size={14} className="text-orange-400" />
              <div><span className="text-lg font-bold">14.2 GB</span><p className="text-[10px] text-gray-400 uppercase">Storage</p></div>
           </div>
           <div className="col-span-2 p-4 rounded-2xl border border-white/10 bg-white/5">
              <span className="text-[10px] font-mono text-gray-500 mb-3 block uppercase tracking-widest">Quick Access</span>
              <div className="grid grid-cols-3 gap-2">
                {quickActions.map((item) => (
                  <button key={item.page} onClick={() => setActivePage(item.page)} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 active:scale-95 transition-all">
                    <item.icon size={18} style={{ color: item.color }} />
                    <span className="text-[9px] text-gray-400 font-mono">{item.label}</span>
                  </button>
                ))}
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}