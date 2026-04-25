import { useState } from 'react';
import { useApp } from '../context/AppContext';

const SECRET_PASSCODE = import.meta.env.VITE_EDITH_PASS || '3278';

export function useSecretAccess() {
  const { setIsAdmin, setShowPasscodeModal, setShowAdminPanel } = useApp();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const verifyPasscode = () => {
    if (passcode === SECRET_PASSCODE) {
      setIsAdmin(true);
      setShowPasscodeModal(false);
      setShowAdminPanel(true);
      setPasscode('');
      setError('');
    } else {
      setError('ACCESS DENIED — Invalid passcode');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPasscode('');
    }
  };

  const closeModal = () => {
    setShowPasscodeModal(false);
    setPasscode('');
    setError('');
  };

  return { passcode, setPasscode, error, setError, shake, verifyPasscode, closeModal };
}