import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import usePlayerStore from './store/playerStore';
import Player from './components/Player';

import Navbar from './components/Navbar';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  const { isSidebarOpen } = usePlayerStore();

  return (
    <Router>
      <div className="min-h-screen bg-[#F8F8F8]">
        <Sidebar />
        <main className={`${isSidebarOpen ? 'lg:pl-64' : ''} transition-all duration-500 relative pb-32`}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlists" element={<PlaceholderPage title="Your Vault" />} />
            <Route path="/explore" element={<PlaceholderPage title="Discovery" />} />
            <Route path="/trending" element={<PlaceholderPage title="Trending" />} />
            <Route path="/favorites" element={<PlaceholderPage title="Liked Echoes" />} />
          </Routes>
        </main>
        <Player />
      </div>
    </Router>
  );
}

export default App;
