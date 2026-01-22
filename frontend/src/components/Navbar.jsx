import React, { useState } from 'react';
import { Search, Music2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import usePlayerStore from '../store/playerStore';

const Navbar = () => {
    const [query, setQuery] = useState('');
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const { toggleSidebar, setSearchQuery } = usePlayerStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchQuery(query);
    };

    return (
        <nav className="z-[60] section-padding py-3 md:py-4 bg-white/40 backdrop-blur-xl border-b border-black/5 flex-shrink-0">
            <div className="flex items-center justify-between gap-4 relative">
                <div className="flex items-center gap-3 group cursor-pointer shrink-0" onClick={toggleSidebar}>
                    <div className="w-12 h-12 md:w-10 md:h-10 bg-black text-white rounded-2xl flex items-center justify-center group-hover:rotate-[15deg] transition-transform shadow-lg">
                        <Music2 className="w-6 h-6 md:w-5 md:h-5" />
                    </div>
                    <h1 className="text-xl font-black tracking-tighter uppercase italic hidden md:block">SurVerse</h1>
                </div>

                {/* DESKTOP SEARCH (Soft Shadow Pill) */}
                <form onSubmit={handleSubmit} className="hidden md:flex flex-1 max-w-xl mx-2 md:mx-24 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 group-focus-within:text-black transition-colors" />
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-[#F2F2F2] hover:bg-[#EBEBEB] focus:bg-white border-none rounded-full py-3.5 pl-14 pr-8 text-sm font-bold focus:ring-0 focus:shadow-xl transition-all duration-300 placeholder:text-black/30 text-black"
                    />
                </form>

                {/* MOBILE SEARCH OVERLAY (FIXED & LARGER) */}
                <AnimatePresence>
                    {isMobileSearchOpen && (
                        <motion.form 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute inset-0 bg-white z-[70] flex items-center px-6 gap-4 shadow-2xl md:hidden"
                            onSubmit={(e) => { handleSubmit(e); setIsMobileSearchOpen(false); }}
                        >
                            <Search className="w-6 h-6 text-black shrink-0" />
                            <input 
                                autoFocus
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                                className="flex-1 bg-transparent border-none text-xl font-black text-black focus:ring-0 placeholder:text-black/20 h-full p-0"
                            />
                             <button 
                                type="button"
                                className="w-12 h-12 flex items-center justify-center bg-black/5 rounded-full shrink-0 active:scale-90 transition-transform"
                                onClick={() => setIsMobileSearchOpen(false)}
                            >
                                <X size={24} />
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-4 md:gap-8 shrink-0">
                    {/* MOBILE SEARCH TOGGLE (LARGER) */}
                    <button 
                        className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center md:hidden hover:bg-black hover:text-white transition-all shadow-md bg-white"
                        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                    >
                        <Search className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
