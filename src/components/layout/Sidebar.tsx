import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, Zap, Code2, GraduationCap,
  Activity, Cloud, Settings, X, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
  { id: 'chat', label: 'Neural Chat', icon: MessageSquare },
  { id: 'training', label: 'Protocol Training', icon: Zap },
  { id: 'codelab', label: 'Code Lab', icon: Code2 },
  { id: 'educator', label: "Educator's Vault", icon: GraduationCap },
  { id: 'monitor', label: 'System Monitor', icon: Activity },
  { id: 'sync', label: 'Cloud Sync', icon: Cloud },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, activePage, setActivePage, themeColor } = useApp();

  const navigate = (id: string) => {
    setActivePage(id);
    setSidebarOpen(false);
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            className="fixed top-0 left-0 h-full w-72 z-40 glass-panel border-r border-white/10 flex flex-col"
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <p className="text-xs text-gray-400 font-mono">SYSTEM</p>
                <p className="font-bold text-white">AF OMNIVERSE</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const active = activePage === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
                      active ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    style={active ? { backgroundColor: `${themeColor}22`, border: `1px solid ${themeColor}44` } : { border: '1px solid transparent' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <Icon size={18} style={active ? { color: themeColor } : {}} />
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {active && <ChevronRight size={14} style={{ color: themeColor }} />}
                  </motion.button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: `linear-gradient(135deg, ${themeColor}44, ${themeColor}22)`, border: `1px solid ${themeColor}44`, color: themeColor }}
                >
                  MA
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Master Aatif</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
