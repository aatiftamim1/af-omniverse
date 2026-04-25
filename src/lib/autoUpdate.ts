const VERSION_URL = 'https://gist.githubusercontent.com/your-gist/raw/edith-version.json';
const CURRENT_VERSION = '2.1.0';

export async function checkForUpdates(): Promise<{ hasUpdate: boolean; version: string; features: string[] }> {
  try {
    const res = await fetch(VERSION_URL);
    const data = await res.json();
    const hasUpdate = data.version !== CURRENT_VERSION;
    return { hasUpdate, version: data.version, features: data.features };
  } catch {
    return { hasUpdate: false, version: CURRENT_VERSION, features: [] };
  }
}