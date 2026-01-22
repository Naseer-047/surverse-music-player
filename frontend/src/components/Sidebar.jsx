import React from 'react';
import { Home, Search, Library, Disc, Heart, User, Settings, Radio, Music2, Sparkles, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import usePlayerStore from '../store/playerStore';
import { motion, AnimatePresence } from 'framer-motion';

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-500 group ${
        isActive
          ? 'bg-black text-white shadow-2xl scale-105'
          : 'text-black/30 hover:text-black hover:bg-black/5'
      }`
    }
  >
    <Icon size={20} className="transition-transform group-hover:rotate-12" />
    <span className="font-bold tracking-tight text-sm">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = usePlayerStore();

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -260 }}
          animate={{ x: 0 }}
          exit={{ x: -260 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }} 
          className="fixed left-0 top-0 bottom-0 w-64 bg-white/40 backdrop-blur-3xl border-r border-black/5 flex flex-col p-6 z-[100]"
        >
          {/* Brand */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4 cursor-pointer" onClick={toggleSidebar}>
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl rotate-3">
                    <Music2 size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tighter uppercase italic">SurVerse</h1>
                    <p className="text-[8px] font-bold opacity-20 tracking-[0.3em] uppercase">Next Gen Music</p>
                </div>
            </div>
            <button onClick={toggleSidebar} className="p-2 opacity-20 hover:opacity-100 transition-opacity">
                <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-4">
            <p className="text-[10px] font-black opacity-20 uppercase tracking-[0.2em] mb-8 ml-4">Main Base</p>
            <NavItem to="/" icon={Home} label="Home Base" />
            <NavItem to="/explore" icon={Sparkles} label="Discovery" />
            <NavItem to="/trending" icon={Disc} label="Trending" />
            
            <div className="pt-12">
                <p className="text-[10px] font-black opacity-20 uppercase tracking-[0.2em] mb-8 ml-4">Personal Space</p>
                <NavItem to="/favorites" icon={Heart} label="Liked Echoes" />
                <NavItem to="/playlists" icon={Library} label="Your Vault" />
            </div>
          </nav>


        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
