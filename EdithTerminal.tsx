import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export function EdithTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!terminalRef.current) return;
    const term = new Terminal({ theme: { background: '#000000', foreground: '#00ff88' }, fontSize: 14 });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    term.writeln('EDITH Terminal');
    term.write('\r\n$ ');
    let input = '';
    term.onKey((e) => {
      if (e.domEvent.keyCode === 13) {
        term.writeln('');
        const cmd = input.trim().toLowerCase();
        if (cmd === 'help') term.writeln('Commands: scan, status, clear');
        else if (cmd === 'scan') term.writeln('Scanning... done');
        else if (cmd === 'status') term.writeln('EDITH active');
        else if (cmd === 'clear') term.clear();
        else term.writeln('Unknown');
        input = '';
        term.write('$ ');
      } else if (e.domEvent.keyCode === 8) {
        if (input.length) { input = input.slice(0,-1); term.write('\b \b'); }
      } else {
        input += e.key;
        term.write(e.key);
      }
    });
    return () => term.dispose();
  }, []);
  return <div ref={terminalRef} className="w-full h-96 rounded-lg border border-cyan-500/30" />;
}
