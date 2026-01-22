import React, { useState, useRef, useEffect } from 'react';
import usePlayerStore from '../store/playerStore';
import { Play, Pause, CircleDot, Volume2, Maximize2, Minimize2, ChevronDown, ListMusic, Shuffle, Repeat, Plus, Heart, HeartHandshake, ListPlus, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
                    <>
                        {/* ==================== MOBILE PLAYER (md:hidden) ==================== */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="md:hidden fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex flex-col overflow-hidden text-slate-900"
                        >
                            {/* MOBILE TOP BAR */}
                            <div className="flex justify-between items-center px-6 py-6">
                                <button onClick={toggleFullScreen} className="p-3 -ml-3 hover:bg-black/5 rounded-full transition-colors active:scale-90">
                                    <ChevronDown size={28} className="text-slate-900" />
                                </button>
                                <div className="text-center">
                                    <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-black">Now Playing</span>
                                </div>
                                <div className="w-10 h-10" />
                            </div>

                            {/* MOBILE CONTENT - Centered & Compact */}
                            <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8 gap-6">
                                
                                {/* Album Art - Large & Centered */}
                                <motion.div 
                                    layoutId="activeSongImage"
                                    className="relative w-full aspect-square max-w-[300px] shrink-0"
                                >
                                    <img 
                                        src={currentSong.image?.replace('150x150', '500x500') || currentSong.image} 
                                        alt={currentSong.title}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/500/64748b/ffffff?text=No+Image'; }}
                                        className="w-full h-full object-cover rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] bg-slate-100 ring-1 ring-black/5" 
                                    />
                                </motion.div>

                                {/* Song Info */}
                                <div className="text-center w-full space-y-2">
                                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 leading-tight line-clamp-2 px-4">{currentSong.title}</h2>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.15em]">{currentSong.artist}</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full space-y-2 max-w-[340px]">
                                    <div className="relative h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="absolute inset-y-0 left-0 bg-slate-900 rounded-full h-full"
                                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                        />
                                        <input 
                                            type="range" 
                                            min="0" max={duration || 100} 
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 font-mono">
                                        <span>{Math.floor(currentTime/60)}:{('0'+Math.floor(currentTime%60)).slice(-2)}</span>
                                        <span>{Math.floor(duration/60)}:{('0'+Math.floor(duration%60)).slice(-2)}</span>
                                    </div>
                                </div>

                                {/* Main Controls - Modern Filled Icons */}
                                <div className="flex items-center justify-center gap-6 py-4">
                                    <button onClick={prevSong} className="text-slate-400 hover:text-slate-900 transition-all active:scale-90 p-3">
                                        <ChevronLeft size={40} strokeWidth={3} />
                                    </button>
                                    
                                    <button 
                                        onClick={isPlaying ? pauseSong : resumeSong}
                                        className="w-20 h-20 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl"
                                    >
                                        {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                                    </button>

                                    <button onClick={nextSong} className="text-slate-400 hover:text-slate-900 transition-all active:scale-90 p-3">
                                        <ChevronRight size={40} strokeWidth={3} />
                                    </button>
                                </div>

                                {/* Bottom Actions - Modern Icons (NO VOLUME) */}
                                <div className="flex items-center justify-center gap-8 py-4">
                                    <button 
                                        onClick={() => toggleFavorite(currentSong)}
                                        className={`p-3 rounded-full transition-all active:scale-90 ${favorites.some(f => f.id === currentSong.id) ? 'bg-red-50 text-red-500' : 'text-slate-400 hover:text-slate-900'}`}
                                    >
                                        <HeartHandshake size={28} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                                    </button>
                                    <button onClick={() => openPlaylistModal(currentSong)} className="p-3 text-slate-400 hover:text-slate-900 transition-all active:scale-90 rounded-full">
                                        <ListPlus size={28} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* ==================== DESKTOP PLAYER (hidden md:flex) ==================== */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="hidden md:flex fixed inset-0 z-[100] bg-white/90 backdrop-blur-3xl text-slate-900"
                        >
                            {/* DESKTOP LAYOUT - Split Screen */}
                            <div className="w-full h-full flex items-center justify-center p-12">
                                <div className="max-w-7xl w-full h-full flex gap-12 items-center">
                                    
                                    {/* LEFT: Album Art & Progress */}
                                    <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-2xl">
                                        <motion.div 
                                            layoutId="activeSongImage"
                                            className="relative w-full aspect-square max-w-[500px]"
                                        >
                                            <img 
                                                src={currentSong.image?.replace('150x150', '500x500') || currentSong.image} 
                                                alt={currentSong.title}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/500/64748b/ffffff?text=No+Image'; }}
                                                className="w-full h-full object-cover rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] bg-slate-100 ring-1 ring-black/5" 
                                            />
                                        </motion.div>

                                        {/* Progress Bar */}
                                        <div className="w-full space-y-3">
                                            <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden group">
                                                <motion.div 
                                                    className="absolute inset-y-0 left-0 bg-slate-900 rounded-full h-full"
                                                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                                />
                                                <input 
                                                    type="range" 
                                                    min="0" max={duration || 100} 
                                                    value={currentTime}
                                                    onChange={handleSeek}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                            </div>
                                            <div className="flex justify-between text-sm font-bold text-slate-400 font-mono">
                                                <span>{Math.floor(currentTime/60)}:{('0'+Math.floor(currentTime%60)).slice(-2)}</span>
                                                <span>{Math.floor(duration/60)}:{('0'+Math.floor(duration%60)).slice(-2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT: Controls & Info */}
                                    <div className="flex-1 flex flex-col justify-center gap-10 max-w-xl">
                                        
                                        {/* Close Button */}
                                        <button onClick={toggleFullScreen} className="self-end p-3 hover:bg-black/5 rounded-full transition-colors">
                                            <ChevronDown size={32} className="text-slate-400" />
                                        </button>

                                        {/* Song Info */}
                                        <div className="space-y-3">
                                            <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-black">Now Playing</span>
                                            <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-tight">{currentSong.title}</h2>
                                            <p className="text-xl font-bold text-slate-400 uppercase tracking-[0.1em]">{currentSong.artist}</p>
                                        </div>

                                        {/* Main Controls */}
                                        <div className="flex items-center gap-6 py-6">
                                            <button onClick={prevSong} className="text-slate-400 hover:text-slate-900 transition-all active:scale-90 p-3">
                                                <ChevronLeft size={44} strokeWidth={3} />
                                            </button>
                                            
                                            <button 
                                                onClick={isPlaying ? pauseSong : resumeSong}
                                                className="w-24 h-24 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl"
                                            >
                                                {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1.5" />}
                                            </button>

                                            <button onClick={nextSong} className="text-slate-400 hover:text-slate-900 transition-all active:scale-90 p-3">
                                                <ChevronRight size={44} strokeWidth={3} />
                                            </button>
                                        </div>

                                        {/* Secondary Controls */}
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <button 
                                                    onClick={() => toggleFavorite(currentSong)}
                                                    className={`p-3 rounded-full transition-all ${favorites.some(f => f.id === currentSong.id) ? 'bg-red-50 text-red-500' : 'text-slate-400 hover:text-slate-900'}`}
                                                >
                                                    <Heart size={24} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                                                </button>
                                                <button onClick={() => openPlaylistModal(currentSong)} className="p-3 text-slate-400 hover:text-slate-900 transition-all rounded-full">
                                                    <Plus size={24} />
                                                </button>
                                            </div>

                                            {/* Volume Control - DESKTOP ONLY */}
                                            <div className="flex items-center gap-4 bg-slate-50 py-2 px-5 rounded-full border border-slate-200">
                                                <Volume2 size={20} className="text-slate-400" />
                                                <input 
                                                    type="range"
                                                    min="0" max="1" step="0.01"
                                                    value={volume}
                                                    onChange={(e) => setVolume(e.target.value)}
                                                    className="w-32 h-1 bg-slate-200 rounded-full appearance-none accent-slate-900 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* MINIMIZED PILL PLAYER - ABSOLUTE CENTER OF PAGE */}
            {!isFullScreen && (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] md:w-[70%] lg:w-[60%] max-w-3xl z-[60]"
                >
                    <div className="bg-white/98 backdrop-blur-3xl border-2 border-slate-200 shadow-2xl rounded-full px-5 py-4 md:px-8 md:py-5 flex items-center justify-between gap-4 md:gap-6">
                        {/* Album Art & Song Info */}
                        <div onClick={toggleFullScreen} className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 cursor-pointer group">
                            <motion.div 
                                layoutId="activeSongImage"
                                className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shadow-lg relative shrink-0 ring-2 ring-white"
                            >
                                <img 
                                    src={currentSong.image} 
                                    alt={currentSong.title}
                                    className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Maximize2 size={18} className="text-white" strokeWidth={2.5} />
                                </div>
                            </motion.div>
                            <div className="overflow-hidden flex-1">
                                <h4 className="font-black tracking-tight truncate text-sm md:text-base text-slate-900">{currentSong.title}</h4>
                                <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider truncate">{currentSong.artist}</p>
                            </div>
                        </div>

                        {/* Playback Controls - New Filled Icons */}
                        <div className="flex items-center gap-3 md:gap-5 shrink-0">
                            <button 
                                onClick={prevSong} 
                                className="p-3 md:p-3.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all active:scale-90 hover:shadow-md"
                            >
                                <ChevronsLeft size={24} strokeWidth={2.5} fill="currentColor" className="opacity-50" />
                            </button>
                            <button 
                                onClick={isPlaying ? pauseSong : resumeSong}
                                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl hover:shadow-2xl"
                            >
                                {isPlaying ? <Pause size={26} fill="white" strokeWidth={0} /> : <Play size={26} fill="white" strokeWidth={0} className="ml-1" />}
                            </button>
                            <button 
                                onClick={nextSong} 
                                className="p-3 md:p-3.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all active:scale-90 hover:shadow-md"
                            >
                                <ChevronsRight size={24} strokeWidth={2.5} fill="currentColor" className="opacity-50" />
                            </button>
                        </div>

                        {/* Secondary Actions - Desktop Only */}
                        <div className="hidden md:flex items-center gap-2 shrink-0">
                            <button 
                                onClick={() => toggleFavorite(currentSong)}
                                className={`p-2.5 rounded-full transition-all hover:bg-slate-100 ${favorites.some(f => f.id === currentSong.id) ? 'text-pink-500' : 'text-slate-400 hover:text-pink-500'}`}
                            >
                                <Heart size={20} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} strokeWidth={2} />
                            </button>
                            <button 
                                onClick={toggleFullScreen} 
                                className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                            >
                                <Maximize2 size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default Player;
