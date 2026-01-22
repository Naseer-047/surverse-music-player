import React, { useState } from 'react';
import usePlayerStore from '../store/playerStore';
import { Search, ChevronRight, Music2, Headphones, Radio, Mic2, Disc, Star, Zap, Flame, X, Play, Plus, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
    { name: 'Bollywood Hits', query: 'latest bollywood songs', color: 'bg-orange-500', icon: Flame },
    { name: 'Indie Pop', query: 'indian indie pop', color: 'bg-indigo-500', icon: Music2 },
    { name: 'Hip Hop', query: 'desi hip hop', color: 'bg-blue-600', icon: Mic2 },
    { name: 'Electronic', query: 'indian electronic music', color: 'bg-purple-600', icon: Zap },
    { name: 'Romantic', query: 'bollywood romantic hits', color: 'bg-pink-500', icon: Heart },
    { name: 'Sad Songs', query: 'bollywood sad hits', color: 'bg-slate-700', icon: Disc },
    { name: '90s Classics', query: '90s bollywood hits', color: 'bg-yellow-600', icon: Star },
    { name: 'Party Mix', query: 'bollywood party songs', color: 'bg-red-500', icon: Radio }
];

const moods = [
    { name: 'Chill Vibes', query: 'lofi bollywood', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800' },
    { name: 'Workout', query: 'gym motivation hindi', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?q=80&w=800' },
    { name: 'Meditation', query: 'peaceful indian instrumental', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800' },
    { name: 'Focus', query: 'focus piano hindi', img: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4b?q=80&w=800' }
];

const ExplorePage = () => {
    const { playSong, setQueue, openPlaylistModal, toggleFavorite, favorites } = usePlayerStore();
    const [searchResults, setSearchResults] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCategoryClick = async (category) => {
        setLoading(true);
        setActiveCategory(category.name);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(category.query)}`);
            const data = await response.json();
            setSearchResults(data);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Explore fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F8F8] pt-36 pb-32">
            
            {/* Category Results Overlay */}
            <AnimatePresence>
                {(searchResults.length > 0 || loading) && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[110] bg-white overflow-y-auto no-scrollbar p-6 lg:p-12"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter">{activeCategory}</h2>
                                <p className="text-[10px] md:text-sm font-bold opacity-30 uppercase tracking-widest mt-2">Discovery Hub</p>
                            </div>
                            <button 
                                onClick={() => { setSearchResults([]); setActiveCategory(null); }}
                                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                                <p className="font-bold opacity-20 uppercase tracking-widest text-sm">Scanning sonic waves...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                                {searchResults.map((song, idx) => (
                                    <motion.div 
                                        key={song.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group cursor-pointer"
                                        onClick={() => { setQueue(searchResults); playSong(song, idx); }}
                                    >
                                        <div className="aspect-square rounded-[2rem] overflow-hidden mb-4 relative shadow-lg">
                                            <img src={song.image?.replace('150x150', '500x500')} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(song); }}
                                                    className={`p-2 rounded-full bg-white/20 backdrop-blur-md transition-all ${favorites.some(f => f.id === song.id) ? 'text-red-500' : 'text-white'}`}
                                                >
                                                    <Heart size={20} fill={favorites.some(f => f.id === song.id) ? "currentColor" : "none"} />
                                                </button>
                                                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
                                                    <Play size={24} fill="currentColor" className="ml-1" />
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); openPlaylistModal(song); }}
                                                    className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white transition-all"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <h4 className="font-bold truncate px-2">{song.title}</h4>
                                        <p className="text-[10px] md:text-xs font-bold opacity-40 uppercase truncate px-2">{song.artist}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-6 lg:p-12">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter mb-4">Discovery</h1>
                    <p className="text-xs md:text-sm font-bold opacity-40 uppercase tracking-widest">Unearth the sound of tomorrow</p>
                </header>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
                    {categories.map((cat, i) => (
                        <div 
                            key={i} 
                            onClick={() => handleCategoryClick(cat)}
                            className={`${cat.color} aspect-[16/10] md:aspect-square rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between cursor-pointer group hover:scale-[1.02] transition-all relative overflow-hidden shadow-xl`}
                        >
                            <cat.icon size={48} className="text-white/20 group-hover:scale-125 transition-transform duration-500" />
                            <div className="z-10">
                                <h3 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white leading-none mb-2">{cat.name}</h3>
                                <p className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                                    Explore Now <ChevronRight size={12} />
                                </p>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
                        </div>
                    ))}
                </div>

                {/* Mood Sections */}
                <section>
                    <h3 className="text-2xl md:text-4xl font-black italic tracking-tighter mb-8 px-2">Vibe Check</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {moods.map((mood, i) => (
                            <div 
                                key={i} 
                                onClick={() => handleCategoryClick(mood)}
                                className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer shadow-lg"
                            >
                                <img src={mood.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h4 className="text-xl md:text-2xl font-black italic tracking-tighter text-white">{mood.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ExplorePage;
