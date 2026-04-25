  import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, User, Globe, Code, Sparkles, Activity, 
  Mic, Paperclip, Image, Camera, File, X, Zap, Bell, BellOff, Trash2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolOutput?: {
    type: 'scan' | 'code' | 'theme' | 'status';
    data: any;
  };
  imageData?: string;
}
// Suggestion chips
const suggestions = [
  { label: 'Scan network', icon: Globe, command: 'scan network', color: '#00d4ff' },
  { label: 'Inject code', icon: Code, command: 'inject code', color: '#a855f7' },
  { label: 'Change theme', icon: Sparkles, command: 'theme cyan', color: '#ff8800' },
  { label: 'System status', icon: Activity, command: 'status', color: '#00ff88' },
];
// Command processor (same as before)
async function processCommand(cmd: string, context: any): Promise<{ response: string; toolOutput?: any }> {
  const lower = cmd.toLowerCase();
  const { setNeonColor, setSettings, settings, themeColor } = context;
  if (lower.includes('scan') || lower.includes('network')) {
    return {
      response: '🔍 **Network Scan Complete**\n\nTarget: 192.168.1.0/24\n\n- 192.168.1.1 (Router) – Ports: 22, 80, 443\n- 192.168.1.105 (Master Aatif) – Ports: 5173, 8080\n- 192.168.1.120 (Unknown) – Ports: 139, 445\n\nNo critical vulnerabilities found.',
      toolOutput: { type: 'scan', data: { targets: ['192.168.1.1', '192.168.1.105', '192.168.1.120'] } }
    };
  }
  if (lower.includes('inject') || lower.includes('code')) {
    return {
      response: '💉 **Code Injection Ready**\n\nWrite your JavaScript code below and click **Execute** to run it.',
      toolOutput: { type: 'code', data: { defaultCode: 'setNeonColor("purple");' } }
    };
  }
  if (lower.includes('theme')) {
    let color = 'cyan';
    if (lower.includes('red')) color = 'red';
    else if (lower.includes('blue')) color = 'blue';
    else if (lower.includes('green')) color = 'green';
    else if (lower.includes('orange')) color = 'orange';
    setNeonColor(color as any);
    return {
      response: `🎨 **Theme changed to ${color.toUpperCase()}**`,
      toolOutput: { type: 'theme', data: { color } }
    };
  }
  if (lower.includes('status')) {
    return {
      response: `🖥️ **System Status**\n\n- EDITH Core: ONLINE\n- AI Model: GenUI\n- Theme: ${themeColor}\n- Notifications: ${settings.notifications_enabled ? 'ON' : 'OFF'}\n- Sound: ${settings.sound_enabled ? 'ON' : 'OFF'}`,
      toolOutput: { type: 'status', data: {} }
    };
  }
  if (lower.includes('help')) {
    return { response: `Available commands: scan network, inject code, theme [color], status, clear` };
  }
  return { response: `I'm not sure. Try "help" or suggestions.` };
}
// Inline tool components
function InlineCodeInjector({ onExecute, onClose }: { onExecute: (code: string) => void; onClose: () => void }) {
  const [code, setCode] = useState('setNeonColor("purple");');
  return (
    <div className="mt-3 p-3 bg-black/60 rounded-xl border border-purple-500/30">
      <div className="flex justify-between items-center mb-2">
        <span className="text-purple-400 text-xs font-mono">LIVE INJECTOR</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={14}/></button>
      </div>
      <textarea value={code} onChange={e => setCode(e.target.value)} className="w-full h-24 bg-black/80 border border-purple-500/30 rounded p-2 font-mono text-xs text-green-400" />
      <button onClick={() => onExecute(code)} className="mt-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">Execute</button>
    </div>
  );
}
function InlineScanResult({ data }: { data: any }) {
  return (
    <div className="mt-3 p-3 bg-black/60 rounded-xl border border-green-500/30">
      <div className="text-green-400 text-xs font-mono mb-2">🔍 SCAN RESULT</div>
      <ul className="text-xs text-gray-300 space-y-1">
        {data.targets?.map((t: string, i: number) => <li key={i}>• {t}</li>)}
      </ul>
    </div>
  );
}
// Main component
export function EdithGenUI() {
  const { themeColor, setNeonColor, setSettings, settings } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  let mediaStream: MediaStream | null = null;
  // Voice hold-to-talk
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('edith_chat_history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const withDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(withDates);
        if (withDates.length > 0) setHasSentFirstMessage(true);
      } catch(e) {}
    }
    // Request notification permission if not decided
    if ('Notification' in window && Notification.permission === 'default') {
      // Don't auto-request; user will click bell
    } else if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);
  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('edith_chat_history', JSON.stringify(messages));
  }, [messages]);
  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  // Helper to send browser notification
  const sendNotification = (title: string, body: string) => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/vite.svg' });
    }
  };
  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
          setNotificationsEnabled(true);
          sendNotification('EDITH', 'Notifications enabled. You will receive updates.');
        } else {
          setNotificationsEnabled(false);
        }
      });
    } else {
      alert('Notifications not supported in this browser');
    }
  };
  const sendMessage = async (text: string, imageBase64?: string) => {
    if ((!text.trim() && !imageBase64) || isThinking) return;
    setHasSentFirstMessage(true);
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: text || (imageBase64 ? '📸 Captured image' : ''), 
      timestamp: new Date(),
      imageData: imageBase64
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);
    setShowAttachMenu(false);
    // Simulate AI processing
    setTimeout(async () => {
      let commandText = text;
      if (imageBase64) commandText = 'Analyze this image';
      const { response, toolOutput } = await processCommand(commandText || '', { setNeonColor, setSettings, settings, themeColor });
      const assistantMsg: Message = {
        id: (Date.now()+1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        toolOutput
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsThinking(false);
      // Send notification for important responses
      if (response.includes('Network Scan') || response.includes('Theme changed') || response.includes('System Status')) {
        sendNotification('EDITH Response', response.slice(0, 80) + (response.length > 80 ? '…' : ''));
      }
    }, 1500);
  };
  const handleExecuteCode = (code: string, msgId: string) => {
    try {
      const fn = new Function('context', `const { setNeonColor, setSettings, settings } = context; ${code}; return 'Executed';`);
      fn({ setNeonColor, setSettings, settings });
      const confirmMsg: Message = { id: Date.now().toString(), role: 'assistant', content: '✅ Code executed successfully.', timestamp: new Date() };
      setMessages(prev => [...prev, confirmMsg]);
      sendNotification('Code Injection', 'Code executed successfully');
    } catch(e: any) {
      const errorMsg: Message = { id: Date.now().toString(), role: 'assistant', content: `❌ Error: ${e.message}`, timestamp: new Date() };
      setMessages(prev => [...prev, errorMsg]);
    }
  };
  const clearChat = () => {
    if (confirm('Delete all chat history?')) {
      setMessages([]);
      setHasSentFirstMessage(false);
      setInput('');
      setIsThinking(false);
      localStorage.removeItem('edith_chat_history');
      sendNotification('Chat History', 'All messages cleared');
    }
  };
  const startVoice = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice not supported in this browser');
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.interimResults = false;
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognitionRef.current.onerror = (event: any) => {
      console.error('Voice error', event.error);
      alert('Voice recognition error: ' + event.error);
    };
    recognitionRef.current.start();
    setIsRecording(true);
    recognitionRef.current.onend = () => setIsRecording(false);
  };
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStream = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setShowCameraModal(true);
    } catch (err) {
      console.error('Camera error', err);
      alert('Could not access camera. Please grant permission.');
    }
  };
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    sendMessage('📸 Photo captured', imageData);
    closeCameraModal();
  };
  const closeCameraModal = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
    setShowCameraModal(false);
  };
  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*,application/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          sendMessage(`📎 ${file.name}`, ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  const handleGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          sendMessage(`🖼️ ${file.name}`, ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  return (
    <div className="flex flex-col h-full min-h-0 relative transform-gpu perspective-500">
      {/* 3D rotating glow behind chat */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-transparent rounded-2xl blur-2xl animate-pulse" />
      {/* Header - with notification bell and clear history */}
      <div className="flex justify-between items-center px-2 py-3 border-b border-white/20 relative z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-cyan-400 drop-shadow-glow" />
          <span className="text-sm font-mono font-bold text-white tracking-wider">EDITH</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 shadow-glow-green">OWNER MODE</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Notification Bell Button */}
          <button
            onClick={requestNotificationPermission}
            className="relative text-gray-400 hover:text-white transition"
            title={notificationsEnabled ? 'Notifications enabled' : 'Enable notifications'}
          >
            {notificationsEnabled ? <Bell size={16} className="text-cyan-400" /> : <BellOff size={16} />}
          </button>
          {/* Clear History Button */}
          {messages.length > 0 && (
            <button onClick={clearChat} className="text-gray-400 hover:text-red-400 transition">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
      {/* Messages area (same as before) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        <AnimatePresence mode="wait">
          {!hasSentFirstMessage ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, rotateX: 15 }}
              transition={{ type: 'spring', damping: 20 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/30 animate-pulse">
                <Bot size={36} className="text-cyan-400 drop-shadow-glow" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Hi Master Aatif</h2>
                <p className="text-gray-400 text-sm mt-1">Where should we start?</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center max-w-md">
                {suggestions.map(sug => (
                  <motion.button
                    key={sug.label}
                    onClick={() => sendMessage(sug.command)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-200 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all shadow-md"
                  >
                    <sug.icon size={14} style={{ color: sug.color }} />
                    {sug.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, rotateY: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm font-mono shadow-xl transform-gpu transition-all duration-200 hover:scale-[1.02] ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-100' 
                      : 'bg-white/5 border border-white/10 text-gray-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {msg.role === 'user' ? <User size={14} className="text-cyan-400" /> : <Bot size={14} className="text-purple-400" />}
                      <span className="text-[10px] opacity-70 uppercase tracking-wider">{msg.role === 'user' ? 'You' : 'EDITH'}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                    {msg.imageData && (
                      <img src={msg.imageData} alt="Attached" className="mt-2 max-w-full rounded-lg max-h-40 object-cover border border-white/20" />
                    )}
                    {msg.toolOutput && msg.toolOutput.type === 'scan' && <InlineScanResult data={msg.toolOutput.data} />}
                    {msg.toolOutput && msg.toolOutput.type === 'code' && (
                      <InlineCodeInjector 
                        onExecute={(code) => handleExecuteCode(code, msg.id)}
                        onClose={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, toolOutput: undefined } : m))}
                      />
                    )}
                    {msg.toolOutput && msg.toolOutput.type === 'theme' && (
                      <div className="mt-3 p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30 text-cyan-400 text-xs animate-pulse">✨ Theme updated</div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <span>Thinking</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Input bar (same as before) */}
      <div className="p-3 border-t border-white/20 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2 bg-white/5 border border-white/20 rounded-full focus-within:border-cyan-500/50 transition-all px-3 w-full shadow-inner">
          {input.length === 0 && (
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2 rounded-full text-gray-400 hover:text-cyan-400 transition"
              >
                <Paperclip size={18} />
              </button>
              {showAttachMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-black/90 backdrop-blur rounded-xl border border-white/20 p-2 flex gap-2 z-50 shadow-xl">
                  <button onClick={handleGallery} className="p-2 hover:bg-white/10 rounded-lg"><Image size={16} /></button>
                  <button onClick={openCamera} className="p-2 hover:bg-white/10 rounded-lg"><Camera size={16} /></button>
                  <button onClick={handleFileUpload} className="p-2 hover:bg-white/10 rounded-lg"><File size={16} /></button>
                </div>
              )}
            </div>
          )}
          {input.length === 0 && (
            <button
              onMouseDown={startVoice}
              onMouseUp={() => setIsRecording(false)}
              onTouchStart={startVoice}
              onTouchEnd={() => setIsRecording(false)}
              className={`flex-shrink-0 p-2 rounded-full transition-all ${isRecording ? 'bg-red-500/50 text-white animate-pulse' : 'text-gray-400 hover:text-cyan-400'}`}
            >
              <Mic size={18} />
            </button>
          )}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask EDITH"
            className="flex-1 min-w-0 bg-transparent text-white text-sm font-mono py-3 outline-none"
            disabled={isThinking}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isThinking || !input.trim()}
            className="flex-shrink-0 p-2 rounded-full bg-cyan-500/30 text-white disabled:opacity-30 transition flex items-center justify-center w-9 h-9 hover:bg-cyan-500/50"
          >
            <span className="text-lg leading-none">➤</span>
          </button>
        </div>
        <div className="flex justify-center gap-2 mt-2 text-[10px] text-gray-500 font-mono">
          <Zap size={10} className="text-cyan-400 animate-pulse" /> <span>Adaptive UI | No limits | Owner-only</span>
        </div>
      </div>
      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-black/90 rounded-2xl border border-cyan-500/50 p-4 w-full max-w-md">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg border border-white/20" />
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={capturePhoto} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full">Capture</button>
              <button onClick={closeCameraModal} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full">Cancel</button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
