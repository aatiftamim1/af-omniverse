import { motion } from 'framer-motion';
import { Menu, Shield, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Header() {
  const { setSidebarOpen, sidebarOpen, incrementHeaderClick, themeColor, isAdmin, setShowAdminPanel } = useApp();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 h-14 glass-panel border-b border-white/10 flex items-center px-4"
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 flex justify-center">
        <motion.button
          onClick={incrementHeaderClick}
          className="select-none focus:outline-none"
          whileTap={{ scale: 0.95 }}
        >
          <span
            className="text-lg font-bold tracking-widest font-mono"
            style={{
              color: themeColor,
              textShadow: `0 0 10px ${themeColor}, 0 0 20px ${themeColor}88, 0 0 40px ${themeColor}44`,
            }}
          >
            AF INFINITY ♾️
          </span>
        </motion.button>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
          <Bell size={18} />
        </button>
        {isAdmin && (
          <motion.button
            onClick={() => setShowAdminPanel(true)}
            className="p-2 rounded-xl transition-colors"
            style={{ color: themeColor }}
            whileHover={{ scale: 1.1 }}
            animate={{ boxShadow: [`0 0 0px ${themeColor}`, `0 0 12px ${themeColor}`, `0 0 0px ${themeColor}`] }}
            transition={{ duration: 2, repeat: Infinity }}
            title="Admin Panel"
          >
            <Shield size={18} />
          </motion.button>
        )}
      </div>
    </motion.header>
  );
}