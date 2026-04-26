import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useRealtimeMessages } from '../hooks/useRealtimeMessages';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export function ChatPage() {
  const { themeColor } = useApp();
  const { user } = useAuth();
  const sessionId = 'main-session';
  const { messages, sendMessage } = useRealtimeMessages(sessionId);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isTyping) return;

    // Send user message to database
    await sendMessage(input, 'user');
    const userMessage = input;
    setInput('');
    setIsTyping(true);

    try {
      // Call Supabase Edge Function for Gemini AI
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          messages: [...messages, { role: 'user', content: userMessage }],
          systemPrompt: "You are AF Infinity AI, a friendly and helpful assistant. Respond concisely."
        }
      });

      if (error) throw new Error(error.message);
      const reply = data?.reply || "Sorry, I couldn't process that.";
      await sendMessage(reply, 'assistant');
    } catch (err) {
      console.error('AI error:', err);
      await sendMessage('⚠️ AI service unavailable. Please try again later.', 'assistant');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-black">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h1 className="text-white font-bold">Neural Chat</h1>
        <button onClick={() => {}} className="text-gray-500 hover:text-red-400"><Trash2 size={18}/></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-white/10'} text-white text-sm`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150" />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/10">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white outline-none px-2"
          />
          <button onClick={send} className="p-2 bg-cyan-500 rounded-xl text-white"><Send size={18}/></button>
        </div>
      </div>
    </div>
  );
}