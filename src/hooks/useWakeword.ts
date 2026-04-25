import { useState, useEffect, useRef } from 'react';

export function useWakeWord(wakeWord: string = 'hey edith', onWake: () => void) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const start = () => {
    if (!('webkitSpeechRecognition' in window)) return;
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      const transcript = last[0].transcript.toLowerCase();
      if (transcript.includes(wakeWord)) {
        onWake();
        // Optional: stop listening after wake to save battery
        // recognition.stop();
      }
    };
    recognition.onerror = (e: any) => console.error('Wake word error', e);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const stop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return { start, stop, listening };
}