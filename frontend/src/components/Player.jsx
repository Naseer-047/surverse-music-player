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
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                        className="fixed inset-0 z-[100] bg-white/70 backdrop-blur-[50px] flex flex-col overflow-hidden text-slate-800"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-8 py-6 z-20 shrink-0">
                            <button onClick={toggleFullScreen} className="p-2 hover:bg-black/5 rounded-full transition-colors active:scale-90">
                                <ChevronDown size={24} className="opacity-40" />
                            </button>
                            <div className="text-center font-bold">
                                <span className="text-[10px] uppercase tracking-[0.4em] opacity-30 block">Now Playing</span>
                                <h3 className="text-[11px] uppercase tracking-widest opacity-60 truncate max-w-[180px]">{currentSong.title}</h3>
                            </div>
                            <div className="w-10 h-10" />
                        </div>

                        {/* Main Body */}
                        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-4xl mx-auto w-full gap-8 md:gap-12">
                            
                            {/* Visuals: Image + Volume Slider */}
                            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
                                {/* Large Floating Artwork */}
                                <motion.div 
                                    layoutId={`artwork-${currentSong.id}`}
                                    className="relative w-[70vw] h-[70vw] max-w-[340px] max-h-[340px] md:w-[400px] md:h-[400px] shrink-0"
                                >
                                    <div className="absolute inset-0 bg-black/10 blur-3xl translate-y-12 scale-90 opacity-40 rounded-full" />
                                    <img 
                                        src={currentSong.image?.replace('150x150', '600x600')} 
                                        className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl border border-white/20 relative z-10" 
                                    />
                                </motion.div>

                                {/* Side Volume - Premium Horizontal Slider */}
                                <div className="flex items-center gap-4 bg-black/5 py-3 px-5 rounded-2xl border border-white shadow-sm">
                                    <Volume2 size={20} className="opacity-30" />
                                    <input 
                                        type="range"
                                        min="0" max="1" step="0.01"
                                        value={volume}
                                        onChange={(e) => setVolume(e.target.value)}
                                        className="w-32 md:w-40 h-1 bg-black/10 rounded-full appearance-none accent-black cursor-pointer hover:bg-black/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Song Details */}
                            <div className="text-center space-y-3 max-w-lg">
                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none text-black drop-shadow-sm">{currentSong.title}</h2>
                                <p className="text-sm md:text-base font-bold opacity-40 uppercase tracking-[0.2em]">{currentSong.artist}</p>
                            </div>

                            {/* Controls Card Layer */}
                            <div className="w-full max-w-md space-y-10">
                                {/* Progress Bar */}
                                <div className="space-y-3 group px-2">
                                    <input 
                                        type="range" 
                                        min="0" max={duration || 100} 
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="w-full h-1 bg-black/5 rounded-full appearance-none accent-black cursor-pointer group-hover:h-1.5 transition-all"
                                    />
                                    <div className="flex justify-between text-[11px] font-bold opacity-30 font-mono tracking-widest">
                                        <span>{Math.floor(currentTime/60)}:{('0'+Math.floor(currentTime%60)).slice(-2)}</span>
                                        <span>{Math.floor(duration/60)}:{('0'+Math.floor(duration%60)).slice(-2)}</span>
                                    </div>
                                </div>

                                {/* Main Button Row */}
                                <div className="flex items-center justify-between gap-4 md:gap-8 bg-white/40 p-3 rounded-[3rem] border border-white/50 shadow-xl backdrop-blur-xl">
                                    <button 
                                        onClick={() => toggleFavorite(currentSong)}
                                        className={`p-4 rounded-full transition-all hover:bg-red-50 active:scale-90 ${favorites.some(f => f.id === currentSong.id) ? 'text-red-500' : 'text-slate-300 hover:text-slate-900'}`}
                                    >
                                        <Heart size={28} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                                    </button>

                                    <div className="flex items-center gap-4 md:gap-8">
                                        <button onClick={prevSong} className="p-4 hover:bg-black/5 rounded-full transition-all active:scale-90 opacity-60 hover:opacity-100">
                                            <SkipBack size={28} fill="currentColor" strokeWidth={0} />
                                        </button>
                                        <button 
                                            onClick={isPlaying ? pauseSong : resumeSong}
                                            className="w-20 h-20 bg-black text-white rounded-[2rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                                        >
                                            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                                        </button>
                                        <button onClick={nextSong} className="p-4 hover:bg-black/5 rounded-full transition-all active:scale-90 opacity-60 hover:opacity-100">
                                            <SkipForward size={28} fill="currentColor" strokeWidth={0} />
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => openPlaylistModal(currentSong)}
                                        className="p-4 rounded-full text-slate-300 hover:bg-black/5 hover:text-slate-900 transition-all active:scale-90"
                                    >
                                        <Plus size={28} />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Minimized Player - Floating Pill Redesign (Larger Mobile) */}
            <motion.div 
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`fixed bottom-6 left-4 right-4 md:bottom-8 md:left-8 md:right-8 z-[60] ${isSidebarOpen ? 'lg:pl-64' : ''} transition-all duration-500`}
            >
                <div className="bg-white/80 backdrop-blur-3xl border border-white/40 shadow-2xl rounded-[2.5rem] p-3 pr-5 flex items-center justify-between gap-4 max-w-4xl mx-auto ring-1 ring-black/5">
                    <div onClick={toggleFullScreen} className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer group hover:bg-white/50 rounded-[2rem] pr-4 transition-colors">
                        <motion.div 
                            layoutId="activeSongImage"
                            className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-lg relative shrink-0 border-2 border-white"
                        >
                            <img src={currentSong.image} className="w-full h-full object-cover animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Maximize2 size={20} className="text-white" />
                            </div>
                        </motion.div>
                        <div className="overflow-hidden">
                            <h4 className="font-bold tracking-tight truncate text-base text-slate-900">{currentSong.title}</h4>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest truncate">{currentSong.artist}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="flex items-center gap-3 md:gap-6">
                            <button onClick={prevSong} className="opacity-40 hover:opacity-100 transition-opacity hidden sm:block p-2 hover:bg-black/5 rounded-full"><SkipBack size={24} fill="currentColor" /></button>
                            <button 
                                onClick={isPlaying ? pauseSong : resumeSong}
                                className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-white/20"
                            >
                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                            </button>
                            <button onClick={nextSong} className="opacity-40 hover:opacity-100 transition-opacity p-2 hover:bg-black/5 rounded-full"><SkipForward size={24} fill="currentColor" /></button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 md:gap-4 shrink-0 border-l border-black/5 pl-4">
                        <button 
                            onClick={() => toggleFavorite(currentSong)}
                            className={`transition-colors p-2 rounded-full hover:bg-black/5 hidden sm:block ${favorites.some(f => f.id === currentSong.id) ? 'text-red-500' : 'text-gray-400 hover:text-black'}`}
                        >
                            <Heart size={24} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                        </button>
                        <button onClick={toggleFullScreen} className="p-2 opacity-40 hover:opacity-100 hover:bg-black/5 rounded-full transition-all">
                            <Maximize2 size={20} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Player;
