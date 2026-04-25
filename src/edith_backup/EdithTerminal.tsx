import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export function EdithTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;
    const term = new Terminal({
      theme: { background: '#000000', foreground: '#00ff88', cursor: '#00ff88' },
      fontSize: 14,
      fontFamily: 'monospace',
      cursorBlink: true,
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    termRef.current = term;

    term.writeln('EDITH Terminal v2.0 [Secure Shell]');
    term.writeln('Type "help" for commands or "scan <ip>" for network scan');
    term.write('\r\n$ ');

    let inputBuffer = '';
    const prompt = () => term.write('\r\n$ ');

    term.onKey((e) => {
      const char = e.key;
      const code = e.domEvent.keyCode;
      if (code === 13) { // Enter
        term.writeln('');
        handleCommand(inputBuffer, term);
        inputBuffer = '';
        prompt();
      } else if (code === 8) { // Backspace
        if (inputBuffer.length > 0) {
          inputBuffer = inputBuffer.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        inputBuffer += char;
        term.write(char);
      }
    });

    const handleCommand = (cmd: string, t: Terminal) => {
      const parts = cmd.trim().split(' ');
      const main = parts[0].toLowerCase();
      if (main === 'help') {
        t.writeln('Available commands:');
        t.writeln('  scan <ip>      - Simulate network scan');
        t.writeln('  breach <target> - Start breach protocol');
        t.writeln('  status         - Show system status');
        t.writeln('  clear          - Clear terminal');
        t.writeln('  exit           - Close terminal');
      } else if (main === 'scan') {
        const ip = parts[1] || '192.168.1.1';
        t.writeln(`[SCAN] Targeting ${ip}...`);
        let ports = 0;
        const interval = setInterval(() => {
          ports += 22;
          if (ports >= 1024) {
            clearInterval(interval);
            t.writeln(`[+] Scan complete: ${ports/22} ports open. Vulnerabilities found: 3`);
          } else {
            t.writeln(`  Port ${ports} open`);
          }
        }, 100);
      } else if (main === 'breach') {
        const target = parts[1] || 'localhost';
        t.writeln(`[BREACH] Initiating attack on ${target}...`);
        setTimeout(() => t.writeln('[!] Access granted. Root shell obtained.'), 1500);
      } else if (main === 'status') {
        t.writeln('System: Online');
        t.writeln('EDITH: Active');
        t.writeln('Firewall: Bypassed');
      } else if (main === 'clear') {
        t.clear();
      } else if (main === 'exit') {
        t.writeln('Closing terminal...');
        setTimeout(() => t.reset(), 500);
      } else {
        t.writeln(`Unknown command: ${cmd}`);
      }
    };

    return () => {
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} className="w-full h-96 rounded-lg border border-cyan-500/30 overflow-hidden" />;
}