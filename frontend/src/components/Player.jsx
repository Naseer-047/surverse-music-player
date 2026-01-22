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
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex flex-col overflow-hidden text-slate-900"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-8 md:px-12 z-20 shrink-0">
                            <button onClick={toggleFullScreen} className="p-3 rounded-full hover:bg-slate-100 transition-colors active:scale-90">
                                <ChevronDown size={28} className="text-slate-400" />
                            </button>
                            <div className="text-center">
                                <span className="font-black uppercase tracking-[0.3em] text-slate-300 text-[10px] block mb-1">Now Playing</span>
                                <h3 className="text-xs font-bold tracking-widest uppercase truncate max-w-[200px] text-slate-500">{currentSong.title}</h3>
                            </div>
                            <div className="w-12 h-12" /> {/* Spacer */}
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col items-center justify-between px-6 py-4 max-w-2xl mx-auto w-full">
                            
                            {/* Center Section: Artwork & Volume */}
                            <div className="flex-1 flex items-center justify-center w-full relative">
                                <div className="flex flex-col md:flex-row items-center gap-12 w-full">
                                    {/* Artwork */}
                                    <motion.div 
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="relative w-full aspect-square max-w-[320px] md:max-w-[400px] rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden bg-white"
                                    >
                                        <img src={currentSong.image?.replace('150x150', '500x500')} className="w-full h-full object-cover" />
                                    </motion.div>

                                    {/* Side Volume Controller (Desktop: Right, Mobile: Bottom of image) */}
                                    <div className="flex items-center gap-4 md:flex-col md:h-[300px] md:py-8">
                                        <Volume2 size={24} className="text-slate-300" />
                                        <input 
                                            type="range"
                                            min="0" max="1" step="0.01"
                                            value={volume}
                                            onChange={(e) => setVolume(e.target.value)}
                                            className="w-32 md:h-48 h-1.5 md:appearance-none md:[writing-mode:bt-lr] md:w-1.5 bg-slate-100 rounded-full accent-slate-900 cursor-pointer"
                                            style={{ filter: 'grayscale(0.5)' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Info & Progress */}
                            <div className="w-full space-y-8 py-8">
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 line-clamp-2 leading-tight">{currentSong.title}</h2>
                                    <p className="text-sm md:text-lg font-bold text-slate-400 uppercase tracking-[0.2em]">{currentSong.artist}</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <input 
                                        type="range" 
                                        min="0" max={duration || 100} 
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-slate-900 cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] font-bold text-slate-300 font-mono tracking-widest px-1">
                                        <span>{Math.floor(currentTime/60)}:{('0'+Math.floor(currentTime%60)).slice(-2)}</span>
                                        <span>{Math.floor(duration/60)}:{('0'+Math.floor(duration%60)).slice(-2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Control Row */}
                            <div className="w-full flex items-center justify-between py-8 border-t border-slate-50">
                                {/* Left: Favorite */}
                                <button 
                                    onClick={() => toggleFavorite(currentSong)}
                                    className={`p-4 rounded-full transition-all active:scale-90 ${favorites.some(f => f.id === currentSong.id) ? 'bg-red-50 text-red-500' : 'text-slate-300 hover:text-slate-900'}`}
                                >
                                    <Heart size={32} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                                </button>

                                {/* Center: Media Controls */}
                                <div className="flex items-center gap-8 md:gap-12">
                                    <button onClick={prevSong} className="text-slate-900 hover:scale-110 active:scale-95 transition-all">
                                        <SkipBack size={36} fill="currentColor" />
                                    </button>
                                    <button 
                                        onClick={isPlaying ? pauseSong : resumeSong}
                                        className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-200"
                                    >
                                        {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                                    </button>
                                    <button onClick={nextSong} className="text-slate-900 hover:scale-110 active:scale-95 transition-all">
                                        <SkipForward size={36} fill="currentColor" />
                                    </button>
                                </div>

                                {/* Right: Add to Playlist */}
                                <button 
                                    onClick={() => openPlaylistModal(currentSong)}
                                    className="p-4 rounded-full text-slate-300 hover:text-slate-900 transition-all active:scale-90"
                                >
                                    <Plus size={32} />
                                </button>
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
