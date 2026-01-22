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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden text-white"
                    >
                        {/* Dynamic Background Blur */}
                        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                             <img 
                                src={currentSong.image?.replace('150x150', '500x500')} 
                                className="w-full h-full object-cover opacity-60 scale-125" 
                                style={{ filter: 'blur(120px)' }}
                             />
                             <div className="absolute inset-0 bg-black/40 backdrop-blur-[60px]" />
                        </div>

                        {/* Full Screen Header */}
                        <div className="flex justify-between items-center p-6 md:p-8 z-20 shrink-0">
                            <button onClick={toggleFullScreen} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md active:scale-95">
                                <ChevronDown size={24} />
                            </button>
                            <span className="font-black uppercase tracking-[0.4em] opacity-40 text-[10px]">Now Playing</span>
                            <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md opacity-0">
                                <ListMusic size={20} />
                            </button>
                        </div>

                        {/* Full Screen Content: Glass Card */}
                        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 flex flex-col items-center justify-center p-6 pb-12">
                            <motion.div 
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                                className="w-full max-w-lg bg-white/5 backdrop-blur-[40px] border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden group"
                            >
                                {/* Subtle inner glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                                {/* Artwork */}
                                <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 group-hover:scale-[1.02] transition-transform duration-700">
                                    <img src={currentSong.image?.replace('150x150', '500x500')} className="w-full h-full object-cover shadow-2xl" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                                </div>

                                {/* Info */}
                                <div className="text-center mb-10">
                                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none mb-3 drop-shadow-2xl">{currentSong.title}</h2>
                                    <p className="text-sm md:text-base font-bold opacity-60 uppercase tracking-[0.2em]">{currentSong.artist}</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full space-y-3 mb-10 group/progress">
                                     <input 
                                        type="range" 
                                        min="0" max={duration || 100} 
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-white cursor-pointer hover:h-2 opacity-80 hover:opacity-100 transition-all"
                                    />
                                    <div className="flex justify-between text-[11px] font-bold opacity-30 font-mono tracking-widest px-1">
                                        <span>{Math.floor(currentTime/60)}:{('0'+Math.floor(currentTime%60)).slice(-2)}</span>
                                        <span>{Math.floor(duration/60)}:{('0'+Math.floor(duration%60)).slice(-2)}</span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex flex-col gap-8 w-full">
                                    {/* Primary Controls */}
                                    <div className="flex items-center justify-center gap-8 md:gap-12">
                                        <button onClick={prevSong} className="p-2 opacity-50 hover:opacity-100 transition-all hover:scale-110 active:scale-90">
                                            <SkipBack size={36} fill="white" strokeWidth={0} />
                                        </button>
                                        <button 
                                            onClick={isPlaying ? pauseSong : resumeSong}
                                            className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                                        >
                                            {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1.5" />}
                                        </button>
                                        <button onClick={nextSong} className="p-2 opacity-50 hover:opacity-100 transition-all hover:scale-110 active:scale-90">
                                            <SkipForward size={36} fill="white" strokeWidth={0} />
                                        </button>
                                    </div>

                                    {/* Secondary Controls */}
                                    <div className="flex items-center justify-between px-2 opacity-60 hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => toggleFavorite(currentSong)}
                                            className={`p-3 rounded-full transition-all hover:bg-white/5 active:scale-90 ${favorites.some(f => f.id === currentSong.id) ? 'text-red-500' : 'text-white'}`}
                                        >
                                            <Heart size={26} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                                        </button>
                                        
                                        <div className="flex items-center gap-4 bg-white/5 py-2 px-4 rounded-full border border-white/5">
                                            <Volume2 size={18} className="opacity-40" />
                                            <input 
                                                type="range"
                                                min="0" max="1" step="0.01"
                                                value={volume}
                                                onChange={(e) => setVolume(e.target.value)}
                                                className="w-20 md:w-28 h-1 bg-white/10 rounded-full appearance-none accent-white cursor-pointer"
                                            />
                                        </div>

                                        <button 
                                            onClick={() => openPlaylistModal(currentSong)}
                                            className="p-3 rounded-full hover:bg-white/5 transition-all active:scale-90"
                                        >
                                            <Plus size={26} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
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
