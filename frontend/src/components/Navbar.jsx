import React, { useState } from 'react';
import { Search, Music2, Sparkles, User, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

import usePlayerStore from '../store/playerStore';

const Navbar = () => {
    const [query, setQuery] = useState('');
    const { toggleSidebar, setSearchQuery } = usePlayerStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchQuery(query);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-[60] section-padding py-3 md:py-4 bg-white/40 backdrop-blur-xl border-b border-black/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 group cursor-pointer shrink-0" onClick={toggleSidebar}>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-xl md:rounded-2xl flex items-center justify-center group-hover:rotate-[15deg] transition-transform">
                    <Music2 className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <h1 className="text-xl font-black tracking-tighter uppercase italic hidden md:block">SurVerse</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 max-w-xl mx-2 md:mx-24 relative">
                <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 opacity-20" />
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-black/5 border-none rounded-full py-2 md:py-3 pl-10 md:pl-16 pr-4 md:pr-8 text-xs md:text-sm font-bold focus:ring-1 focus:ring-black/10 transition-all placeholder:text-black/20"
                />
            </form>

            <div className="flex items-center gap-4 md:gap-8 shrink-0">
                <button className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">
                    <Sparkles className="w-4 h-4" /> Discover
                </button>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer">
                    <User className="w-3 h-3 md:w-4 md:h-4" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
