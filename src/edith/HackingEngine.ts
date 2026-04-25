import { API_URL } from './config';

export interface HackingTask {
  type: 'portscan' | 'vulnscan' | 'wifiscan' | 'antivirus' | 'systeminfo';
  target?: string;
}

export async function runHackingTask(task: HackingTask): Promise<string> {
  const { type, target } = task;
  let command = '';
  switch (type) {
    case 'portscan':
      command = `nmap -sS -p- ${target || 'localhost'} 2>&1 | head -30`;
      break;
    case 'vulnscan':
      command = `nmap --script vuln ${target || 'localhost'} 2>&1 | head -40`;
      break;
    case 'wifiscan':
      command = `nmcli dev wifi list 2>/dev/null || echo "WiFi scan requires root or termux-wifi"`;
      break;
    case 'antivirus':
      command = `clamscan --infected --recursive /data/data/com.termux/files/home 2>&1 | head -20`;
      break;
    case 'systeminfo':
      command = `uname -a; uptime; whoami; df -h; free -m`;
      break;
    default:
      return 'Unknown task';
  }
  try {
    const res = await fetch(`${API_URL}/exec`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cmd: command }),
    });
    const data = await res.json();
    return data.output || 'No output';
  } catch (err) {
    return `API error: ${err}`;
  }
}