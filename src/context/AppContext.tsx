import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NeonColor, AppSettings } from '../lib/types';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const neonColorMap: Record<NeonColor, string> = {
  cyan: '#00d4ff',
  blue: '#0088ff',
  red: '#ff3366',
  green: '#00ff88',
  orange: '#ff8800',
};

interface AppContextType {
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  activePage: string;
  setActivePage: (p: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  neonColor: NeonColor;
  setNeonColor: (c: NeonColor) => void;
  themeColor: string;
  settings: Partial<AppSettings>;
  setSettings: (s: Partial<AppSettings>) => void;
  headerClickCount: number;
  incrementHeaderClick: () => void;
  showPasscodeModal: boolean;
  setShowPasscodeModal: (v: boolean) => void;
  showAdminPanel: boolean;
  setShowAdminPanel: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [neonColor, setNeonColor] = useState<NeonColor>('cyan');
  const [settings, setSettings] = useState<Partial<AppSettings>>({
    notifications_enabled: true,
    sound_enabled: false,
    auto_save: true,
    language: 'en',
    ai_model: 'gpt-4',
  });
  const [headerClickCount, setHeaderClickCount] = useState(0);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [clickTimer, setClickTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const themeColor = neonColorMap[neonColor];

  // Load settings from Supabase when user logs in
  useEffect(() => {
    if (user) {
      supabase.from('user_settings').select('*').eq('user_id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setNeonColor(data.theme_color as NeonColor);
            setSettings({
              notifications_enabled: data.notifications_enabled,
              sound_enabled: data.sound_enabled,
              auto_save: data.auto_save,
              language: data.language,
              ai_model: data.ai_model,
            });
          }
        });
    }
  }, [user]);

  // Save settings to Supabase when changed
  useEffect(() => {
    if (user && Object.keys(settings).length) {
      supabase.from('user_settings').upsert({
        user_id: user.id,
        theme_color: neonColor,
        notifications_enabled: settings.notifications_enabled,
        sound_enabled: settings.sound_enabled,
        auto_save: settings.auto_save,
        language: settings.language,
        ai_model: settings.ai_model,
      });
    }
  }, [settings, neonColor, user]);

  const incrementHeaderClick = () => {
    const newCount = headerClickCount + 1;
    setHeaderClickCount(newCount);
    if (clickTimer) clearTimeout(clickTimer);
    const t = setTimeout(() => setHeaderClickCount(0), 2000);
    setClickTimer(t);
    if (newCount >= 3) {
      setHeaderClickCount(0);
      if (clickTimer) clearTimeout(clickTimer);
      setShowPasscodeModal(true);
    }
  };

  return (
    <AppContext.Provider value={{
      isAdmin, setIsAdmin,
      activePage, setActivePage,
      sidebarOpen, setSidebarOpen,
      neonColor, setNeonColor,
      themeColor,
      settings, setSettings,
      headerClickCount, incrementHeaderClick,
      showPasscodeModal, setShowPasscodeModal,
      showAdminPanel, setShowAdminPanel,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}