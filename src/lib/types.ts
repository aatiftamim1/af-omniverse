export type NeonColor = 'cyan' | 'blue' | 'red' | 'green' | 'orange';

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string;
  level: number;
  xp: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface Protocol {
  id: string;
  user_id: string;
  title: string;
  description: string;
  level: number;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface ProtocolTask {
  id: string;
  protocol_id: string;
  user_id: string;
  title: string;
  description: string;
  completed: boolean;
  completed_at: string | null;
  order_index: number;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  module: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface SavedFile {
  id: string;
  user_id: string;
  filename: string;
  language: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  user_id: string;
  title: string;
  subject: 'english' | 'maths' | 'urdu' | 'science' | 'other';
  content: string;
  grade_level: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  lesson_id: string;
  user_id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  created_at: string;
}

export interface AppSettings {
  id: string;
  user_id: string;
  theme_color: string;
  neon_color: NeonColor;
  notifications_enabled: boolean;
  sound_enabled: boolean;
  auto_save: boolean;
  language: string;
  ai_model: string;
  settings_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
