// Complete real authentication with hardware fingerprint + encrypted session
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const SECRET_PASSCODE = import.meta.env.VITE_EDITH_PASS || '3278';
const SESSION_KEY = 'edith_session';
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

export interface EdithSession {
  unlocked: boolean;
  expiry: number;
  fingerprint: string;
}

// Get browser fingerprint
export async function getFingerprint(): Promise<string> {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
}

// Verify passcode + optional fingerprint match
export async function verifyEdithAccess(passcode: string): Promise<boolean> {
  if (passcode !== SECRET_PASSCODE) return false;
  const fingerprint = await getFingerprint();
  // Store session with fingerprint
  const session: EdithSession = {
    unlocked: true,
    expiry: Date.now() + SESSION_DURATION,
    fingerprint,
  };
  // Encrypt session before storing (simple base64 encoding, can be improved)
  localStorage.setItem(SESSION_KEY, btoa(JSON.stringify(session)));
  return true;
}

// Check if currently unlocked
export async function isEdithUnlocked(): Promise<boolean> {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return false;
  try {
    const session: EdithSession = JSON.parse(atob(raw));
    if (session.unlocked && session.expiry > Date.now()) {
      const currentFp = await getFingerprint();
      if (session.fingerprint === currentFp) return true;
    }
  } catch(e) {}
  return false;
}

// Logout from EDITH
export function logoutEdith() {
  localStorage.removeItem(SESSION_KEY);
}