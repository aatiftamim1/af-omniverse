import { useState, useEffect } from 'react';
import { Folder, File, Trash2, Edit, Save, X, Code } from 'lucide-react';
interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
}
export function FileExplorer() {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  useEffect(() => {
    loadFiles();
  }, []);
  const loadFiles = () => {
    const stored = localStorage.getItem('codeFiles');
    if (stored) setFiles(JSON.parse(stored));
    else setFiles([]);
  };
  const saveFiles = (newFiles: CodeFile[]) => {
    setFiles(newFiles);
    localStorage.setItem('codeFiles', JSON.stringify(newFiles));
  };
  const deleteFile = (id: string) => {
    if (confirm('Delete this file?')) {
      saveFiles(files.filter(f => f.id !== id));
    }
  };
  const startEdit = (file: CodeFile) => {
    setEditingId(file.id);
    setEditContent(file.content);
  };
  const saveEdit = (id: string) => {
    saveFiles(files.map(f => f.id === id ? { ...f, content: editContent } : f));
    setEditingId(null);
  };
  return (
    <div className="space-y-3">
      <div className="text-xs text-cyan-400 font-mono">CODE LAB FILES</div>
      {files.length === 0 && <div className="text-gray-500 text-sm">No files found.</div>}
      {files.map(file => (
        <div key={file.id} className="glass-panel rounded-lg p-3 border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code size={14} className="text-cyan-400" />
              <span className="text-sm font-mono text-white">{file.name}</span>
              <span className="text-[10px] text-gray-400">.{file.language}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(file)} className="text-gray-400 hover:text-cyan-400"><Edit size={14} /></button>
              <button onClick={() => deleteFile(file.id)} className="text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
          {editingId === file.id && (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full h-32 bg-black/80 border border-cyan-500/30 rounded p-2 font-mono text-xs text-green-400"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => saveEdit(file.id)} className="flex items-center gap-1 text-xs text-green-400"><Save size={12}/> Save</button>
                <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-xs text-gray-400"><X size={12}/> Cancel</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
