import { useState } from 'react';
import { Menu, X, Bot, Terminal, Code, Cpu, Sliders, FolderOpen, Activity as ActivityIcon, Mic, Navigation, Skull, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EdithGenUI } from './EdithGenUI';
import { EdithTerminal } from './EdithTerminal';
import { LiveInjector } from './LiveInjector';
import { CentralIntel } from './CentralIntel';
import { SystemOverride } from './SystemOverride';
import { FileExplorer } from './FileExplorer';
import { LiveLogs } from './LiveLogs';
import { ProcessManager } from './ProcessManager';
import { VoiceCommander } from './VoiceCommander';
import { HiddenBackdoor } from './HiddenBackdoor';
import { SelfDestruct } from './SelfDestruct';
import { AutoBuilder } from './AutoBuilder';
import { EdithSettings } from './EdithSettings';

type TabId = 'ai'|'terminal'|'injector'|'intel'|'override'|'files'|'logs'|'process'|'voice'|'backdoor'|'destruct'|'autobuilder'|'settings';
const tabs: { id: TabId; label: string; icon: any }[] = [
  { id: 'ai', label: 'AI Nexus', icon: Bot },
  { id: 'autobuilder', label: 'Builder', icon: Code },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'injector', label: 'Injector', icon: Code },
  { id: 'intel', label: 'Intel', icon: Cpu },
  { id: 'override', label: 'Override', icon: Sliders },
  { id: 'files', label: 'File Explorer', icon: FolderOpen },
  { id: 'logs', label: 'Live Logs', icon: ActivityIcon },
  { id: 'process', label: 'Process Manager', icon: ActivityIcon },
  { id: 'voice', label: 'Voice Commander', icon: Mic },
  { id: 'backdoor', label: 'Backdoor', icon: Navigation },
  { id: 'destruct', label: 'Self Destruct', icon: Skull },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function EdithPage() {
  const [activeTab, setActiveTab] = useState<TabId>('ai');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const renderContent = () => {
    switch(activeTab){
      case 'ai': return <EdithGenUI />;
      case 'autobuilder': return <AutoBuilder />;
      case 'terminal': return <EdithTerminal />;
      case 'injector': return <LiveInjector />;
      case 'intel': return <CentralIntel />;
      case 'override': return <SystemOverride />;
      case 'files': return <FileExplorer />;
      case 'logs': return <LiveLogs />;
      case 'process': return <ProcessManager />;
      case 'voice': return <VoiceCommander />;
      case 'backdoor': return <HiddenBackdoor />;
      case 'destruct': return <SelfDestruct />;
      case 'settings': return <EdithSettings />;
      default: return <EdithGenUI />;
    }
  };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxwYXRoIGQ9Ik0wIDBoNHY0SDB6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGZmODgiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan" />
      <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur md:hidden">{sidebarOpen?<X size={20}/>:<Menu size={20}/>}</button>
      <AnimatePresence mode="wait">{sidebarOpen&&<motion.aside initial={{x:-280}} animate={{x:0}} exit={{x:-280}} transition={{type:'spring',damping:25}} className="absolute md:relative z-40 w-64 h-full bg-black/60 backdrop-blur-xl border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center"><span className="text-cyan-400 font-bold">E</span></div><div><h1 className="text-lg font-mono font-bold text-white">EDITH</h1><p className="text-[9px] text-gray-400">v2.0 · OWNER MODE</p></div></div></div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">{tabs.map(tab=><button key={tab.id} onClick={()=>{setActiveTab(tab.id);if(window.innerWidth<768)setSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${activeTab===tab.id?'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border border-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/10':'text-gray-400 hover:text-white hover:bg-white/5'}`}><tab.icon size={18}/><span className="text-sm font-mono">{tab.label}</span></button>)}</nav>
        <div className="p-4 border-t border-white/10"><button onClick={()=>navigate('/')} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"><LogOut size={16}/><span className="text-sm font-mono">Exit EDITH</span></button></div>
      </motion.aside>}</AnimatePresence>
      <main className="flex-1 h-full overflow-hidden p-4 md:p-6"><div className="max-w-5xl mx-auto h-full min-h-0">{renderContent()}</div></main>
      <style>{`@keyframes scan{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}.animate-scan{animation:scan 4s linear infinite;}`}</style>
    </div>
  );
}
