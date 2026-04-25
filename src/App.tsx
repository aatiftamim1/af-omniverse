import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PasscodeModal } from './components/layout/PasscodeModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { Dashboard } from './pages/Dashboard';
import { ChatPage } from './pages/ChatPage';
import { TrainingPage } from './pages/TrainingPage';
import { CodeLabPage } from './pages/CodeLabPage';
import { EducatorPage } from './pages/EducatorPage';
import { MonitorPage } from './pages/MonitorPage';
import { SyncPage } from './pages/SyncPage';
import { SettingsPage } from './pages/SettingsPage';

const pageMap: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  chat: ChatPage,
  training: TrainingPage,
  codelab: CodeLabPage,
  educator: EducatorPage,
  monitor: MonitorPage,
  sync: SyncPage,
  settings: SettingsPage,
};

function AppContent() {
  const { activePage } = useApp();
  const PageComponent = pageMap[activePage] || Dashboard;

  return (
    <div className="min-h-screen bg-[#07070f]">
      <Header />
      <Sidebar />
      <PasscodeModal />
      <AdminPanel />
      <main className="pt-14 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="max-w-2xl mx-auto"
          >
            <PageComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;