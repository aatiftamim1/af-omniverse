import { useState } from 'react';
import { Globe, Search } from 'lucide-react';
export function NetworkScanner() {
  const [target, setTarget] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const scan = async () => {
    if (!target.trim()) return;
    setLoading(true);
    setResult('');
    try {
      // Get geolocation from IP
      const ipRes = await fetch(`https://ipapi.co/${target}/json/`);
      const ipData = await ipRes.json();
      if (ipData.error) throw new Error('Invalid IP');
      
      // DNS lookup via Google DNS over HTTPS
      const dnsRes = await fetch(`https://dns.google/resolve?name=${target}&type=A`);
      const dnsData = await dnsRes.json();
      const ips = dnsData.Answer?.map((a: any) => a.data) || [];
      
      // Simulate port scan (real port scan impossible from browser)
      const commonPorts = [22, 80, 443, 8080];
      const openPorts = commonPorts.filter(() => Math.random() > 0.5); // mock for demo
      
      setResult(`
🔍 SCAN RESULTS for ${target}
📍 Location: ${ipData.city}, ${ipData.country}
🏢 ISP: ${ipData.org}
📡 DNS A Records: ${ips.join(', ') || 'none'}
🚪 Open Ports (simulated): ${openPorts.join(', ')}
      `);
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
    setLoading(false);
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={target}
          onChange={e => setTarget(e.target.value)}
          placeholder="IP or domain (e.g., 8.8.8.8 or google.com)"
          className="flex-1 bg-black/60 border border-cyan-500/30 rounded-lg px-3 py-2 text-sm font-mono text-white"
        />
        <button onClick={scan} disabled={loading} className="px-4 py-2 bg-cyan-500/20 rounded-lg">
          <Search size={16} /> Scan
        </button>
      </div>
      {loading && <div className="text-cyan-400">Scanning...</div>}
      {result && <pre className="bg-black/50 p-3 rounded-lg text-xs font-mono text-green-400 whitespace-pre-wrap">{result}</pre>}
    </div>
  );
}
