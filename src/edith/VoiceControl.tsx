import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
export function VoiceControl({ onCommand }: { onCommand: (cmd: string) => void }) {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice control not supported in this browser');
      return;
    }
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Owner verification: check if transcript contains secret phrase or just forward
      // Simple: if user says "Hey EDITH" then listen for command
      if (transcript.toLowerCase().includes('hey edith')) {
        // Wait for next command? Actually we can directly parse command after hotword.
        // For simplicity, we treat the whole transcript as command.
      }
      onCommand(transcript);
      setListening(false);
    };
    recog.onerror = () => setListening(false);
    setRecognition(recog);
  }, []);
  const toggleListen = () => {
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
    }
  };
  return (
    <button
      onClick={toggleListen}
      className={`p-2 rounded-full ${listening ? 'bg-red-500/50 text-white animate-pulse' : 'bg-gray-800 text-gray-400'}`}
      title="Voice Command (Say: Hey EDITH, scan network)"
    >
      {listening ? <Mic size={18} /> : <MicOff size={18} />}
    </button>
  );
}
