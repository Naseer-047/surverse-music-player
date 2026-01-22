import React, { useState, useRef, useEffect } from 'react';
import usePlayerStore from '../store/playerStore';
import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize2, Minimize2, ChevronDown, ListMusic, Shuffle, Repeat, Plus, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Player = () => {
    const { 
        currentSong, isPlaying, pauseSong, resumeSong, 
        nextSong, prevSong, volume, setVolume, 
        isFullScreen, toggleFullScreen, isSidebarOpen,
        openPlaylistModal, toggleFavorite, favorites
    } = usePlayerStore();
    
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (audioRef.current && currentSong) {
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Playback failed:", error);
                        // Auto-play might be blocked by browser policy
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSong]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const time = e.target.value;
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    if (!currentSong) return null;

    return (
        <>
            <audio 
                ref={audioRef}
                src={currentSong.url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={nextSong}
            />

            <AnimatePresence>
                {isFullScreen && (
                    <motion.div 
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden text-slate-900"
                    >
                        {/* ----------------MOBILE LAYOUT (Fluid Minimalist)---------------- */}
                        <div className="md:hidden flex flex-col h-full relative">
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 z-20">
                                <button onClick={toggleFullScreen} className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors">
                                    <ChevronDown size={24} />
                                </button>
                                <span className="font-black uppercase tracking-[0.2em] text-slate-300 text-xs">Now Playing</span>
                                <button onClick={() => openPlaylistModal(currentSong)} className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors">
                                    <Plus size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
                                {/* Giant Artwork with Natural Shadow */}
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] bg-white"
                                >
                                    <img src={currentSong.image?.replace('150x150', '500x500')} className="w-full h-full object-cover" />
                                </motion.div>

                                {/* Meta & Controls */}
                                <div className="w-full space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1 max-w-[80%]">
                                            <h2 className="text-3xl font-black italic tracking-tighter leading-none text-slate-900 line-clamp-2">{currentSong.title}</h2>
                                            <p className="text-lg font-bold text-slate-400 uppercase tracking-widest truncate">{currentSong.artist}</p>
                                        </div>
                                         <button 
                                            onClick={() => toggleFavorite(currentSong)}
                                            className="p-3 rounded-full bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90 shadow-sm"
                                        >
                                            <Heart size={28} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} className={favorites.some(f => f.id === currentSong.id) ? "text-red-500" : ""} />
                                        </button>
                                    </div>

                                    {/* Fluid Progress */}
                                    <div className="space-y-2 group">
                                         <input 
                                            type="range" 
                                            min="0" max={duration || 100} 
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="w-full h-3 bg-slate-100 rounded-full appearance-none accent-slate-900 cursor-pointer transition-all"
                                        />
                                        <div className="flex justify-between text-xs font-bold text-slate-300 font-mono tracking-wider px-1">
                                            <span>{Math.floor(currentTime/60)}:{('0'+Math.floor(currentTime%60)).slice(-2)}</span>
                                            <span>{Math.floor(duration/60)}:{('0'+Math.floor(duration%60)).slice(-2)}</span>
                                        </div>
                                    </div>

                                    {/* Big Air Controls */}
                                    <div className="flex justify-between items-center pt-2">
                                        <button className="opacity-30 hover:opacity-100 transition-opacity p-2"><Shuffle size={24} /></button>
                                        <div className="flex items-center gap-8">
                                            <button onClick={prevSong} className="p-4 hover:bg-slate-50 rounded-full transition-colors active:scale-95"><SkipBack size={32} fill="currentColor" /></button>
                                            <button 
                                                onClick={isPlaying ? pauseSong : resumeSong}
                                                className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-200"
                                            >
                                                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                                            </button>
                                            <button onClick={nextSong} className="p-4 hover:bg-slate-50 rounded-full transition-colors active:scale-95"><SkipForward size={32} fill="currentColor" /></button>
                                        </div>
                                        <button className="opacity-30 hover:opacity-100 transition-opacity p-2"><Repeat size={24} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ----------------DESKTOP LAYOUT (Pro Studio Split)---------------- */}
                        <div className="hidden md:flex h-full w-full">
                            {/* Left: Artwork Section */}
                            <div className="w-[45%] h-full bg-slate-50 p-12 flex flex-col justify-center items-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-30 blur-[120px] scale-150 pointer-events-none" style={{ backgroundImage: `url(${currentSong.image})`, backgroundSize: 'cover' }}></div>
                                <motion.div 
                                    layoutId="desktopArt"
                                    className="w-full max-w-xl aspect-square rounded-[3rem] overflow-hidden shadow-2xl z-10 bg-white"
                                >
                                     <img src={currentSong.image?.replace('150x150', '500x500')} className="w-full h-full object-cover" />
                                </motion.div>
                                <button onClick={toggleFullScreen} className="absolute top-8 left-8 p-4 bg-white/50 backdrop-blur-xl rounded-full hover:bg-white transition-all shadow-sm z-20">
                                    <ChevronDown size={24} />
                                </button>
                            </div>

                            {/* Right: Controls Section */}
                            <div className="w-[55%] h-full bg-white flex flex-col justify-center px-24 py-12 relative">
                                <div className="absolute top-12 right-12 flex gap-4">
                                    <button onClick={() => toggleFavorite(currentSong)} className={`p-4 rounded-full border border-slate-100 hover:border-red-200 transition-all active:scale-95 ${favorites.some(f => f.id === currentSong.id) ? 'bg-red-50 text-red-500' : 'hover:bg-slate-50 text-slate-400'}`}>
                                        <Heart size={24} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                                    </button>
                                    <button onClick={() => openPlaylistModal(currentSong)} className="p-4 rounded-full border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all active:scale-95">
                                        <Plus size={24} />
                                    </button>
                                </div>

                                <div className="space-y-16 max-w-2xl">
                                    <div className="space-y-4">
                                        <h2 className="text-7xl font-black italic tracking-tighter text-slate-900 leading-[0.9]">{currentSong.title}</h2>
                                        <p className="text-3xl font-bold text-slate-300 uppercase tracking-widest">{currentSong.artist}</p>
                                    </div>

                                    {/* Minimal Waveform / Progress */}
                                    <div className="space-y-4 group">
                                         <input 
                                            type="range" 
                                            min="0" max={duration || 100} 
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="w-full h-4 bg-slate-100 rounded-full appearance-none accent-slate-900 cursor-pointer hover:h-5 transition-all"
                                        />
                                        <div className="flex justify-between text-sm font-bold text-slate-400 font-mono tracking-wider">
                                            <span>{Math.floor(currentTime/60)}:{('0'+Math.floor(currentTime%60)).slice(-2)}</span>
                                            <span>{Math.floor(duration/60)}:{('0'+Math.floor(duration%60)).slice(-2)}</span>
                                        </div>
                                    </div>

                                    {/* Studio Controls */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <button className="p-4 text-slate-300 hover:text-slate-900 transition-colors"><Shuffle size={28} /></button>
                                            <button className="p-4 text-slate-300 hover:text-slate-900 transition-colors"><Repeat size={28} /></button>
                                        </div>

                                        <div className="flex items-center gap-10">
                                            <button onClick={prevSong} className="p-6 text-slate-900 hover:bg-slate-50 rounded-full transition-all active:scale-95"><SkipBack size={48} strokeWidth={1} fill="currentColor" /></button>
                                            <button 
                                                onClick={isPlaying ? pauseSong : resumeSong}
                                                className="w-32 h-32 bg-slate-900 text-white rounded-[3rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-300"
                                            >
                                                {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
                                            </button>
                                            <button onClick={nextSong} className="p-6 text-slate-900 hover:bg-slate-50 rounded-full transition-all active:scale-95"><SkipForward size={48} strokeWidth={1} fill="currentColor" /></button>
                                        </div>

                                        {/* Volume */}
                                        <div className="flex items-center gap-4 group">
                                            <Volume2 size={24} className="text-slate-300" />
                                            <input 
                                                type="range"
                                                min="0" max="1" step="0.01"
                                                value={volume}
                                                onChange={(e) => setVolume(e.target.value)}
                                                className="w-24 h-2 bg-slate-100 rounded-full appearance-none accent-slate-900 cursor-pointer group-hover:w-32 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* Minimized Player - Floating Pill Redesign */}
            <motion.div 
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`fixed bottom-4 left-4 right-4 md:left-8 md:right-8 z-[60] ${isSidebarOpen ? 'lg:pl-64' : ''} transition-all duration-500`}
            >
                <div className="bg-white/80 backdrop-blur-3xl border border-white/40 shadow-2xl rounded-[2rem] p-2 pr-6 flex items-center justify-between gap-4 max-w-4xl mx-auto ring-1 ring-black/5">
                    <div onClick={toggleFullScreen} className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group hover:bg-white/50 rounded-[1.5rem] pr-4 transition-colors">
                        <motion.div 
                            layoutId="activeSongImage"
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shadow-lg relative shrink-0 border-2 border-white"
                        >
                            <img src={currentSong.image} className="w-full h-full object-cover animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Maximize2 size={16} className="text-white" />
                            </div>
                        </motion.div>
                        <div className="overflow-hidden">
                            <h4 className="font-bold tracking-tight truncate text-sm text-slate-900">{currentSong.title}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{currentSong.artist}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="flex items-center gap-3 md:gap-6">
                            <button onClick={prevSong} className="opacity-40 hover:opacity-100 transition-opacity hidden sm:block p-2 hover:bg-black/5 rounded-full"><SkipBack size={20} fill="currentColor" /></button>
                            <button 
                                onClick={isPlaying ? pauseSong : resumeSong}
                                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-white/20"
                            >
                                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                            </button>
                            <button onClick={nextSong} className="opacity-40 hover:opacity-100 transition-opacity p-2 hover:bg-black/5 rounded-full"><SkipForward size={20} fill="currentColor" /></button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 md:gap-4 shrink-0 border-l border-black/5 pl-4">
                        <button 
                            onClick={() => toggleFavorite(currentSong)}
                            className={`transition-colors p-2 rounded-full hover:bg-black/5 hidden sm:block ${favorites.some(f => f.id === currentSong.id) ? 'text-red-500' : 'text-gray-400 hover:text-black'}`}
                        >
                            <Heart size={20} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                        </button>
                        <button onClick={toggleFullScreen} className="p-2 opacity-40 hover:opacity-100 hover:bg-black/5 rounded-full transition-all">
                            <Maximize2 size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Player;
