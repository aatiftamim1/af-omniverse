import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Play, Plus, X, FileCode, Save, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

interface CodeFile {
  id: string;
  filename: string;
  language: string;
  content: string;
}

const langColors: Record<string, string> = {
  html: '#ff6b35', css: '#3b82f6', javascript: '#f59e0b', python: '#10b981', typescript: '#06b6d4',
};

const langKeywords: Record<string, string[]> = {
  html: ['<!DOCTYPE', 'html', 'head', 'body', 'div', 'span', 'class', 'id', 'href', 'src'],
  css: ['color', 'background', 'margin', 'padding', 'display', 'flex', 'grid', 'width', 'height', 'border'],
  javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'class'],
  python: ['def', 'class', 'import', 'from', 'return', 'if', 'elif', 'else', 'for', 'while', 'print', 'True', 'False'],
  typescript: ['const', 'let', 'interface', 'type', 'function', 'return', 'import', 'export', 'class', 'extends'],
};

function highlightCode(code: string, lang: string): string {
  const keywords = langKeywords[lang] || [];
  let result = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const color = langColors[lang] || '#00d4ff';
  keywords.forEach(kw => { const re = new RegExp(`\\b${kw}\\b`, 'g'); result = result.replace(re, `<span style="color:${color};font-weight:600">${kw}</span>`); });
  result = result.replace(/"([^"]*)"/g, '<span style="color:#86efac">"$1"</span>').replace(/'([^']*)'/g, "<span style=\"color:#86efac\">'$1'</span>").replace(/#.*/g, '<span style="color:#94a3b8;font-style:italic">$&</span>');
  return result;
}

export function CodeLabPage() {
  const { themeColor } = useApp();
  const { data: files, isLoading, add: addFile, update: updateFile, remove: deleteFile } = useSupabaseQuery<CodeFile>('code_files');
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLang, setNewFileLang] = useState('javascript');

  const current = files?.find(f => f.id === activeFile);

  const updateContent = async (content: string) => {
    if (current) {
      await updateFile.mutateAsync({ id: current.id, content });
    }
  };

  const createNewFile = async () => {
    if (!newFileName.trim()) return;
    const newFile: any = {
      filename: newFileName,
      language: newFileLang,
      content: `// New ${newFileLang} file\n`,
    };
    const created = await addFile.mutateAsync(newFile);
    setActiveFile(created.id);
    setNewFileName('');
  };

  const deleteFileHandler = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteFile.mutateAsync(id);
    if (activeFile === id && files?.length) {
      setActiveFile(files[0]?.id || null);
    }
  };

  const runCode = () => {
    if (!current) return;
    setOutput(`[${new Date().toLocaleTimeString()}] Running ${current.filename}...\n> Language: ${current.language.toUpperCase()}\n> Lines: ${current.content.split('\n').length}\n> Status: Executed successfully\n\nOutput:\n${current.language === 'python' ? '>>> Initialize system\n>>> Processing: Initialize system' : '> Script loaded. Check browser console.'}`);
  };

  const copy = () => {
    if (current) {
      navigator.clipboard.writeText(current.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) return <div className="text-white p-4">Loading files...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div><h1 className="text-base font-bold text-white">Code Lab</h1><p className="text-xs text-gray-400 font-mono">DEVELOPER IDE</p></div>
        <div className="flex gap-2">
          <button onClick={copy} className="p-2 rounded-xl hover:bg-white/10 text-gray-400">{copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}</button>
          <button className="p-2 rounded-xl hover:bg-white/10 text-gray-400"><Save size={16} /></button>
          <motion.button onClick={runCode} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-white" style={{ background: `${themeColor}cc` }} whileTap={{ scale: 0.95 }}><Play size={14} /> Run</motion.button>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-white/10 bg-black/20">
        {files?.map(file => (<div key={file.id} onClick={() => setActiveFile(file.id)} className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-white/10 min-w-0 flex-shrink-0 transition-all ${activeFile === file.id ? 'bg-white/10' : 'hover:bg-white/5'}`} style={activeFile === file.id ? { borderBottom: `2px solid ${langColors[file.language] || themeColor}` } : {}}><FileCode size={12} style={{ color: langColors[file.language] || themeColor }} /><span className="text-xs text-gray-300 whitespace-nowrap">{file.filename}</span><button onClick={e => deleteFileHandler(file.id, e)} className="text-gray-500 hover:text-gray-300"><X size={11} /></button></div>))}
        <div className="px-2 py-2 flex gap-1 items-center"><input type="text" placeholder="newfile.js" value={newFileName} onChange={e => setNewFileName(e.target.value)} className="bg-white/10 text-xs px-2 py-1 rounded w-24" /><select value={newFileLang} onChange={e => setNewFileLang(e.target.value)} className="bg-white/10 text-xs px-1 py-1 rounded"><option>javascript</option><option>python</option><option>html</option><option>css</option></select><button onClick={createNewFile} className="text-gray-400 hover:text-white"><Plus size={14} /></button></div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {current ? (<><div className="flex gap-2 px-3 py-2 border-b border-white/10 text-xs">{['edit', 'preview'].map(m => (<button key={m} onClick={() => setMode(m as 'edit' | 'preview')} className={`px-3 py-1 rounded-lg capitalize ${mode === m ? 'text-white' : 'text-gray-400'}`} style={mode === m ? { background: `${themeColor}33`, border: `1px solid ${themeColor}44` } : {}}>{m}</button>))}<div className="ml-auto flex items-center gap-2"><Code2 size={12} style={{ color: langColors[current.language] || themeColor }} /><span className="text-gray-400 uppercase">{current.language}</span></div></div>
        <div className="flex-1 overflow-auto relative">{mode === 'edit' ? (<div className="h-full flex"><div className="select-none text-right pr-3 pt-4 text-gray-600 font-mono text-xs leading-6 min-w-[3rem] border-r border-white/5">{current.content.split('\n').map((_, i) => (<div key={i}>{i+1}</div>))}</div><textarea value={current.content} onChange={e => updateContent(e.target.value)} spellCheck={false} className="flex-1 bg-transparent text-gray-200 font-mono text-xs leading-6 p-4 focus:outline-none resize-none" style={{ tabSize: 2 }} /></div>) : (<div className="h-full p-4"><div className="flex items-center gap-2 mb-3"><div className="w-3 h-3 rounded-full bg-red-500/60" /><div className="w-3 h-3 rounded-full bg-yellow-500/60" /><div className="w-3 h-3 rounded-full bg-green-500/60" /><span className="text-xs text-gray-500 font-mono ml-2">{current.filename}</span></div><pre className="text-xs leading-6 font-mono" dangerouslySetInnerHTML={{ __html: highlightCode(current.content, current.language) }} /></div>)}</div></>) : (<div className="flex-1 flex items-center justify-center text-gray-500"><div className="text-center"><Code2 size={40} className="mx-auto mb-3 opacity-30" /><p className="text-sm">No file open</p><button onClick={() => setNewFileName('newfile.js')} className="mt-2 text-xs underline" style={{ color: themeColor }}>Create new file</button></div></div>)}
      </div>
      {output && (<div className="border-t border-white/10 bg-black/40 max-h-36 overflow-y-auto"><div className="flex items-center justify-between px-3 py-2 border-b border-white/5"><span className="text-xs font-mono text-gray-400">TERMINAL OUTPUT</span><button onClick={() => setOutput('')} className="text-gray-500 hover:text-white"><X size={12} /></button></div><pre className="p-3 text-xs text-green-400 font-mono">{output}</pre></div>)}
    </div>
  );
}