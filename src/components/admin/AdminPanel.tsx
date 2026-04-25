import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Shield, Palette, Database, Sliders, Trash2, Download, Upload, 
  Key, CheckCircle, AlertCircle, RefreshCw, User, Lock, Eye, EyeOff
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Toggle } from '../ui/Toggle';
import { NeonColor } from '../../lib/types';

const neonOptions: { id: NeonColor; label: string; color: string }[] = [
  { id: 'cyan', label: 'Cyber Cyan', color: '#00d4ff' },
  { id: 'blue', label: 'Deep Blue', color: '#0088ff' },
  { id: 'red', label: 'Crimson Red', color: '#ff3366' },
  { id: 'green', label: 'Matrix Green', color: '#00ff88' },
  { id: 'orange', label: 'Solar Orange', color: '#ff8800' },
];

export function AdminPanel() {
  const { showAdminPanel, setShowAdminPanel, themeColor, neonColor, setNeonColor, settings, setSettings } = useApp();
  const { user } = useAuth();
  
  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState('');

  // Password change handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      // First verify current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email!,
        password: currentPassword,
      });
      if (signInError) {
        setPasswordError('Current password is incorrect');
        return;
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err: any) {
      setPasswordError(err.message);
    }
  };

  // Data migration handler
  const migrateData = async () => {
    if (!user) {
      setMigrationStatus('❌ You must be logged in to migrate data');
      return;
    }
    setMigrating(true);
    setMigrationStatus('🔄 Migrating data...');
    
    try {
      // Migrate lessons
      const lessons = JSON.parse(localStorage.getItem('lessons') || '[]');
      let lessonsCount = 0;
      for (const lesson of lessons) {
        const { error } = await supabase.from('lessons').insert([{
          user_id: user.id,
          title: lesson.title,
          subject: lesson.subject,
          content: lesson.content,
          grade_level: lesson.grade,
          language: lesson.language,
        }]);
        if (!error) lessonsCount++;
      }
      
      // Migrate code files
      const codeFiles = JSON.parse(localStorage.getItem('codeFiles') || '[]');
      let filesCount = 0;
      for (const file of codeFiles) {
        const { error } = await supabase.from('code_files').insert([{
          user_id: user.id,
          filename: file.name,
          language: file.language,
          content: file.content,
        }]);
        if (!error) filesCount++;
      }
      
      // Migrate protocols
      const protocols = JSON.parse(localStorage.getItem('protocols') || '[]');
      let protocolsCount = 0;
      for (const protocol of protocols) {
        const { error } = await supabase.from('protocols').insert([{
          user_id: user.id,
          title: protocol.title,
          description: protocol.description,
          level: protocol.level,
          progress: protocol.progress,
          status: protocol.status,
          color: protocol.color,
          icon: protocol.icon,
        }]);
        if (!error) protocolsCount++;
      }
      
      setMigrationStatus(`✅ Migration complete! Migrated: ${lessonsCount} lessons, ${filesCount} code files, ${protocolsCount} protocols.`);
      setTimeout(() => setMigrationStatus(''), 5000);
    } catch (err: any) {
      setMigrationStatus(`❌ Migration failed: ${err.message}`);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <AnimatePresence>
      {showAdminPanel && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAdminPanel(false)} />
          <motion.div
            className="relative z-10 w-full max-w-lg glass-panel rounded-2xl border-2 overflow-hidden"
            style={{ borderColor: `${themeColor}44` }}
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          >
            <div
              className="flex items-center justify-between px-5 py-4 border-b border-white/10"
              style={{ background: `linear-gradient(90deg, ${themeColor}22, transparent)` }}
            >
              <div className="flex items-center gap-2">
                <Shield size={18} style={{ color: themeColor }} />
                <span className="font-bold text-white tracking-wide text-sm font-mono">MASTER CONTROL PANEL</span>
              </div>
              <button onClick={() => setShowAdminPanel(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Theme Engine */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Palette size={15} style={{ color: themeColor }} />
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Theme Engine</h3>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {neonOptions.map(opt => (
                    <motion.button
                      key={opt.id}
                      onClick={() => setNeonColor(opt.id)}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all"
                      style={{
                        borderColor: neonColor === opt.id ? opt.color : 'transparent',
                        backgroundColor: neonColor === opt.id ? `${opt.color}22` : 'rgba(255,255,255,0.03)',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: opt.color, boxShadow: `0 0 8px ${opt.color}` }} />
                      <span className="text-[10px] text-gray-400 font-mono truncate w-full text-center">{opt.label.split(' ')[0]}</span>
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Account Security */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Key size={15} style={{ color: themeColor }} />
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Account Security</h3>
                </div>
                <div className="space-y-3 p-3 rounded-xl bg-white/5">
                  {!showPasswordForm ? (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm"
                    >
                      <Lock size={14} /> Change Password
                    </button>
                  ) : (
                    <form onSubmit={handlePasswordChange} className="space-y-3">
                      <div className="relative">
                        <input
                          type={showCurrent ? "text" : "password"}
                          placeholder="Current Password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white pr-8"
                          required
                        />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-2 text-gray-400">
                          {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          placeholder="New Password (min 6 chars)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white pr-8"
                          required
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-2 text-gray-400">
                          {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                        required
                      />
                      {passwordError && <p className="text-red-400 text-xs">{passwordError}</p>}
                      {passwordSuccess && <p className="text-green-400 text-xs">{passwordSuccess}</p>}
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm">Update</button>
                        <button type="button" onClick={() => setShowPasswordForm(false)} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm">Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              </section>

              {/* System Overrides */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Sliders size={15} style={{ color: themeColor }} />
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">System Overrides</h3>
                </div>
                <div className="space-y-3 p-3 rounded-xl bg-white/5">
                  <Toggle
                    checked={settings.notifications_enabled ?? true}
                    onChange={v => setSettings({ ...settings, notifications_enabled: v })}
                    label="System Notifications"
                  />
                  <div className="border-t border-white/5 pt-3">
                    <Toggle
                      checked={settings.sound_enabled ?? false}
                      onChange={v => setSettings({ ...settings, sound_enabled: v })}
                      label="Sound Effects"
                    />
                  </div>
                  <div className="border-t border-white/5 pt-3">
                    <Toggle
                      checked={settings.auto_save ?? true}
                      onChange={v => setSettings({ ...settings, auto_save: v })}
                      label="Auto-Save"
                    />
                  </div>
                </div>
              </section>

              {/* Data Management */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Database size={15} style={{ color: themeColor }} />
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Data Management</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Download, label: 'Export Data', action: () => alert('Export feature — connect to your backend') },
                      { icon: Upload, label: 'Import Data', action: () => alert('Import feature — connect to your backend') },
                      { icon: Trash2, label: 'Clear Cache', action: () => { localStorage.clear(); alert('Cache cleared'); } },
                    ].map(item => (
                      <motion.button
                        key={item.label}
                        onClick={item.action}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <item.icon size={16} />
                        <span className="text-[10px] font-mono text-center">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Migration Button */}
                  <div className="border-t border-white/10 pt-3">
                    <button
                      onClick={migrateData}
                      disabled={migrating}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-500/20 text-purple-400 text-sm disabled:opacity-50"
                    >
                      <RefreshCw size={14} className={migrating ? 'animate-spin' : ''} />
                      {migrating ? 'Migrating...' : 'Migrate LocalStorage → Supabase'}
                    </button>
                    {migrationStatus && (
                      <p className="text-xs text-center mt-2 text-gray-400">{migrationStatus}</p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}