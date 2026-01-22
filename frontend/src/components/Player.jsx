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
                             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
                        </div>

                        {/* Full Screen Header */}
                        <div className="flex justify-between items-center p-6 md:p-8 z-20 shrink-0">
                            <button onClick={toggleFullScreen} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md">
                                <ChevronDown size={24} />
                            </button>
                            <span className="font-black uppercase tracking-[0.3em] opacity-60 text-xs drop-shadow-md">Now Playing</span>
                            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md opacity-0">
                                <ListMusic size={20} />
                            </button>
                        </div>

                        {/* Full Screen Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 flex flex-col justify-center">
                            <div className="w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                                {/* Artwork */}
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0, rotateY: 45 }}
                                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="w-[80vw] max-w-sm lg:max-w-md aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative group shrink-0 border border-white/10"
                                    style={{ perspective: 1000 }}
                                >
                                    <img src={currentSong.image?.replace('150x150', '500x500')} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                </motion.div>

                                {/* Controls & Info */}
                                <div className="w-full max-w-lg flex flex-col justify-center space-y-8 lg:space-y-12 text-center lg:text-left">
                                    <div className="space-y-4">
                                        <motion.h2 
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-4xl md:text-6xl font-black italic tracking-tighter line-clamp-2 leading-[0.9] drop-shadow-2xl"
                                        >
                                            {currentSong.title}
                                        </motion.h2>
                                        <motion.p 
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-lg md:text-2xl font-bold opacity-60 uppercase tracking-widest line-clamp-1 text-white/80"
                                        >
                                            {currentSong.artist}
                                        </motion.p>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="space-y-3 group">
                                         <input 
                                            type="range" 
                                            min="0" max={duration || 100} 
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="w-full h-2 bg-white/10 rounded-full appearance-none accent-white cursor-pointer hover:h-3 transition-all"
                                        />
                                        <div className="flex justify-between text-xs font-bold opacity-40 font-mono tracking-wider">
                                            <span>{Math.floor(currentTime/60)}:{('0'+Math.floor(currentTime%60)).slice(-2)}</span>
                                            <span>{Math.floor(duration/60)}:{('0'+Math.floor(duration%60)).slice(-2)}</span>
                                        </div>
                                    </div>

                                    {/* Main Controls */}
                                    <div className="flex justify-between items-center w-full max-w-sm mx-auto lg:mx-0 pt-4">
                                        <button className="opacity-40 hover:opacity-100 transition-opacity"><Shuffle size={24} /></button>
                                        <div className="flex items-center gap-8 md:gap-12">
                                            <button onClick={prevSong} className="p-4 hover:scale-110 transition-transform hover:bg-white/10 rounded-full"><SkipBack size={36} fill="white" strokeWidth={0} /></button>
                                            <button 
                                                onClick={isPlaying ? pauseSong : resumeSong}
                                                className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                                            >
                                                {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                                            </button>
                                            <button onClick={nextSong} className="p-4 hover:scale-110 transition-transform hover:bg-white/10 rounded-full"><SkipForward size={36} fill="white" strokeWidth={0} /></button>
                                        </div>
                                        <button className="opacity-40 hover:opacity-100 transition-opacity"><Repeat size={24} /></button>
                                    </div>
                                    
                                    {/* Secondary Controls */}
                                    <div className="flex justify-center lg:justify-start gap-8 pt-4 opacity-80">
                                         <button 
                                            onClick={() => toggleFavorite(currentSong)}
                                            className={`transition-all hover:scale-110 ${favorites.some(f => f.id === currentSong.id) ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'hover:text-white'}`}
                                        >
                                            <Heart size={28} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                                        </button>
                                        <button 
                                            onClick={() => openPlaylistModal(currentSong)}
                                            className="hover:text-white hover:scale-110 transition-all"
                                        >
                                            <Plus size={28} />
                                        </button>
                                        <div className="flex items-center gap-4 group">
                                            <Volume2 size={24} className="opacity-60" />
                                            <input 
                                                type="range"
                                                min="0" max="1" step="0.01"
                                                value={volume}
                                                onChange={(e) => setVolume(e.target.value)}
                                                className="w-24 h-1 bg-white/20 rounded-full appearance-none accent-white cursor-pointer group-hover:w-32 transition-all"
                                            />
                                        </div>
                                    </div>
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
