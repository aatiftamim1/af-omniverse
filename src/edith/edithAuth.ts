const EDITH_SECRET = import.meta.env.VITE_EDITH_PASS || '9999';
const SESSION_KEY = 'edith_session';

export interface EdithSession {
  unlocked: boolean;
  expiry: number;
}

export function verifyEdith(passcode: string): boolean {
  return passcode === EDITH_SECRET;
}

export function setEdithSession() {
  const session: EdithSession = {
    unlocked: true,
    expiry: Date.now() + 60 * 60 * 1000,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function isEdithUnlocked(): boolean {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return false;
  try {
    const session: EdithSession = JSON.parse(raw);
    return session.unlocked && session.expiry > Date.now();
  } catch {
    return false;
  }
}

export function logoutEdith() {
  localStorage.removeItem(SESSION_KEY);
}
