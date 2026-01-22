import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import usePlayerStore from '../store/playerStore';
import { Play, Search, ArrowRight, Music2, Heart, MoreHorizontal, Clock, Star, Sparkles, X, ChevronLeft, ChevronRight, TrendingUp, Disc, Mic, Calendar, Radio, Headphones, Globe, MapPin, Ticket, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

const LoadingScreen = () => (
    <motion.div 
        key="loading-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-black to-black" />
        <div className="relative">
            <motion.h1 
                initial={{ filter: "blur(20px)", opacity: 0, letterSpacing: "0.2em" }}
                animate={{ filter: "blur(0px)", opacity: 1, letterSpacing: "-0.05em" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-4xl md:text-[10rem] font-black italic tracking-tighter text-white select-none"
            >
                SURVERSE
            </motion.h1>
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent blur-3xl"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
        </div>
        <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex gap-2 h-8 items-center">
                {[...Array(5)].map((_, i) => (
                    <motion.div 
                        key={i}
                        animate={{ height: [4, 32, 4], opacity: [0.1, 1, 0.1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 md:w-1.5 bg-orange-500 rounded-full"
                    />
                ))}
            </div>
            <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
            >
                <p className="text-[8px] md:text-[10px] font-black tracking-[0.5em] text-white uppercase">Initializing Sonic Core</p>
                <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
                    <motion.div 
                        className="absolute inset-0 bg-orange-500"
                        animate={{ left: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </div>
    </motion.div>
);

const Home = () => {
    const navigate = useNavigate();
    const { playSong, setQueue, searchQuery, playlists, openPlaylistModal, addToPlaylist, toggleFavorite, favorites, setSearchQuery } = usePlayerStore();
    const [trending, setTrending] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [activeMood, setActiveMood] = useState(null);
    const [moodSongs, setMoodSongs] = useState([]);
    const [isFullChartActive, setIsFullChartActive] = useState(false);
    const [fullChartSongs, setFullChartSongs] = useState([]);
    const [heroSong, setHeroSong] = useState(null);
    const [heroVideoId, setHeroVideoId] = useState(null);
    const [trendingArtists, setTrendingArtists] = useState([]);
    const [indieSongs, setIndieSongs] = useState([]);
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
            const seenKeys = new Set();
            const getSongKey = (song) => `${song.title?.toLowerCase().trim()}-${song.artist?.toLowerCase().trim()}`;

            // 1. Fetch Specific Pinned Songs for Global Top 5
            const pinnedQueries = [
                'Chhor Denge',
                'Aaj Se Teri',
                'Dhurandhar Title Track',
                'Tum Kyu Chale Aate Ho',
                'Tum Hi Ho',
                'Pal Pal Dil Ke Paas'
            ];

            const pinnedPromises = pinnedQueries.map(q => 
                fetch(`${baseUrl}/api/search?q=${q}`).then(res => res.json())
            );

            // 2. Fetch New Arrivals (Randomized for variety)
            const newQueries = ['new bollywood songs 2024', 'latest punjabi hits', 'fresh hindi pop', 'new indian hip hop', 'latest party anthems'];
            const randomNewQuery = newQueries[Math.floor(Math.random() * newQueries.length)];
            const newResPromise = fetch(`${baseUrl}/api/search?q=${randomNewQuery}`).then(res => res.json());

            const [pinnedResults, newData] = await Promise.all([
                Promise.all(pinnedPromises),
                newResPromise
            ]);
            
            // Extract the first match for each pinned song & Track Keys
            const curatedTrending = pinnedResults.map(results => results[0]).filter(Boolean);
            curatedTrending.forEach(song => seenKeys.add(getSongKey(song)));
            setTrending(curatedTrending);
            
            // Filter New Arrivals - Exclude already seen songs by Key
            const filteredNew = filterSongs(newData).filter(song => !seenKeys.has(getSongKey(song)));
            const uniqueNewArrivals = filteredNew.length > 0 ? shuffleArray(filteredNew).slice(0, 20) : [];
            uniqueNewArrivals.forEach(song => seenKeys.add(getSongKey(song)));
            setNewArrivals(uniqueNewArrivals); 

            // 3. Fetch Trending Artists (Real Data)
            const artistQuery = 'top indian singers 2024';
            const artistRes = await fetch(`${baseUrl}/api/search?q=${artistQuery}`);
            const artistData = await artistRes.json();
            // Extract unique artists and their images
            const uniqueArtists = [];
            const seenArtists = new Set();
            artistData.forEach(song => {
                if (!seenArtists.has(song.artist) && uniqueArtists.length < 10) {
                    seenArtists.add(song.artist);
                    uniqueArtists.push({
                        name: song.artist,
                        genre: "Trending Artist",
                        img: song.image.replace('150x150', '500x500')
                    });
                }
            });
            setTrendingArtists(uniqueArtists);

            // 4. Fetch Indie Spotlight (Real Data) - Filter Duplicates by Key
            const indieQuery = 'indian indie hits 2024';
            const indieRes = await fetch(`${baseUrl}/api/search?q=${indieQuery}`);
            const indieData = await indieRes.json();
            const filteredIndie = filterSongs(indieData).filter(song => !seenKeys.has(getSongKey(song))).slice(0, 4);
            setIndieSongs(filteredIndie);

            // Pick a Random Hero Song from combined results
            const allInitialSongs = [...curatedTrending, ...uniqueNewArrivals, ...filteredIndie];
            if (allInitialSongs.length > 0) {
                const randomHero = allInitialSongs[Math.floor(Math.random() * allInitialSongs.length)];
                setHeroSong(randomHero);
                fetchHeroVideo(`${randomHero.title} ${randomHero.artist}`);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            setNewArrivals([]);
        } finally {
            // Add a small artificial delay for the premium feel if loading is too fast
            setTimeout(() => setLoading(false), 2000);
        }
    };

    const fetchHeroVideo = async (query) => {
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const res = await fetch(`${baseUrl}/api/youtube/search?q=${query}`);
            const data = await res.json();
            if (data && data.length > 0) {
                setHeroVideoId(data[0].id);
            }
        } catch (e) {
            console.error("Hero video fetch failed", e);
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
        <div className="bg-[#FAFAFA] min-h-screen text-slate-900 select-none pb-0 pt-20 md:pt-32">
            
            {/* 0. LOADING SCREEN */}
            <AnimatePresence mode="wait">
                {loading && <LoadingScreen />}
            </AnimatePresence>

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
                                <p className="text-[10px] md:text-sm font-bold uppercase tracking-widest opacity-40">
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
                        {/* 1. GLOBAL CHART (Now at Top) */}
                        <section className="section-padding py-8 md:py-16">
                            <div className="flex justify-between items-end mb-8 md:mb-12">
                                <div>
                                    <h3 className="text-2xl md:text-5xl font-black italic tracking-tighter mb-2">Global Top Hits</h3>
                                    <p className="text-[10px] md:text-sm font-bold opacity-40 uppercase tracking-widest">The world is listening</p>
                                </div>
                                <button 
                                    onClick={() => navigate('/trending')}
                                    className="text-[10px] md:text-xs font-bold border-b border-black pb-1 hover:text-orange-500 hover:border-orange-500 transition-colors"
                                >
                                    VIEW ALL
                                </button>
                            </div>
                            <div className="space-y-4">
                                {/* MOBILE: Horizontal Card Carousel */}
                                <div className="flex md:hidden overflow-x-auto gap-4 pb-8 snap-x scrollbar-hide -mx-4 px-4">
                                    {trending.slice(0, 6).map((song, idx) => (
                                        <div 
                                            key={song.id} 
                                            className="relative flex-none w-[70vw] snap-center aspect-[3/4] rounded-[2rem] overflow-hidden group shadow-xl"
                                            onClick={() => { setQueue(trending); playSong(song, idx); }}
                                        >
                                            <img src={song.image.replace('150x150', '500x500')} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                                            
                                            {/* Big Rank Number */}
                                            <span className="absolute top-2 right-4 text-8xl font-black italic text-white/10">{idx + 1}</span>
                                            
                                            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                                                <h4 className="text-2xl font-black italic text-white leading-none mb-1 line-clamp-2">{song.title}</h4>
                                                <p className="text-xs font-bold text-white/60 uppercase tracking-widest truncate">{song.artist}</p>
                                                
                                                <div className="flex items-center gap-4 mt-4">
                                                    <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                                                        <Play size={16} fill="currentColor" className="ml-0.5" />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(song); }}>
                                                        <Heart size={20} className={favorites.some(f => f.id === song.id) ? "text-red-500 fill-current" : "text-white"} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* DESKTOP: Vertical List */}
                                <div className="hidden md:flex flex-col gap-4">
                                    {trending.slice(0, 6).map((song, idx) => (
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
                            </div>
                        </section>

                        {/* 2. HERO SECTION - REDESIGNED & HEIGHT INCREASED */}
                        <section className="relative h-[70vh] md:h-[95vh] w-full mt-2 md:mt-4 overflow-hidden mx-auto max-w-[98%] rounded-[2.5rem] md:rounded-[4rem] shadow-2xl group border border-black/5 bg-black">
                            {/* Video Background */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {heroVideoId ? (
                                    <iframe
                                        className="w-[100%] h-[100%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.5] brightness-[0.6]"
                                        src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${heroVideoId}&modestbranding=1&rel=0&showinfo=0`}
                                        title="Hero Video"
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media"
                                    />
                                ) : (
                                    <motion.div 
                                        initial={{ scale: 1 }}
                                        animate={{ scale: 1.05 }}
                                        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                                        className="absolute inset-0"
                                    >
                                        <img 
                                            src={heroSong ? heroSong.image.replace('150x150', '500x500') : "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2000"} 
                                            className="w-full h-full object-cover object-center filter brightness-[0.5]" 
                                            alt="Hero fallback"
                                        />
                                    </motion.div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                            </div>
                            
                            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-20 z-10">
                                <motion.div 
                                    initial={{ y: 50, opacity: 0 }} 
                                    animate={{ y: 0, opacity: 1 }} 
                                    transition={{ duration: 1, ease: "easeOut" }} 
                                    className="max-w-4xl"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="px-4 py-1.5 rounded-full bg-orange-500 text-white text-[10px] md:text-xs font-black tracking-[0.2em] uppercase shadow-lg shadow-orange-500/20">
                                            {heroSong ? "Sonic Spotlight" : "Featured"}
                                        </span>
                                        <div className="flex gap-1">
                                            {[1,2,3].map(i => <motion.div key={i} animate={{ height: [4, 12, 4] }} transition={{ duration: 0.5, repeat: Infinity, delay: i*0.1 }} className="w-1 bg-white/40 rounded-full" />)}
                                        </div>
                                    </div>

                                    <h1 className="text-4xl md:text-9xl font-black italic tracking-tighter leading-[0.9] mb-4 md:mb-6 text-white drop-shadow-2xl line-clamp-2 md:line-clamp-none">
                                        {heroSong ? heroSong.title : "Unleash The Sound"}
                                    </h1>
                                    
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
                                        <p className="text-xs md:text-xl font-bold text-white/70 max-w-xl leading-relaxed italic border-l-4 border-orange-500 pl-4 md:pl-6 line-clamp-2 md:line-clamp-none">
                                            {heroSong ? `Vibe with ${heroSong.artist}. Discover the sonic architecture of today's most viral hits, curated exclusively for the Surverse.` : "Your gateway to the ultimate acoustic universe. Hit play to start your journey."}
                                        </p>

                                        <div className="flex items-center gap-3 md:gap-4">
                                            <button 
                                                onClick={() => {
                                                    if (heroSong) {
                                                        const combinedQueue = [...trending, ...newArrivals, ...indieSongs];
                                                        setQueue(combinedQueue);
                                                        // Find index in combined queue or default to 0
                                                        const idx = combinedQueue.findIndex(s => s.id === heroSong.id);
                                                        playSong(heroSong, idx !== -1 ? idx : 0);
                                                    }
                                                }} 
                                                className="group relative bg-white hover:bg-orange-500 text-black hover:text-white px-6 py-3 md:px-12 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-base tracking-[0.2em] transition-all duration-500 flex items-center gap-2 md:gap-3 shadow-2xl hover:scale-105 active:scale-95 shrink-0"
                                            >
                                                <Play size={18} className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform" fill="currentColor" /> 
                                                LISTEN NOW
                                            </button>
                                            
                                            <button 
                                                onClick={() => heroSong && toggleFavorite(heroSong)}
                                                className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] border-2 flex items-center justify-center backdrop-blur-xl transition-all duration-500 shadow-2xl shrink-0 ${heroSong && favorites.some(f => f.id === heroSong.id) ? 'bg-red-500 border-red-500 text-white scale-110' : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40'}`}
                                            >
                                                <Heart size={20} className="md:w-7 md:h-7" fill={heroSong && favorites.some(f => f.id === heroSong.id) ? "currentColor" : "none"} />
                                            </button>

                                            <button 
                                                onClick={fetchData}
                                                className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-white/5 border-2 border-white/20 flex items-center justify-center backdrop-blur-xl text-white hover:bg-white/10 hover:border-white/40 transition-all duration-500 shrink-0"
                                                title="Refresh Inspiration"
                                            >
                                                <Radio size={20} className="md:w-7 md:h-7 animate-pulse" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-10 right-10 z-10 hidden md:block">
                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-white/20 text-8xl font-black italic tracking-tighter select-none">SURVERSE</div>
                                    <div className="w-32 h-1 bg-gradient-to-r from-transparent to-orange-500 rounded-full" />
                                </div>
                            </div>
                        </section>

                        {/* 3. QUICK PICKS */}
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
                                <button 
                                    onClick={() => navigate('/explore')}
                                    className="text-[10px] md:text-xs font-bold border-b border-black pb-1 hover:text-orange-500 hover:border-orange-500 transition-colors"
                                >
                                    VIEW ALL
                                </button>
                            </div>
                            <div className="flex overflow-x-auto gap-6 md:gap-12 pb-8 scrollbar-hide snap-x">
                                {trendingArtists.map((artist, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 shrink-0 snap-center group cursor-pointer" onClick={() => handleSearch(artist.name)}>
                                        <div className="w-28 h-28 md:w-56 md:h-56 rounded-full p-1 border-2 border-transparent group-hover:border-black/10 transition-all duration-500 relative">
                                            <div className="w-full h-full rounded-full overflow-hidden relative shadow-lg group-hover:shadow-2xl transition-all">
                                                <img src={artist.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Music2 className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center max-w-[120px] md:max-w-[200px]">
                                            <h4 className="text-sm md:text-xl font-black tracking-tight mb-1 truncate">{artist.name}</h4>
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
                                <button 
                                    onClick={() => navigate('/explore')}
                                    className="text-[10px] md:text-xs font-bold border-b border-black pb-1 hover:text-orange-500 hover:border-orange-500 transition-colors"
                                >
                                    VIEW ALL
                                </button>
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

                        {/* 7. INDIE SPOTLIGHT (New Section) */}
                        <section className="section-padding py-12 md:py-24 bg-black text-white rounded-[3rem] md:rounded-[5rem] mx-2 md:mx-4 my-12 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-orange-500/20 transition-all duration-1000" />
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-end mb-12 md:mb-20">
                                    <div>
                                        <span className="text-[10px] md:text-xs font-black tracking-[0.4em] uppercase opacity-40 mb-4 block">Sonic Underground</span>
                                        <h3 className="text-4xl md:text-7xl font-black italic tracking-tighter mb-2">Indie <span className="text-orange-500">Spotlight</span></h3>
                                        <p className="text-[10px] md:text-sm font-bold opacity-40 uppercase tracking-widest">Discover the next big sound before everyone else</p>
                                    </div>
                                    <button 
                                        onClick={() => handleSearch('indian indie hits 2024')}
                                        className="text-[10px] md:text-xs font-bold border-b border-orange-500 pb-1 text-orange-500 hover:text-white hover:border-white transition-colors"
                                    >
                                        EXPLORE INDIE
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {indieSongs.map((song, i) => (
                                        <div key={i} className="group/artist relative aspect-[3/4] rounded-[2.5rem] overflow-hidden cursor-pointer" onClick={() => { setQueue(indieSongs); playSong(song, i); }}>
                                            <img src={song.image.replace('150x150', '500x500')} className="w-full h-full object-cover grayscale group-hover/artist:grayscale-0 group-hover/artist:scale-110 transition-all duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover/artist:opacity-90 transition-opacity" />
                                            
                                            <div className="absolute bottom-6 left-6 right-6">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <span className="w-8 h-[2px] bg-orange-500" />
                                                    <span className="text-[8px] md:text-[10px] font-black tracking-widest uppercase text-orange-500">INDIE HIT</span>
                                                </div>
                                                <h4 className="text-2xl md:text-3xl font-black italic tracking-tighter leading-none mb-2 group-hover/artist:text-orange-500 transition-colors truncate">{song.title}</h4>
                                                <p className="text-sm font-bold opacity-60 uppercase mb-4 truncate">{song.artist}</p>
                                                
                                                <div className="flex items-center justify-between opacity-0 translate-y-4 group-hover/artist:opacity-100 group-hover/artist:translate-y-0 transition-all duration-500">
                                                    <p className="text-[10px] font-bold opacity-40 uppercase">Click to play track</p>
                                                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/artist:bg-orange-500 group-hover/artist:text-white transition-all shadow-lg">
                                                        <Play size={16} fill="currentColor" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
