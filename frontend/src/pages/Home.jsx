import React, { useState, useEffect, useRef } from 'react';
import usePlayerStore from '../store/playerStore';
import { Play, Search, ArrowRight, Music2, Heart, MoreHorizontal, Clock, Star, Sparkles, X, ChevronLeft, ChevronRight, TrendingUp, Disc, Mic, Calendar, Radio, Headphones, Globe, MapPin, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

const Home = () => {
    const { playSong, setQueue, searchQuery } = usePlayerStore();
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

    // MOCK DATA FOR NEW SECTIONS
    const podcasts = [
        { title: "The Music Theory", host: "Ben Neill", category: "Education", image: "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=600" },
        { title: "Song Exploder", host: "Hrishikesh Hirway", category: "Creation", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600" },
        { title: "Switched On Pop", host: "Vulture", category: "Pop Culture", image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=600" },
        { title: "Dissect", host: "Spotify Studios", category: "Analysis", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600" }
    ];

    const events = [
        { day: "24", month: "OCT", title: "Neon Nights Festival", location: "Jio World Garden, Mumbai", price: "₹2499", image: "https://images.unsplash.com/photo-1459749411177-8c27590ff835?q=80&w=800" },
        { day: "02", month: "NOV", title: "Arijit Singh Live", location: "JLN Stadium, Delhi", price: "₹4999", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800" },
        { day: "15", month: "DEC", title: "Sunburn Arena", location: "Vagator, Goa", price: "₹3500", image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=800" }
    ];

    const mixes = [ 
        { name: 'Daily Mix 1', color: 'bg-green-100', artists: 'Arijit, Atif, Pritam' },
        { name: 'Chill Mix', color: 'bg-blue-100', artists: 'Lofi, Acoustic, Soft' },
        { name: 'Workout Mix', color: 'bg-red-100', artists: 'Rap, HipHop, Trap' },
        { name: 'Throwback', color: 'bg-yellow-100', artists: '90s, 00s, Classics' },
        { name: 'Focus Mix', color: 'bg-indigo-100', artists: 'Piano, Ambient, Noise' }
    ];

    const articles = [
        { title: "The Rise of LoFi Hip Hop", readTime: "5 min read", tag: "Culture", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200" },
        { title: "Inside the Studio with Pritam", readTime: "8 min read", tag: "Exclusive", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200" }
    ];

    const indieArtists = [
        { name: "Prateek Kuhad", genre: "Indie Folk", img: "https://ui-avatars.com/api/?name=Prateek+Kuhad&background=random" },
        { name: "The Local Train", genre: "Hindi Rock", img: "https://ui-avatars.com/api/?name=The+Local+Train&background=random" },
        { name: "When Chai Met Toast", genre: "Happy Folk", img: "https://ui-avatars.com/api/?name=When+Chai+Met+Toast&background=random" },
        { name: "Ritviz", genre: "Electronic", img: "https://ui-avatars.com/api/?name=Ritviz&background=random" },
        { name: "Lifafa", genre: "Alternative", img: "https://ui-avatars.com/api/?name=Lifafa&background=random" }
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

    const fetchData = async () => {
        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const [trendingRes, newRes] = await Promise.all([
                fetch(`${baseUrl}/api/search?q=latest hindi hits`),
                fetch(`${baseUrl}/api/search?q=hindi new releases`)
            ]);
            const trendingData = await trendingRes.json();
            const newData = await newRes.json();
            setTrending(filterSongs(trendingData).slice(0, 10));
            setNewArrivals(filterSongs(newData).slice(0, 20));
        } catch (error) {
            console.error("Failed to fetch data", error);
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

    const clearFullChart = () => {
        setIsFullChartActive(false);
        setFullChartSongs([]);
    };

    const clearMood = () => {
        setActiveMood(null);
        setMoodSongs([]);
    };

    const moods = [
        { name: 'Love', image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200' },
        { name: 'Sad', image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1200' },
        { name: 'Gym', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1200' },
        { name: 'Soul', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200' },
        { name: 'Night', image: 'https://images.unsplash.com/photo-1531317135081-37cd88df67b6?q=80&w=1200' },
    ];

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
                                    {activeMood ? `${activeMood} Vibes` : isFullChartActive ? 'Top Charts' : 'Search Results'}
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

                        {/* Song Grid */}
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
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                                <Play size={16} md:size={20} fill="currentColor" className="ml-1"/>
                                            </div>
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
                        {/* 1. HERO SECTION */}
                        <section className="relative h-[60vh] md:h-[85vh] w-full mt-4 overflow-hidden mx-auto max-w-[95%] rounded-[2rem] md:rounded-[3rem] shadow-2xl">
                            <motion.div 
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                                className="absolute inset-0"
                            >
                                <img 
                                    src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2000" 
                                    className="w-full h-full object-cover object-center" 
                                    alt="Hero"
                                />
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 text-center text-white z-10">
                                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="flex flex-col items-center">
                                    <span className="inline-block px-3 py-1 md:px-4 md:py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 md:mb-6">Featured This Week</span>
                                    <h1 className="text-5xl md:text-[9rem] font-black italic tracking-tighter leading-none mb-6">
                                        Electric <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Dreams.</span>
                                    </h1>
                                    <div className="flex items-center justify-center gap-4 md:gap-6">
                                        <button className="bg-white text-black px-6 py-3 md:px-10 md:py-5 rounded-full font-black text-xs md:text-sm tracking-widest hover:scale-105 transition-transform">PLAY</button>
                                        <button className="px-6 py-3 md:px-10 md:py-5 rounded-full border border-white/20 hover:bg-white/10 font-bold text-xs md:text-sm tracking-widest backdrop-blur-md transition-all">SAVE</button>
                                    </div>
                                </motion.div>
                            </div>
                        </section>

                        {/* 2. QUICK PICKS */}
                        <section className="section-padding py-12 md:py-24">
                            <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-6 md:mb-8">Quick Picks</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {mixes.slice(0, 6).map((mix, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl border border-black/5 hover:shadow-lg transition-all cursor-pointer group">
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
                                    <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-2">Global Top 5</h3>
                                    <p className="text-[10px] md:text-sm font-bold opacity-40 uppercase tracking-widest">The world is listening</p>
                                </div>
                                <button className="text-[10px] md:text-xs font-bold border-b border-black pb-1">VIEW ALL</button>
                            </div>
                            <div className="space-y-4">
                                {trending.slice(0, 5).map((song, idx) => (
                                    <div key={song.id} className="flex items-center gap-4 md:gap-8 p-4 md:p-6 bg-white rounded-[2rem] border border-black/5 hover:bg-black hover:text-white transition-all group cursor-pointer" onClick={() => { setQueue(trending); playSong(song, idx); }}>
                                        <span className="text-2xl md:text-4xl font-black italic opacity-20 w-8 md:w-12 text-center group-hover:text-white/20">{idx + 1}</span>
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden shadow-md shrink-0">
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
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 4. DAILY MIXES */}
                        <section className="section-padding py-12 md:py-24">
                            <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-8 md:mb-12">Made For You</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
                                {mixes.map((mix, i) => (
                                    <div key={i} className="group cursor-pointer">
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

                        {/* 5. PODCASTS & ORIGINALS */}
                        <section className="section-padding py-12 md:py-24 bg-[#1a1a1a] text-white rounded-[2rem] md:rounded-[3rem] mx-2 md:mx-12">
                            <div className="container mx-auto px-4 md:px-8">
                                <div className="flex items-center gap-4 mb-8 md:mb-16">
                                    <Mic className="text-purple-400" size={24} />
                                    <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter">Originals</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                    {podcasts.map((pod, i) => (
                                        <div key={i} className="bg-white/5 p-4 rounded-3xl hover:bg-white/10 transition-colors cursor-pointer group flex md:block items-center md:items-start gap-4 md:gap-0">
                                            <div className="aspect-square w-20 md:w-auto rounded-2xl overflow-hidden md:mb-6 relative shadow-2xl shrink-0">
                                                <img src={pod.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black/60 backdrop-blur-md px-2 py-1 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                                    {pod.category}
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-lg md:text-xl font-bold truncate mb-1">{pod.title}</h4>
                                                <p className="text-[10px] md:text-xs font-medium opacity-50 uppercase tracking-widest">Hosted by {pod.host}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* 6. INDIE RADAR */}
                        <section className="section-padding py-12 md:py-24">
                            <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter text-center mb-2">Indie Radar</h3>
                            <p className="text-center text-[10px] md:text-sm font-bold opacity-40 uppercase tracking-widest mb-8 md:mb-16">Discover the underground</p>
                            
                            <div className="flex flex-wrap justify-center gap-8 md:gap-20">
                                {indieArtists.map((artist, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 md:gap-6 group cursor-pointer w-24 md:w-auto">
                                        <div className="w-24 h-24 md:w-56 md:h-56 rounded-full p-1 md:p-2 border-2 border-dashed border-black/10 group-hover:border-purple-500 group-hover:rotate-12 transition-all duration-500">
                                            <div className="w-full h-full rounded-full overflow-hidden relative">
                                                <img src={artist.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-xs md:text-lg font-black uppercase tracking-wider mb-1 truncate w-full">{artist.name}</h4>
                                            <span className="text-[8px] md:text-[10px] font-bold px-2 py-1 bg-black text-white rounded-full">{artist.genre}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 7. LIVE EVENTS */}
                        <section className="section-padding py-12 md:py-24 bg-blue-50">
                            <div className="flex justify-between items-end mb-8 md:mb-16">
                                <div>
                                    <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-2">Live Near You</h3>
                                    <p className="text-[10px] md:text-sm font-bold opacity-40 uppercase tracking-widest">Concerts & Gigs</p>
                                </div>
                                <div className="flex items-center gap-2 opacity-30">
                                    <MapPin size={16} />
                                    <span className="text-[10px] md:text-xs font-bold uppercase hidden md:inline">Mumbai, India</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                                {events.map((event, i) => (
                                    <div key={i} className="bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                                        <div className="h-40 md:h-48 overflow-hidden relative">
                                            <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 md:px-4 md:py-2 rounded-xl flex flex-col items-center shadow-lg">
                                                <span className="text-[10px] md:text-xs font-bold text-red-500 uppercase">{event.month}</span>
                                                <span className="text-lg md:text-2xl font-black">{event.day}</span>
                                            </div>
                                        </div>
                                        <div className="p-6 md:p-8">
                                            <h4 className="text-xl md:text-2xl font-black italic tracking-tight mb-2 truncate">{event.title}</h4>
                                            <p className="text-xs md:text-sm font-bold opacity-50 mb-6 flex items-center gap-2">
                                                <MapPin size={12} /> {event.location}
                                            </p>
                                            <div className="flex justify-between items-center pt-6 border-t border-black/5">
                                                <span className="font-black text-base md:text-lg">{event.price}</span>
                                                <button className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest bg-black text-white px-4 py-2 md:px-6 md:py-3 rounded-full group-hover:bg-blue-600 transition-colors">
                                                    Get Tickets <Ticket size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 8. BEHIND THE MUSIC */}
                        <section className="section-padding py-12 md:py-24">
                            <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-8 md:mb-16">Behind The Music</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                                {articles.map((article, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="rounded-[2rem] md:rounded-[2.5rem] overflow-hidden mb-4 md:mb-8 shadow-xl relative aspect-video">
                                            <img src={article.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute top-4 left-4 md:top-6 md:left-6">
                                                <span className="bg-white text-black px-3 py-1 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg">
                                                    {article.tag}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="pr-4 md:pr-12">
                                            <h4 className="text-2xl md:text-4xl font-black italic tracking-tighter mb-2 md:mb-4 group-hover:underline decoration-4 underline-offset-4 decoration-black/20">{article.title}</h4>
                                            <p className="text-[10px] md:text-sm font-bold opacity-40 uppercase tracking-widest flex items-center gap-3">
                                                <Clock size={14} /> {article.readTime}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 9. GENRE UNIVERSES */}
                        <section className="section-padding py-12 md:py-24 bg-black text-white rounded-t-[2rem] md:rounded-t-[3rem]">
                            <div className="text-center mb-8 md:mb-16">
                                <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-2 md:mb-4">Explore Universes</h3>
                                <p className="opacity-50 font-medium text-sm">Dive deep into the culture</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                                {['Pop', 'Hip-Hop', 'Bollywood', 'Classical', 'Jazz', 'Electronic', 'Rock', 'Indie', 'Acoustic', 'Soul', 'K-Pop', 'Metal', 'R&B'].map((genre, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleSearch(`${genre} songs`)}
                                        className="px-6 py-3 md:px-8 md:py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all font-bold text-[10px] md:text-sm tracking-widest uppercase hover:scale-105"
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-16 md:mt-32 border-t border-white/10 pt-8 md:pt-12 flex flex-col md:flex-row justify-between items-center opacity-40 text-[10px] md:text-xs font-bold uppercase tracking-widest gap-4 md:gap-0">
                                <p>© 2024 SurVerse Music</p>
                                <div className="flex gap-4 md:gap-8">
                                    <span>Privacy</span>
                                    <span>Terms</span>
                                    <span>Creators</span>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
