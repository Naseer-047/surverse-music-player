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
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col overflow-hidden text-white"
                    >
                        {/* SECTION 1: IMMERSIVE ART AREA (TOP) */}
                        <div className="relative w-full h-[65vh] shrink-0">
                             <img 
                                src={currentSong.image?.replace('150x150', '800x800')} 
                                className="w-full h-full object-cover lg:object-contain bg-black" 
                             />
                             {/* Subtle dark gradient overlay at bottom of image */}
                             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                             
                             {/* Header Action */}
                             <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
                                <button onClick={toggleFullScreen} className="p-3 bg-black/20 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-colors active:scale-90">
                                    <ChevronDown size={32} />
                                </button>
                                <div className="text-center">
                                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Playing from</p>
                                     <p className="text-xs font-bold tracking-widest text-white/60">Your Library</p>
                                </div>
                                <div className="w-12 h-12" />
                             </div>
                        </div>

                        {/* MOBILE CONTENT AREA (BOTTOM 35vh) */}
                        <div className="flex-1 flex flex-col px-8 py-4 justify-between max-w-lg mx-auto w-full">
                            
                            {/* SECTION 2: SONG INFO */}
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black tracking-tight leading-tight line-clamp-1">{currentSong.title}</h2>
                                <p className="text-lg font-bold text-white/40 uppercase tracking-widest">{currentSong.artist}</p>
                            </div>

                            {/* SECTION 3: SEEK BAR */}
                            <div className="w-full space-y-3">
                                <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden group cursor-pointer">
                                    <motion.div 
                                        className="absolute inset-y-0 left-0 bg-white rounded-full h-full"
                                        style={{ width: `${(currentTime / duration) * 100}%` }}
                                    />
                                    <input 
                                        type="range" 
                                        min="0" max={duration || 100} 
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                </div>
                                <div className="flex justify-between text-[11px] font-bold text-white/20 font-mono tracking-widest px-0.5">
                                    <span>{Math.floor(currentTime/60)}:{('0'+Math.floor(currentTime%60)).slice(-2)}</span>
                                    <span>{Math.floor(duration/60)}:{('0'+Math.floor(duration%60)).slice(-2)}</span>
                                </div>
                            </div>

                            {/* SECTION 4: CONTROLS (CENTERED) */}
                            <div className="flex items-center justify-center gap-10">
                                <button onClick={prevSong} className="text-white/40 hover:text-white transition-all active:scale-90">
                                    <SkipBack size={42} fill="currentColor" strokeWidth={0} />
                                </button>
                                
                                <button 
                                    onClick={isPlaying ? pauseSong : resumeSong}
                                    className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-90 transition-all shadow-2xl"
                                >
                                    {isPlaying ? <Pause size={44} fill="currentColor" /> : <Play size={44} fill="currentColor" className="ml-1.5" />}
                                </button>

                                <button onClick={nextSong} className="text-white/40 hover:text-white transition-all active:scale-90">
                                    <SkipForward size={42} fill="currentColor" strokeWidth={0} />
                                </button>
                            </div>

                            {/* SECTION 5: SECONDARY ACTIONS (BOTTOM) */}
                            <div className="flex items-center justify-between pb-8 pt-4">
                                <button 
                                    onClick={() => toggleFavorite(currentSong)}
                                    className={`p-2 transition-all active:scale-90 ${favorites.some(f => f.id === currentSong.id) ? 'text-red-500' : 'text-white/30 hover:text-white'}`}
                                >
                                    <Heart size={28} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                                </button>
                                <button className="text-white/30 hover:text-white p-2" onClick={() => openPlaylistModal(currentSong)}>
                                    <Plus size={28} />
                                </button>
                                <button className="text-white/30 hover:text-white p-2">
                                    <ListMusic size={28} />
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
