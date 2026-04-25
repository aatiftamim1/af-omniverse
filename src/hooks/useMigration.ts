import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useMigration() {
  const { user } = useAuth();

  const migrateAll = async () => {
    if (!user) throw new Error('User not logged in');

    // Migrate lessons
    const lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
    for (const lesson of lessons) {
      const { error } = await supabase.from('lessons').insert([{
        user_id: user.id,
        title: lesson.title,
        subject: lesson.subject,
        content: lesson.content,
        grade_level: lesson.grade,
        language: lesson.language,
      }]);
      if (error) console.error('Lesson migration error', error);
    }

    // Migrate code files
    const codeFiles = JSON.parse(localStorage.getItem('codeFiles') || '[]');
    for (const file of codeFiles) {
      const { error } = await supabase.from('code_files').insert([{
        user_id: user.id,
        filename: file.name,
        language: file.language,
        content: file.content,
      }]);
      if (error) console.error('Code file migration error', error);
    }

    // Migrate settings
    const settings = JSON.parse(localStorage.getItem('app_settings') || '{}');
    await supabase.from('user_settings').upsert([{
      user_id: user.id,
      theme_color: settings.theme_color || 'cyan',
      notifications_enabled: settings.notifications_enabled ?? true,
      sound_enabled: settings.sound_enabled ?? false,
      auto_save: settings.auto_save ?? true,
      language: settings.language || 'en',
      ai_model: settings.ai_model || 'gpt-4',
    }]);

    alert('Migration complete!');
  };

  return { migrateAll };
}