import React, { useState, useEffect } from 'react';
import usePlayerStore from '../store/playerStore';
import { Flame, Play, Plus, Heart, TrendingUp, Music2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TrendingPage = () => {
    const { playSong, setQueue, favorites, toggleFavorite, openPlaylistModal } = usePlayerStore();
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrending();
    }, []);

    const fetchTrending = async () => {
        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/search?q=top billboard global hits 2024`);
            const data = await response.json();
            setTrending(data);
        } catch (error) {
            console.error("Trending fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F8F8] pt-36 p-6 lg:p-12 pb-32">
            <header className="flex justify-between items-end mb-16">
                <div>
                    <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter mb-4">Sonic Surge</h1>
                    <p className="text-xs md:text-sm font-bold opacity-40 uppercase tracking-widest">Global charts & viral hits</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-2xl animate-pulse">
                    <Flame size={32} />
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-4 max-w-5xl">
                    {/* MOBILE: Vertical Poster Stack */}
                    <div className="md:hidden space-y-8">
                        {trending.map((song, idx) => (
                             <motion.div 
                                key={song.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl group"
                                onClick={() => { setQueue(trending); playSong(song, idx); }}
                            >
                                <img src={song.image.replace('150x150', '500x500')} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                                
                                {/* Giant Gold Number */}
                                <span className="absolute top-4 right-6 text-9xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600 drop-shadow-2xl opacity-80" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.1)' }}>
                                    {idx + 1}
                                </span>

                                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end">
                                    <h4 className="text-3xl font-black italic text-white leading-none mb-2 line-clamp-2 drop-shadow-lg">{song.title}</h4>
                                    <p className="text-sm font-bold text-white/70 uppercase tracking-widest truncate mb-6">{song.artist}</p>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                                                <Play size={24} fill="currentColor" className="ml-1" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(song); }}
                                                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
                                            >
                                                <Heart size={24} className={favorites.some(f => f.id === song.id) ? "text-red-500 fill-current" : ""} />
                                            </button>
                                        </div>
                                        <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                                            <span className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-1">
                                                <TrendingUp size={12} className="text-green-400" /> Viral
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* DESKTOP: List Layout */}
                    <div className="hidden md:block space-y-4">
                        {trending.map((song, idx) => (
                            <motion.div 
                                key={song.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group flex items-center gap-4 md:gap-8 p-4 md:p-6 bg-white rounded-[2rem] border border-black/5 hover:bg-black hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-2xl"
                                onClick={() => { setQueue(trending); playSong(song, idx); }}
                            >
                                <span className="text-2xl md:text-5xl font-black italic opacity-10 w-12 md:w-20 text-center group-hover:text-white/20">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </span>
                                
                                <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                                    <img src={song.image} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base md:text-2xl font-bold truncate tracking-tight">{song.title}</h4>
                                    <p className="text-[10px] md:text-xs font-bold opacity-50 uppercase tracking-widest truncate">{song.artist}</p>
                                </div>

                                <div className="hidden md:flex flex-col items-end opacity-40 group-hover:opacity-100 px-4">
                                    <span className="text-xs font-bold">Trending</span>
                                    <TrendingUp size={16} className="text-green-500" />
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(song); }}
                                        className={`p-3 rounded-full hover:bg-white/10 ${favorites.some(f => f.id === song.id) ? 'text-red-500' : 'text-inherit'}`}
                                    >
                                        <Heart size={20} fill={favorites.some(f => f.id === song.id) ? "currentColor" : "none"} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); openPlaylistModal(song); }}
                                        className="p-3 rounded-full hover:bg-white/10"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrendingPage;
