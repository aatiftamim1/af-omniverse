import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useRealtimeMessages(sessionId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, user]);

  const sendMessage = async (content: string, role: 'user' | 'assistant') => {
    await supabase.from('chat_messages').insert([{
      user_id: user?.id,
      session_id: sessionId,
      role,
      content,
    }]);
  };

  return { messages, sendMessage };
}