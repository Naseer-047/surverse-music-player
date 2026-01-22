import React, { useState, useEffect, useRef } from 'react';
import usePlayerStore from '../store/playerStore';
import { Play, Search, ArrowRight, Music2, Heart, MoreHorizontal, Clock, Star, Sparkles, X, ChevronLeft, ChevronRight, TrendingUp, Disc, Mic, Calendar, Radio, Headphones, Globe, MapPin, Ticket, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

const Home = () => {
    const { playSong, setQueue, searchQuery, playlists, openPlaylistModal, addToPlaylist, toggleFavorite, favorites } = usePlayerStore();
    const [trending, setTrending] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [activeMood, setActiveMood] = useState(null);
    const [moodSongs, setMoodSongs] = useState([]);
    const [isFullChartActive, setIsFullChartActive] = useState(false);
    const [fullChartSongs, setFullChartSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    const moodReelRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const mixes = [ 
        { name: 'Daily Mix 1', color: 'bg-green-100', artists: 'Arijit, Atif, Pritam', query: 'arijit singh' },
        { name: 'Chill Mix', color: 'bg-blue-100', artists: 'Lofi, Acoustic, Soft', query: 'lofi' },
        { name: 'Workout Mix', color: 'bg-red-100', artists: 'Rap, HipHop, Trap', query: 'hip hop' },
        { name: 'Throwback', color: 'bg-yellow-100', artists: '90s, 00s, Classics', query: 'old songs' },
        { name: 'Focus Mix', color: 'bg-indigo-100', artists: 'Piano, Ambient, Noise', query: 'instrumental' }
    ];

    const indieArtists = [
        { name: "Prateek Kuhad", genre: "Indie Folk", img: "https://ui-avatars.com/api/?name=Prateek+Kuhad&background=random" },
        { name: "The Local Train", genre: "Hindi Rock", img: "https://ui-avatars.com/api/?name=The+Local+Train&background=random" },
        { name: "When Chai Met Toast", genre: "Happy Folk", img: "https://ui-avatars.com/api/?name=When+Chai+Met+Toast&background=random" },
        { name: "Ritviz", genre: "Electronic", img: "https://ui-avatars.com/api/?name=Ritviz&background=random" },
        { name: "Lifafa", genre: "Alternative", img: "https://ui-avatars.com/api/?name=Lifafa&background=random" }
    ];

    const moods = [
        { name: 'Love', image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200' },
        { name: 'Sad', image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1200' },
        { name: 'Gym', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1200' },
        { name: 'Soul', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200' },
        { name: 'Night', image: 'https://images.unsplash.com/photo-1531317135081-37cd88df67b6?q=80&w=1200' },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            handleSearch(searchQuery);
        }
    }, [searchQuery]);

    const filterSongs = (songs) => {
        if (!Array.isArray(songs)) return [];
        return songs.filter(song => {
            const title = song.title?.toLowerCase() || "";
            const artist = song.artist?.toLowerCase() || "";
            return !title.includes("hanuman") && !artist.includes("hanuman");
        });
    };

    // Helper to shuffle array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            
            // Random Queries for variety
            const trendingQueries = ['top global hits', 'viral tiktok songs', 'billboard top 100', 'global viral 50', 'hits 2024'];
            const newQueries = ['new bollywood songs 2024', 'latest punjabi hits', 'fresh hindi pop', 'new indian hip hop', 'latest party anthems'];
            
            const randomTrendingQuery = trendingQueries[Math.floor(Math.random() * trendingQueries.length)];
            const randomNewQuery = newQueries[Math.floor(Math.random() * newQueries.length)];

            const [trendingRes, newRes] = await Promise.all([
                fetch(`${baseUrl}/api/search?q=${randomTrendingQuery}`),
                fetch(`${baseUrl}/api/search?q=${randomNewQuery}`)
            ]);
            
            const trendingData = await trendingRes.json();
            const newData = await newRes.json();
            
            // Shuffle and filter results
            setTrending(shuffleArray(filterSongs(trendingData)).slice(0, 10));
            
            const filteredNew = filterSongs(newData);
            // Shuffle new arrivals too
            setNewArrivals(filteredNew.length > 0 ? shuffleArray(filteredNew).slice(0, 20) : []); 
        } catch (error) {
            console.error("Failed to fetch data", error);
            setNewArrivals([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        if (!query) return;
        setLoading(true);
        setActiveMood(null);
        setIsFullChartActive(false);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/search?q=${query}`);
            const data = await response.json();
            setSearchResults(filterSongs(data));
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMoodClick = async (moodName) => {
        setLoading(true);
        setActiveMood(moodName);
        setSearchResults([]);
        setIsFullChartActive(false);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/search?q=${moodName} songs`);
            const data = await response.json();
            setMoodSongs(filterSongs(data));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Mood fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMixClick = async (mixName, query) => {
        setLoading(true);
        setActiveMood(mixName);
        setSearchResults([]);
        setIsFullChartActive(false);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/search?q=${query}`);
            const data = await response.json();
            setMoodSongs(filterSongs(data));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Mix fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeeFullChart = async () => {
        setLoading(true);
        setIsFullChartActive(true);
        setSearchResults([]);
        setActiveMood(null);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/search?q=latest hindi blockbuster hits`);
            const data = await response.json();
            setFullChartSongs(filterSongs(data));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Chart fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - moodReelRef.current.offsetLeft);
        setScrollLeft(moodReelRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - moodReelRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        moodReelRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="bg-[#FAFAFA] min-h-screen text-slate-900 select-none pb-32">
            
            {/* Search/Mood/Chart Results Overlay */}
            <AnimatePresence mode="wait">
                {(searchResults.length > 0 || activeMood || isFullChartActive) ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 20 }} 
                        className="section-padding py-16 md:py-32 min-h-screen bg-white relative z-10"
                    >
                        {/* Header Area */}
                        <div className="flex justify-between items-end mb-8 md:mb-12 border-b border-black/5 pb-4 md:pb-8">
                           <div>
                                <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-2">
                                    {activeMood ? (activeMood.includes('Mix') ? activeMood : `${activeMood} Vibes`) : isFullChartActive ? 'Top Charts' : 'Search Results'}
                                </h2>
                                <p className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-40">
                                    {activeMood ? 'Curated for your mood' : isFullChartActive ? 'Global top 50' : `Found ${searchResults.length} matches`}
                                </p>
                           </div>
                           <button 
                                onClick={() => { setSearchResults([]); setActiveMood(null); setIsFullChartActive(false); }}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                            >
                                <X size={20} />
                           </button>
                        </div>

                        {/* Song Grid for Overlay */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
                            {(activeMood ? moodSongs : isFullChartActive ? fullChartSongs : searchResults).map((song, idx) => (
                                <motion.div 
                                    key={song.id} 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group cursor-pointer bg-white p-3 md:p-4 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-black/5"
                                    onClick={() => { setQueue(activeMood ? moodSongs : isFullChartActive ? fullChartSongs : searchResults); playSong(song, idx); }}
                                >
                                    <div className="aspect-square rounded-2xl overflow-hidden mb-3 md:mb-5 relative">
                                        <img src={song.image.replace('150x150', '500x500')} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 gap-2">
                                                <Play size={16} md:size={20} fill="currentColor" className="ml-1"/>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); openPlaylistModal(song); }}
                                                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors transform scale-0 group-hover:scale-100"
                                            >
                                                <Plus size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(song); }}
                                                className={`absolute top-2 left-2 p-2 bg-black/50 rounded-full hover:bg-black transition-colors transform scale-0 group-hover:scale-100 ${favorites.some(f => f.id === song.id) ? 'text-red-500 opacity-100 scale-100' : 'text-white'}`}
                                            >
                                                <Heart size={16} fill={favorites.some(f => f.id === song.id) ? "currentColor" : "none"} />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="text-sm md:text-lg font-bold tracking-tight truncate mb-1">{song.title}</h4>
                                    <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">{song.artist}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* 1. HERO SECTION - REDESIGNED */}
                        <section className="relative h-[50vh] md:h-[60vh] w-full mt-2 md:mt-4 overflow-hidden mx-auto max-w-[98%] rounded-[2rem] md:rounded-[3rem] shadow-2xl group">
                            <motion.div 
                                initial={{ scale: 1 }}
                                animate={{ scale: 1.05 }}
                                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                                className="absolute inset-0"
                            >
                                <img 
                                    src={trending.length > 0 ? trending[0].image.replace('150x150', '500x500') : "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2000"} 
                                    className="w-full h-full object-cover object-center filter brightness-[0.7] group-hover:brightness-90 transition-all duration-700" 
                                    alt="Hero"
                                />
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            
                            <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white z-10 w-full md:w-2/3">
                                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="flex flex-col items-start text-left">
                                    <span className="inline-block px-3 py-1 mb-2 md:mb-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-[10px] md:text-xs font-bold tracking-widest uppercase">
                                        {trending.length > 0 ? "Trending Now" : "Spotlight"}
                                    </span>
                                    <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter leading-none mb-2 md:mb-6 line-clamp-2">
                                        {trending.length > 0 ? trending[0].title : "The Weekend Vibes"}
                                    </h1>
                                    <p className="text-xs md:text-lg font-medium opacity-80 mb-4 md:mb-8 max-w-lg line-clamp-2">
                                        {trending.length > 0 ? `Listen to the #1 hit by ${trending[0].artist}` : "Experience the ultimate sonic journey with our curated playlist."}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => trending.length > 0 && playSong(trending[0], 0)} 
                                            className="bg-white text-black px-6 py-3 md:px-10 md:py-4 rounded-full font-black text-xs md:text-sm tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
                                        >
                                            <Play size={18} fill="currentColor" /> PLAY NOW
                                        </button>
                                        <button 
                                            onClick={() => trending.length > 0 && toggleFavorite(trending[0])}
                                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md transition-all ${trending.length > 0 && favorites.some(f => f.id === trending[0].id) ? 'bg-red-500 border-red-500 text-white' : 'hover:bg-white/10 text-white'}`}
                                        >
                                            <Heart size={20} fill={trending.length > 0 && favorites.some(f => f.id === trending[0].id) ? "currentColor" : "none"} />
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </section>

                        {/* 2. QUICK PICKS */}
                        <section className="section-padding py-12 md:py-24">
                            <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-6 md:mb-8">Quick Picks</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {mixes.slice(0, 6).map((mix, i) => (
                                    <div key={i} onClick={() => handleMixClick(mix.name, mix.query)} className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl border border-black/5 hover:shadow-lg transition-all cursor-pointer group">
                                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${mix.color} flex items-center justify-center shadow-inner`}>
                                            <Music2 size={20} className="opacity-50" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold truncate text-sm md:text-base">{mix.name}</h4>
                                            <p className="text-[10px] opacity-40 font-bold uppercase truncate">{mix.artists}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hidden md:flex">
                                            <Play size={12} fill="currentColor" className="ml-0.5"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 3. GLOBAL CHART */}
                        <section className="section-padding py-8 md:py-12">
                            <div className="flex justify-between items-end mb-8 md:mb-12">
                                <div>
                                    <h3 className="text-2xl md:text-5xl font-black italic tracking-tighter mb-2">Global Top 5</h3>
                                    <p className="text-[10px] md:text-sm font-bold opacity-40 uppercase tracking-widest">The world is listening</p>
                                </div>
                                <button className="text-[10px] md:text-xs font-bold border-b border-black pb-1">VIEW ALL</button>
                            </div>
                            <div className="space-y-4">
                                {trending.slice(0, 5).map((song, idx) => (
                                    <div key={song.id} className="flex items-center gap-4 md:gap-8 p-4 md:p-6 bg-white rounded-[2rem] border border-black/5 hover:bg-black hover:text-white transition-all group cursor-pointer" onClick={() => { setQueue(trending); playSong(song, idx); }}>
                                        <span className="text-2xl md:text-4xl font-black italic opacity-20 w-8 md:w-12 text-center group-hover:text-white/20">{idx + 1}</span>
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden shadow-md ">
                                            <img src={song.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm md:text-xl font-bold truncate">{song.title}</h4>
                                            <p className="text-[10px] md:text-xs opacity-50 font-bold uppercase truncate">{song.artist}</p>
                                        </div>
                                        <div className="flex flex-col items-end opacity-40 group-hover:opacity-100 whitespace-nowrap">
                                             <span className="text-[10px] md:text-xs font-bold">12.4M</span>
                                             <TrendingUp size={14} className="mt-1 text-green-500" />
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(song); }}
                                            className={`p-3 opacity-0 group-hover:opacity-100 transition-all invisible md:visible ${favorites.some(f => f.id === song.id) ? 'text-red-500' : 'hover:text-red-500'}`}
                                        >
                                            <Heart size={20} fill={favorites.some(f => f.id === song.id) ? "currentColor" : "none"} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); openPlaylistModal(song); }}
                                            className="p-3 opacity-0 group-hover:opacity-100 hover:text-green-500 transition-all invisible md:visible"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 4. DAILY MIXES */}
                        <section className="section-padding py-12 md:py-24">
                            <h3 className="text-2xl md:text-5xl font-black italic tracking-tighter mb-8 md:mb-12">Made For You</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
                                {mixes.map((mix, i) => (
                                    <div key={i} onClick={() => handleMixClick(mix.name, mix.query)} className="group cursor-pointer">
                                        <div className={`aspect-square ${mix.color} rounded-[2rem] mb-4 relative overflow-hidden p-4 md:p-6 flex flex-col justify-between transition-transform duration-500 group-hover:scale-105 shadow-xl`}>
                                            <Music2 size={32} className="opacity-10 absolute top-4 right-4 md:scale-150" />
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/10 flex items-center justify-center">
                                                <Disc className="opacity-50" size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl md:text-3xl font-black italic tracking-tighter leading-none mb-1">{mix.name.split(' ')[0]}</h4>
                                                <h4 className="text-xl md:text-3xl font-black italic tracking-tighter leading-none opacity-50">{mix.name.split(' ')[1]}</h4>
                                            </div>
                                        </div>
                                        <p className="text-[10px] md:text-xs font-bold opacity-50 uppercase tracking-wider line-clamp-1">{mix.artists}...</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 5. TRENDING ARTISTS */}
                        <section className="section-padding py-12 md:py-24">
                            <div className="flex justify-between items-end mb-8 md:mb-12">
                                <div>
                                    <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-2">Trending Artists</h3>
                                    <p className="text-[10px] md:text-sm font-bold opacity-40 uppercase tracking-widest">Who is taking over</p>
                                </div>
                            </div>
                            <div className="flex overflow-x-auto gap-6 md:gap-12 pb-8 scrollbar-hide snap-x">
                                {indieArtists.concat(indieArtists).map((artist, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 shrink-0 snap-center group cursor-pointer">
                                        <div className="w-28 h-28 md:w-56 md:h-56 rounded-full p-1 border-2 border-transparent group-hover:border-black/10 transition-all duration-500 relative">
                                            <div className="w-full h-full rounded-full overflow-hidden relative shadow-lg group-hover:shadow-2xl transition-all">
                                                <img src={artist.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Music2 className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-sm md:text-xl font-black tracking-tight mb-1">{artist.name}</h4>
                                            <p className="text-[10px] md:text-xs font-bold opacity-40 uppercase tracking-widest">{artist.genre}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 6. FRESH ARRIVALS */}
                        <section className="section-padding py-12 md:py-24">
                             <div className="flex justify-between items-end mb-8 md:mb-12">
                                <div>
                                    <h3 className="text-2xl md:text-5xl font-black italic tracking-tighter mb-2">Fresh Arrivals</h3>
                                    <p className="text-[10px] md:text-sm font-bold opacity-40 uppercase tracking-widest">Just landed from the studio</p>
                                </div>
                            </div>
                            <div className="flex overflow-x-auto gap-4 md:gap-8 pb-8 scrollbar-hide snap-x">
                                {newArrivals.map((song, i) => (
                                    <div key={song.id} className="min-w-[140px] md:min-w-[200px] snap-center group cursor-pointer" onClick={() => { setQueue(newArrivals); playSong(song, i); }}>
                                        <div className="aspect-square rounded-2xl overflow-hidden mb-3 md:mb-4 relative shadow-lg">
                                            <img src={song.image.replace('150x150', '500x500')} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 gap-2">
                                                    <Play size={16} md:size={20} fill="currentColor" className="ml-1"/>
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); openPlaylistModal(song); }}
                                                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors transform scale-0 group-hover:scale-100"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(song); }}
                                                    className={`absolute top-2 left-2 p-2 bg-black/50 rounded-full hover:bg-black transition-colors transform scale-0 group-hover:scale-100 ${favorites.some(f => f.id === song.id) ? 'text-red-500 opacity-100 scale-100' : 'text-white'}`}
                                                >
                                                    <Heart size={16} fill={favorites.some(f => f.id === song.id) ? "currentColor" : "none"} />
                                                </button>
                                            </div>
                                        </div>
                                        <h4 className="text-sm md:text-lg font-bold truncate">{song.title}</h4>
                                        <p className="text-[10px] md:text-xs font-bold opacity-40 uppercase truncate">{song.artist}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 7. VIBE STATION */}
                        <section className="section-padding py-12 md:py-24">
                            <h3 className="text-2xl md:text-5xl font-black italic tracking-tighter mb-8 md:mb-12">Vibe Station</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {moods.map((mood, i) => (
                                    <div key={i} onClick={() => handleMoodClick(mood.name)} className={`aspect-[4/3] rounded-[2rem] relative overflow-hidden group cursor-pointer ${i === 0 ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2 aspect-square' : ''}`}>
                                        <img src={mood.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                                            <h4 className={`font-black italic tracking-tighter text-white ${i === 0 ? 'text-4xl md:text-6xl' : 'text-xl md:text-3xl'}`}>{mood.name}</h4>
                                        </div>
                                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight className="text-white" size={i === 0 ? 32 : 16} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 10. FOOTER */}
                        <Footer />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
