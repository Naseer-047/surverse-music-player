import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

const OfflineHandler = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!navigator.onLine) {
            navigate('/downloads');
        }
    }, [navigate]);
    return null;
};

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
    <Router>
      <div className="relative min-h-screen bg-[#F8F8F8]">
        <OfflineHandler />
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

        {/* Offline Notification - Top Banner */}
        <AnimatePresence>
          {isOffline && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="fixed top-0 left-0 right-0 z-[200] bg-red-600 text-white shadow-lg overflow-hidden"
            >
              <div className="px-6 py-3 flex items-center justify-between font-black">
                <div className="flex items-center gap-3">
                  <WifiOff size={18} className="animate-pulse" />
                  <span className="text-[10px] md:text-sm tracking-[0.2em] uppercase">Offline Mode Active</span>
                </div>
                <Link 
                  to="/downloads"
                  className="bg-white text-red-600 px-4 py-1 rounded-full text-[10px] uppercase tracking-widest hover:bg-red-50 transition-colors"
                >
                  Offline Store
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
