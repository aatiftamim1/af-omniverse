const STORAGE_KEY = 'edith_encrypted';
function simpleEncrypt(data: any): string {
  const json = JSON.stringify(data);
  let encrypted = '';
  for (let i = 0; i < json.length; i++) {
    encrypted += String.fromCharCode(json.charCodeAt(i) ^ 0x42);
  }
  return btoa(encrypted);
}
function simpleDecrypt(encrypted: string): any {
  const decoded = atob(encrypted);
  let json = '';
  for (let i = 0; i < decoded.length; i++) {
    json += String.fromCharCode(decoded.charCodeAt(i) ^ 0x42);
  }
  return JSON.parse(json);
}
export function saveEdithState(state: any) {
  localStorage.setItem(STORAGE_KEY, simpleEncrypt(state));
}
export function loadEdithState(): any {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try { return simpleDecrypt(raw); } catch { return {}; }
}
