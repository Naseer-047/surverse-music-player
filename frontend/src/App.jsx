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
import PlaylistModal from './components/PlaylistModal';

function App() {
  const { isSidebarOpen } = usePlayerStore();

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
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>

        <Player />
        <PlaylistModal />
      </div>
    </Router>
  );
}

export default App;
