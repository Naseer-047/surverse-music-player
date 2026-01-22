import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import usePlayerStore from './store/playerStore';
import Player from './components/Player';
import Navbar from './components/Navbar';
import PlaylistPage from './pages/PlaylistPage';
import FavoritesPage from './pages/FavoritesPage';
import ExplorePage from './pages/ExplorePage';
import TrendingPage from './pages/TrendingPage';
import Downloads from './pages/Downloads';
import PlaylistModal from './components/PlaylistModal';
import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { isSidebarOpen, setDeferredPrompt } = usePlayerStore();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      console.log('beforeinstallprompt event fired');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setDeferredPrompt]);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="relative min-h-screen bg-[#F8F8F8]">
        {/* Sidebar remains fixed but is managed by the layout push */}
        <Sidebar />
        
        {/* Main Content Hub - Max Width Centered */}
        <div className="max-w-[1600px] mx-auto relative flex flex-col min-h-screen">
          <main className={`${isSidebarOpen ? 'lg:pl-64' : ''} transition-all duration-500 relative flex-1 flex flex-col overflow-x-hidden`}>
            <Navbar />
            <div className="flex-1 w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/playlists" element={<PlaylistPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>

        <Player />
        <PlaylistModal />

        {/* Offline Notification */}
        <AnimatePresence>
          {isOffline && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold"
            >
              <WifiOff size={20} />
              <span>You're offline. Playing from Downloads.</span>
              <button 
                onClick={() => window.location.href = '#/downloads'}
                className="bg-white text-red-600 px-3 py-1 rounded-full text-xs hover:bg-red-50 transition-colors"
              >
                Go to Downloads
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
