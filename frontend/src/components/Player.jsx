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
                        initial={{ borderRadius: '2.5rem', height: '80px', width: '90%', bottom: '24px', left: '5%', opacity: 0 }}
                        animate={{ borderRadius: '0rem', height: '100vh', width: '100%', bottom: '0px', left: '0px', opacity: 1 }}
                        exit={{ borderRadius: '2.5rem', height: '80px', width: '90%', bottom: '24px', left: '5%', opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-3xl flex flex-col overflow-hidden text-slate-900 border border-white/40"
                    >
                        {/* SECTION 1: TOP BAR */}
                        <div className="flex justify-between items-center px-6 py-6 z-20 shrink-0">
                            <button onClick={toggleFullScreen} className="p-3 hover:bg-black/5 rounded-full transition-colors active:scale-90">
                                <ChevronDown size={28} className="text-slate-400" />
                            </button>
                            <div className="text-center font-bold">
                                <span className="text-[10px] uppercase tracking-[0.4em] text-slate-300 block mb-0.5">Now Playing</span>
                                <h3 className="text-[11px] uppercase tracking-widest text-slate-500 truncate max-w-[180px]">{currentSong.title}</h3>
                            </div>
                            <div className="w-12 h-12" />
                        </div>

                        {/* MAIN CONTENT AREA */}
                        <div className="flex-1 flex flex-col items-center justify-between px-8 py-4 max-w-2xl mx-auto w-full">
                            
                            {/* SECTION 2: ALBUM ART (MAIN FOCUS) */}
                            <motion.div 
                                layoutId="activeSongImage"
                                className="relative w-full aspect-square max-w-[340px] md:max-w-[450px] shrink-0"
                            >
                                <img 
                                    src={currentSong.image?.replace('150x150', '800x800')} 
                                    className="w-full h-full object-cover rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] bg-white ring-1 ring-black/5" 
                                />
                            </motion.div>

                            {/* SECTION 3: SONG INFO */}
                            <div className="text-center space-y-2 mt-4">
                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight line-clamp-2">{currentSong.title}</h2>
                                <p className="text-sm md:text-lg font-bold text-slate-400 uppercase tracking-[0.2em]">{currentSong.artist}</p>
                            </div>

                            {/* SECTION 4: SEEK BAR */}
                            <div className="w-full space-y-3 mt-8">
                                <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden group cursor-pointer">
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
                                <div className="flex justify-between text-[11px] font-bold text-slate-300 font-mono tracking-widest px-1">
                                    <span>{Math.floor(currentTime/60)}:{('0'+Math.floor(currentTime%60)).slice(-2)}</span>
                                    <span>{Math.floor(duration/60)}:{('0'+Math.floor(duration%60)).slice(-2)}</span>
                                </div>
                            </div>

                            {/* SECTION 5: CONTROLS (CENTERED) */}
                            <div className="flex items-center justify-center gap-10 md:gap-14 py-6">
                                <button onClick={prevSong} className="text-slate-300 hover:text-slate-900 transition-all active:scale-90">
                                    <SkipBack size={36} fill="currentColor" strokeWidth={0} />
                                </button>
                                
                                <button 
                                    onClick={isPlaying ? pauseSong : resumeSong}
                                    className="w-20 h-20 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200"
                                >
                                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1.5" />}
                                </button>

                                <button onClick={nextSong} className="text-slate-300 hover:text-slate-900 transition-all active:scale-90">
                                    <SkipForward size={36} fill="currentColor" strokeWidth={0} />
                                </button>
                            </div>

                            {/* SECTION 6: SECONDARY ACTIONS (BOTTOM) */}
                            <div className="w-full flex items-center justify-between py-6 border-t border-slate-50">
                                <button 
                                    onClick={() => toggleFavorite(currentSong)}
                                    className={`p-3 rounded-full transition-all active:scale-90 ${favorites.some(f => f.id === currentSong.id) ? 'bg-red-50 text-red-500' : 'text-slate-300 hover:text-slate-900'}`}
                                >
                                    <Heart size={28} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                                </button>
                                <div className="flex items-center gap-6">
                                    <button onClick={() => openPlaylistModal(currentSong)} className="p-3 text-slate-300 hover:text-slate-900 transition-all active:scale-90">
                                        <Plus size={28} />
                                    </button>
                                    <button className="p-3 text-slate-300 hover:text-slate-900 transition-all active:scale-90">
                                        <ListMusic size={28} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 bg-slate-50 py-2 px-4 rounded-full border border-slate-100">
                                    <Volume2 size={18} className="text-slate-300" />
                                    <input 
                                        type="range"
                                        min="0" max="1" step="0.01"
                                        value={volume}
                                        onChange={(e) => setVolume(e.target.value)}
                                        className="w-20 md:w-28 h-1 bg-slate-200 rounded-full appearance-none accent-slate-900 cursor-pointer"
                                    />
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MINIMIZED PLAYER - ALWAYS AT BOTTOM (Outside AnimatePresence) */}
            {!isFullScreen && (
                <motion.div 
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[85%] max-w-5xl z-[60] transition-all duration-500"
                >
                    <div className="bg-white/80 backdrop-blur-3xl border border-white/40 shadow-2xl rounded-[2.5rem] p-3 pr-5 flex items-center justify-between gap-4 ring-1 ring-black/5">
                            <div onClick={toggleFullScreen} className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer group hover:bg-white/50 rounded-[2rem] pr-4 transition-colors">
                                <motion.div 
                                    layoutId="activeSongImage"
                                    className="w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] overflow-hidden shadow-lg relative shrink-0 border-2 border-white"
                                >
                                    <img src={currentSong.image} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Maximize2 size={20} className="text-white" />
                                    </div>
                                </motion.div>
                                <div className="overflow-hidden">
                                    <h4 className="font-bold tracking-tight truncate text-base text-slate-900">{currentSong.title}</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest truncate">{currentSong.artist}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 md:gap-6">
                                <button onClick={prevSong} className="opacity-40 hover:opacity-100 transition-opacity hidden sm:block p-2 hover:bg-black/5 rounded-full text-slate-900">
                                    <SkipBack size={24} fill="currentColor" strokeWidth={0} />
                                </button>
                                <button 
                                    onClick={isPlaying ? pauseSong : resumeSong}
                                    className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-white/20"
                                >
                                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                </button>
                                <button onClick={nextSong} className="opacity-40 hover:opacity-100 transition-opacity p-2 hover:bg-black/5 rounded-full text-slate-900">
                                    <SkipForward size={24} fill="currentColor" strokeWidth={0} />
                                </button>
                            </div>

                            <div className="flex items-center justify-end gap-3 md:gap-4 shrink-0 border-l border-slate-100 pl-4">
                                <button 
                                    onClick={() => toggleFavorite(currentSong)}
                                    className={`transition-colors p-2 rounded-full hover:bg-black/5 hidden sm:block ${favorites.some(f => f.id === currentSong.id) ? 'text-red-500' : 'text-slate-300 hover:text-slate-900'}`}
                                >
                                    <Heart size={24} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                                </button>
                                <button onClick={toggleFullScreen} className="p-2 opacity-40 hover:opacity-100 hover:bg-black/5 rounded-full transition-all text-slate-900">
                                    <Maximize2 size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
            )}
        </>
    );
};

export default Player;
