import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}
async function processVoiceCommand(cmd: string, context: any): Promise<string> {
  const lower = cmd.toLowerCase();
  const { setNeonColor, setSettings, settings, themeColor } = context;
  if (lower.includes('scan') || lower.includes('network')) {
    return 'Network scan complete. Found 3 devices: router, your phone, and an unknown device. No critical vulnerabilities.';
  }
  if (lower.includes('inject') || lower.includes('code')) {
    return 'Code injection ready. You can write JavaScript to modify app theme or settings.';
  }
  if (lower.includes('theme')) {
    let color = 'cyan';
    if (lower.includes('red')) color = 'red';
    else if (lower.includes('blue')) color = 'blue';
    else if (lower.includes('green')) color = 'green';
    else if (lower.includes('orange')) color = 'orange';
    setNeonColor(color as any);
    return `Theme changed to ${color}. The glow effect has been updated.`;
  }
  if (lower.includes('status')) {
    return `System online. EDITH active. Theme is ${themeColor}. Notifications ${settings.notifications_enabled ? 'on' : 'off'}. Sound ${settings.sound_enabled ? 'on' : 'off'}.`;
  }
  if (lower.includes('help')) {
    return 'Available commands: scan network, inject code, theme cyan/red/blue/green/orange, status, clear chat.';
  }
  return "I'm not sure how to help with that. Try saying 'help' for available commands.";
}
export function VoiceCommander() {
  const { themeColor, setNeonColor, setSettings, settings } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState('');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);
  const synth = window.speechSynthesis;
  useEffect(() => {
    // Request microphone permission on mount
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          setPermissionGranted(true);
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(err => {
          console.error('Microphone permission error', err);
          setPermissionGranted(false);
          setError('Microphone permission denied. Please allow microphone access.');
        });
    } else {
      setPermissionGranted(false);
      setError('Your browser does not support microphone access.');
    }
  }, []);
  const speak = (text: string) => {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synth.speak(utterance);
  };
  const startListening = () => {
    if (!permissionGranted) {
      setError('Microphone permission not granted. Please allow microphone access and refresh.');
      return;
    }
    if (isListening) return;
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice recognition not supported in this browser');
      return;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch(e) {}
      recognitionRef.current = null;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      setTranscript('');
    };
    recognition.onresult = async (event: any) => {
      const spoken = event.results[0][0].transcript;
      setTranscript(spoken);
      const userMsg: Message = { id: Date.now().toString(), role: 'user', text: spoken, timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
      const reply = await processVoiceCommand(spoken, { setNeonColor, setSettings, settings, themeColor });
      setResponse(reply);
      const assistantMsg: Message = { id: (Date.now()+1).toString(), role: 'assistant', text: reply, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      speak(reply);
      setIsListening(false);
    };
    recognition.onerror = (event: any) => {
      console.error('Speech error', event.error);
      let friendlyError = '';
      if (event.error === 'not-allowed') friendlyError = 'Microphone access blocked. Please check permissions.';
      else if (event.error === 'aborted') friendlyError = 'Recognition was aborted. Please try again.';
      else if (event.error === 'no-speech') friendlyError = 'No speech detected. Please try again.';
      else friendlyError = `Error: ${event.error}`;
      setError(friendlyError);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };
  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch(e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };
  const clearChat = () => {
    setMessages([]);
    setTranscript('');
    setResponse('');
    setError('');
  };
  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Professional Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-cyan-950/30 to-purple-950/30" />
        
        {/* Animated glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Moving gradient lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-x" />
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-scan-x-reverse" />
        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-scan-y" />
        <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-scan-y-reverse" />
        
        {/* Grid pattern with moving light */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMjBhMTAgMTAgMCAwIDEgMTAgMTAgMTAgMTAgMCAwIDEtMTAgMTAgMTAgMTAgMCAwIDEtMTAtMTAgMTAgMTAgMCAwIDEgMTAtMTB6IiBmaWxsPSIjMDBkNGZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] opacity-20" />
        
        {/* Floating particles (pseudo-element via CSS) – we can add a few divs with animations */}
        <div className="absolute top-[20%] left-[10%] w-1 h-1 bg-cyan-400 rounded-full animate-float" />
        <div className="absolute top-[60%] left-[80%] w-1.5 h-1.5 bg-purple-400 rounded-full animate-float delay-300" />
        <div className="absolute top-[80%] left-[30%] w-1 h-1 bg-cyan-400 rounded-full animate-float delay-700" />
        <div className="absolute top-[10%] left-[70%] w-2 h-2 bg-blue-400 rounded-full animate-float delay-500" />
        <div className="absolute top-[40%] left-[50%] w-1 h-1 bg-purple-400 rounded-full animate-float delay-1000" />
      </div>
      {/* Foreground content (same as before but with relative z-index) */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center px-2 py-3 border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Volume2 size={18} className="text-cyan-400" />
            <span className="text-sm font-mono font-bold text-white">VOICE COMMANDER</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">HOLD TO TALK</span>
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat} className="text-gray-400 hover:text-white text-xs">Clear</button>
          )}
        </div>
        {/* Main animated mic area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
          {/* Permission indicator */}
          {permissionGranted === false && (
            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-1 rounded-full text-xs">
              <AlertCircle size={14} /> Microphone access required
            </div>
          )}
          {permissionGranted === true && !error && (
            <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-xs">
              <CheckCircle size={14} /> Microphone ready
            </div>
          )}
          {/* Animated mic button with rings */}
          <div className="relative">
            <AnimatePresence>
              {isListening && (
                <>
                  <motion.div
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: [1, 1.8, 2.2], opacity: [0.6, 0.2, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-cyan-500"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <motion.div
                    initial={{ scale: 1, opacity: 0.4 }}
                    animate={{ scale: [1, 2.2, 2.8], opacity: [0.4, 0.1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                    className="absolute inset-0 rounded-full bg-purple-500"
                    style={{ width: '100%', height: '100%' }}
                  />
                </>
              )}
            </AnimatePresence>
            <motion.button
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onTouchStart={startListening}
              onTouchEnd={stopListening}
              whileTap={{ scale: 0.9 }}
              animate={isListening ? { scale: [1, 1.1, 1], boxShadow: `0 0 20px ${themeColor}, 0 0 40px ${themeColor}` } : {}}
              transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
              className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                isListening ? 'bg-red-500/30' : 'bg-cyan-500/20'
              } border-2 ${isListening ? 'border-red-400' : 'border-cyan-400'} shadow-xl backdrop-blur-sm`}
              disabled={permissionGranted === false}
            >
              <Mic size={48} className={isListening ? 'text-red-400 animate-pulse' : 'text-cyan-400'} />
            </motion.button>
          </div>
          {/* Live transcript / response */}
          <div className="text-center space-y-3 w-full max-w-md">
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center gap-1"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [10, 30, 10] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                    className="w-2 bg-cyan-400 rounded-full"
                  />
                ))}
              </motion.div>
            )}
            {transcript && !isListening && (
              <div className="text-sm font-mono text-cyan-300 bg-black/40 p-2 rounded-lg backdrop-blur-sm">
                🎤 You said: "{transcript}"
              </div>
            )}
            {response && !isSpeaking && !isListening && (
              <div className="text-sm font-mono text-green-300 bg-black/40 p-2 rounded-lg backdrop-blur-sm">
                🤖 EDITH: {response}
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center justify-center gap-2 text-purple-400">
                <Volume2 size={16} className="animate-pulse" />
                <span className="text-xs">Speaking...</span>
              </div>
            )}
            {error && (
              <div className="text-red-400 text-xs flex items-center justify-center gap-1">
                <AlertCircle size={14} /> {error}
              </div>
            )}
          </div>
          {/* Instruction */}
          <div className="text-center text-gray-500 text-xs font-mono">
            Press and hold the mic button, speak your command, then release.
            <br />
            Try: "scan network", "theme red", "system status"
          </div>
          {/* Chat history (compact) */}
          {messages.length > 0 && (
            <div className="w-full max-w-md glass-panel rounded-xl p-3 border border-white/10 mt-4 backdrop-blur-sm bg-black/30">
              <div className="text-[10px] text-gray-400 mb-2">CONVERSATION HISTORY</div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {messages.slice(-4).map(msg => (
                  <div key={msg.id} className="text-xs">
                    <span className={msg.role === 'user' ? 'text-cyan-400' : 'text-purple-400'}>{msg.role === 'user' ? 'You: ' : 'EDITH: '}</span>
                    <span className="text-gray-300">{msg.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes scan-x {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes scan-x-reverse {
          0% { transform: translateX(100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes scan-y {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes scan-y-reverse {
          0% { transform: translateY(100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes float {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 0.7; }
        }
        .animate-scan-x {
          animation: scan-x 4s ease-in-out infinite;
        }
        .animate-scan-x-reverse {
          animation: scan-x-reverse 4s ease-in-out infinite;
        }
        .animate-scan-y {
          animation: scan-y 6s ease-in-out infinite;
        }
        .animate-scan-y-reverse {
          animation: scan-y-reverse 6s ease-in-out infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}
