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
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="fixed inset-0 z-[100] bg-black/90 flex flex-col overflow-hidden text-white"
                    >
                        {/* Dynamic Background Blur */}
                        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                             <img 
                                src={currentSong.image?.replace('150x150', '500x500')} 
                                className="w-full h-full object-cover opacity-60 scale-150 animate-[spin_60s_linear_infinite]" 
                                style={{ filter: 'blur(100px)' }}
                             />
                             <div className="absolute inset-0 bg-black/40 backdrop-blur-[100px]" />
                        </div>

                        {/* Full Screen Header */}
                        <div className="flex justify-between items-center p-6 z-20 shrink-0">
                            <button onClick={toggleFullScreen} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md">
                                <ChevronDown size={24} />
                            </button>
                            <span className="font-black uppercase tracking-[0.3em] opacity-60 text-xs drop-shadow-md">Now Playing</span>
                            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md opacity-0">
                                <ListMusic size={20} />
                            </button>
                        </div>

                        {/* Center Content: GLASS CARD */}
                        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 flex items-center justify-center p-6">
                            <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-6 pb-10 shadow-2xl relative overflow-hidden">
                                {/* Glossy Reflection */}
                                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                                
                                {/* Artwork */}
                                <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl mb-8 relative border border-white/10">
                                    <img src={currentSong.image?.replace('150x150', '500x500')} className="w-full h-full object-cover" />
                                </div>

                                {/* Info */}
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-black italic tracking-tighter leading-none mb-2 drop-shadow-md">{currentSong.title}</h2>
                                    <p className="text-sm font-bold opacity-60 uppercase tracking-widest">{currentSong.artist}</p>
                                </div>

                                {/* Progress */}
                                <div className="mb-8 px-2 group">
                                     <input 
                                        type="range" 
                                        min="0" max={duration || 100} 
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="w-full h-1.5 bg-white/20 rounded-full appearance-none accent-white cursor-pointer hover:h-2 transition-all mb-2"
                                    />
                                    <div className="flex justify-between text-[10px] font-bold opacity-40 font-mono tracking-wider">
                                        <span>{Math.floor(currentTime/60)}:{('0'+Math.floor(currentTime%60)).slice(-2)}</span>
                                        <span>{Math.floor(duration/60)}:{('0'+Math.floor(duration%60)).slice(-2)}</span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex justify-between items-center px-4">
                                     <button 
                                        onClick={() => toggleFavorite(currentSong)}
                                        className={`p-3 rounded-full transition-all active:scale-95 ${favorites.some(f => f.id === currentSong.id) ? 'text-red-500 bg-white/10' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                                    >
                                        <Heart size={24} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                                    </button>

                                    <div className="flex items-center gap-6">
                                        <button onClick={prevSong} className="p-2 opacity-80 hover:opacity-100 active:scale-90 transition-transform"><SkipBack size={28} fill="currentColor" /></button>
                                        <button 
                                            onClick={isPlaying ? pauseSong : resumeSong}
                                            className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
                                        >
                                            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                                        </button>
                                        <button onClick={nextSong} className="p-2 opacity-80 hover:opacity-100 active:scale-90 transition-transform"><SkipForward size={28} fill="currentColor" /></button>
                                    </div>

                                    <button 
                                        onClick={() => openPlaylistModal(currentSong)}
                                        className="p-3 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        <Plus size={24} />
                                    </button>
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
