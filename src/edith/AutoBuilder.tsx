import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Send, Sparkles, Globe, Smartphone, X, User, Bot, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  generatedApp?: {
    name: string;
    code: string;
    type: 'web' | 'app';
  };
}

const suggestions = [
  { label: 'To-do list web app', command: 'Create a to-do list web app with dark theme and local storage' },
  { label: 'Weather dashboard', command: 'Build a weather dashboard that shows current weather using OpenWeatherMap API' },
  { label: 'Calculator app', command: 'Make a calculator app with basic arithmetic operations' },
  { label: 'Chat UI component', command: 'Generate a chat UI component like Gemini with message bubbles' },
];

export function AutoBuilder() {
  const { themeColor } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const [previewApp, setPreviewApp] = useState<Message['generatedApp'] | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateApp = async (prompt: string): Promise<Message['generatedApp']> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isWeb = prompt.toLowerCase().includes('web') || prompt.toLowerCase().includes('site') || prompt.toLowerCase().includes('dashboard');
        const type = isWeb ? 'web' : 'app';
        const name = prompt.split(' ').slice(0, 3).join(' ') || 'Untitled';
        const code = `// Auto-generated ${type} app: ${name}
import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', color: '#00d4ff', background: '#0a0a0a', minHeight: '100vh' }}>
      <h1>✨ ${name}</h1>
      <p>${prompt}</p>
      <button onClick={() => setCount(c => c+1)} style={{ background: '#00d4ff22', border: '1px solid #00d4ff', padding: '8px 16px', borderRadius: '20px', color: '#00d4ff' }}>
        Clicks: {count}
      </button>
    </div>
  );
}`;
        resolve({ id: Date.now().toString(), name, code, type });
      }, 2000);
    });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;
    setHasSentFirstMessage(true);
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const generated = await generateApp(text);
    const assistantMsg: Message = {
      id: (Date.now()+1).toString(),
      role: 'assistant',
      content: `✅ I've built a **${generated.type === 'web' ? 'web app' : 'mobile app'}** called "${generated.name}". You can preview the code below.`,
      timestamp: new Date(),
      generatedApp: generated,
    };
    setMessages(prev => [...prev, assistantMsg]);
    setIsThinking(false);
  };

  return (
    <div className="flex flex-col h-full min-h-0 relative">
      <div className="flex justify-between items-center px-2 py-3 border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Code size={18} className="text-cyan-400" />
          <span className="text-sm font-mono font-bold text-white">AUTO BUILDER</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">AI-POWERED</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {!hasSentFirstMessage ? (
            <motion.div key="welcome" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-purple-500/30">
                <Sparkles size={32} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Generate Anything</h2>
                <p className="text-gray-400 text-sm mt-1">Describe the app or website you want. EDITH will build it.</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center max-w-md">
                {suggestions.map(sug => (
                  <button key={sug.label} onClick={() => sendMessage(sug.command)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-200 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all">
                    <Code size={14} className="text-cyan-400" />
                    {sug.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm font-mono ${msg.role === 'user' ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-100' : 'bg-white/5 border border-white/10 text-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {msg.role === 'user' ? <User size={14} className="text-cyan-400" /> : <Bot size={14} className="text-purple-400" />}
                      <span className="text-[10px] opacity-70 uppercase tracking-wider">{msg.role === 'user' ? 'You' : 'EDITH'}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                    {msg.generatedApp && (
                      <div className="mt-3 p-3 bg-black/60 rounded-xl border border-cyan-500/30">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">{msg.generatedApp.type === 'web' ? <Globe size={14} className="text-cyan-400" /> : <Smartphone size={14} className="text-purple-400" />}<span className="text-sm font-mono text-white">{msg.generatedApp.name}</span></div>
                          <button onClick={() => setPreviewApp(msg.generatedApp!)} className="text-xs text-cyan-400 hover:underline">Preview Code</button>
                        </div>
                        <pre className="text-[10px] font-mono text-green-400 truncate">{msg.generatedApp.code.slice(0, 150)}...</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-400 text-sm"><span>Building</span><div className="flex gap-1"><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} /><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div></div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 border-t border-white/10 bg-black/40">
        <div className="flex items-center gap-2 bg-white/5 border border-white/20 rounded-full focus-within:border-cyan-500/50 transition-all px-3">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)} placeholder="Ask EDITH to build an app..." className="flex-1 bg-transparent text-white text-sm font-mono py-3 outline-none" disabled={isThinking} />
          <button onClick={() => sendMessage(input)} disabled={isThinking || !input.trim()} className="p-2 rounded-full bg-cyan-500/30 text-white disabled:opacity-30"><Send size={18} /></button>
        </div>
        <div className="flex justify-center gap-2 mt-2 text-[10px] text-gray-500 font-mono"><Zap size={10} className="text-cyan-400 animate-pulse" /> <span>Self-learning | Auto-generates code</span></div>
      </div>

      {previewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-black/90 rounded-2xl border border-cyan-500/50 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-white/20"><div className="flex items-center gap-2">{previewApp.type === 'web' ? <Globe size={16} className="text-cyan-400" /> : <Smartphone size={16} className="text-purple-400" />}<span className="text-white font-mono">{previewApp.name}</span></div><button onClick={() => setPreviewApp(null)} className="text-gray-400 hover:text-white"><X size={18} /></button></div>
            <div className="flex-1 p-4 overflow-auto"><pre className="text-xs font-mono text-green-400 whitespace-pre-wrap bg-black/50 p-3 rounded-lg">{previewApp.code}</pre></div>
            <div className="p-3 border-t border-white/20 flex justify-end"><button onClick={() => { navigator.clipboard.writeText(previewApp.code); alert('Code copied'); }} className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm">Copy Code</button></div>
          </div>
        </div>
      )}
    </div>
  );
}