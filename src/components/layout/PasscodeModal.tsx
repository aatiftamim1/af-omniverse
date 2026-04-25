import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import { useSecretAccess } from '../../hooks/useSecretAccess';
import { useNavigate } from 'react-router-dom';
import { verifyEdith, setEdithSession } from '../../edith/edithAuth';

export function PasscodeModal() {
  const { showPasscodeModal, themeColor, setShowPasscodeModal, setIsAdmin, setShowAdminPanel } = useApp();
  const { passcode, setPasscode, error, setError, shake, closeModal } = useSecretAccess();
  const navigate = useNavigate();

  const handleVerify = () => {
    if (passcode === '3278') {
      // Normal Admin
      setIsAdmin(true);
      setShowAdminPanel(true);
      setShowPasscodeModal(false);
      setPasscode('');
      setError('');
    } else if (verifyEdith(passcode)) {
      // EDITH Access
      setEdithSession();
      setShowPasscodeModal(false);
      setPasscode('');
      setError('');
      navigate('/edith');
    } else {
      setError('ACCESS DENIED');
    }
  };

  return (
    <Modal open={showPasscodeModal} onClose={closeModal}>
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: `${themeColor}22`, border: `1px solid ${themeColor}44` }}
            animate={{ boxShadow: [`0 0 0px ${themeColor}`, `0 0 20px ${themeColor}88`] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield size={28} style={{ color: themeColor }} />
          </motion.div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">ACCESS</h3>
          <p className="text-xs text-gray-400 font-mono">ENTER PASSCODE</p>
        </div>
        <input
          type="password"
          value={passcode}
          onChange={e => setPasscode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleVerify()}
          className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-center text-white text-xl tracking-widest font-mono focus:outline-none"
          autoFocus
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <div className="flex gap-3">
          <button onClick={closeModal} className="flex-1 py-2 rounded-xl border border-white/20">Cancel</button>
          <button onClick={handleVerify} className="flex-1 py-2 rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${themeColor}cc, ${themeColor}88)` }}>Unlock</button>
        </div>
      </div>
    </Modal>
  );
}