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
            if (isPlaying) audioRef.current.play();
            else audioRef.current.pause();
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
                        className="fixed inset-0 z-[100] bg-[#FAFAFA] flex flex-col overflow-hidden"
                    >
                        {/* Full Screen Header */}
                        <div className="flex justify-between items-center p-6 md:p-8 z-20 shrink-0">
                            <button onClick={toggleFullScreen} className="p-3 rounded-full bg-black/5 hover:bg-black/10 transition-colors">
                                <ChevronDown size={20} />
                            </button>
                            <span className="font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-30 text-[10px] md:text-xs">Now Playing</span>
                            <button className="p-3 rounded-full bg-black/5 hover:bg-black/10 transition-colors">
                                <ListMusic size={18} />
                            </button>
                        </div>

                        {/* Full Screen Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            <div className="min-h-full flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-16 p-6 md:p-12 pb-24 relative z-10">
                                {/* Artwork */}
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="w-full max-w-[220px] md:max-w-xs aspect-square rounded-[2rem] overflow-hidden shadow-2xl relative group shrink-0"
                                >
                                    <img src={currentSong.image?.replace('150x150', '500x500')} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                </motion.div>

                                {/* Controls & Info */}
                                <div className="w-full max-w-lg flex flex-col justify-center space-y-6 md:space-y-10 text-center lg:text-left">
                                    <div className="space-y-4">
                                        <motion.h2 
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-2xl md:text-5xl font-black italic tracking-tighter line-clamp-2 leading-tight"
                                        >
                                            {currentSong.title}
                                        </motion.h2>
                                        <motion.p 
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-sm md:text-xl font-bold opacity-40 uppercase tracking-widest line-clamp-1"
                                        >
                                            {currentSong.artist}
                                        </motion.p>
                                    </div>

                                    <div className="flex justify-center lg:justify-start gap-4">
                                        <button 
                                            onClick={() => openPlaylistModal(currentSong)}
                                            className="w-12 h-12 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors text-black"
                                            title="Add to Playlist"
                                        >
                                            <Plus size={24} />
                                        </button>
                                        <button 
                                            onClick={() => toggleFavorite(currentSong)}
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm ${favorites.some(f => f.id === currentSong.id) ? 'bg-red-500 text-white' : 'bg-black/5 text-gray-400 hover:bg-black/10'}`}
                                            title="Favorite"
                                        >
                                            <Heart size={20} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                                        </button>
                                    </div>

                                    {/* Progress Bar & Volume */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                             <input 
                                                type="range" 
                                                min="0" max={duration || 100} 
                                                value={currentTime}
                                                onChange={handleSeek}
                                                className="w-full h-1 md:h-1.5 bg-black/5 rounded-full appearance-none accent-black cursor-pointer hover:h-2 transition-all"
                                            />
                                            <div className="flex justify-between text-[10px] md:text-xs font-bold opacity-30 font-mono">
                                                <span>{Math.floor(currentTime/60)}:{('0'+Math.floor(currentTime%60)).slice(-2)}</span>
                                                <span>{Math.floor(duration/60)}:{('0'+Math.floor(duration%60)).slice(-2)}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Mobile Volume Slider */}
                                        <div className="flex items-center gap-4 px-4 bg-black/5 rounded-full py-2">
                                            <Volume2 size={16} className="opacity-40" />
                                            <input 
                                                type="range"
                                                min="0" max="1" step="0.01"
                                                value={volume}
                                                onChange={(e) => setVolume(e.target.value)}
                                                className="w-full h-1 bg-black/10 rounded-full appearance-none accent-black cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Main Controls */}
                                    <div className="flex justify-between items-center w-full max-w-sm mx-auto lg:mx-0">
                                        <button className="opacity-20 hover:opacity-100 transition-opacity"><Shuffle size={18} md:size={20} /></button>
                                        <div className="flex items-center gap-6 md:gap-10">
                                            <button onClick={prevSong} className="p-2 md:p-4 hover:scale-110 transition-transform"><SkipBack size={28} md:size={32} strokeWidth={1.5} /></button>
                                            <button 
                                                onClick={isPlaying ? pauseSong : resumeSong}
                                                className="w-14 h-14 md:w-20 md:h-20 bg-black text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl"
                                            >
                                                {isPlaying ? <Pause size={28} md:size={32} fill="currentColor" /> : <Play size={28} md:size={32} fill="currentColor" className="ml-1" />}
                                            </button>
                                            <button onClick={nextSong} className="p-2 md:p-4 hover:scale-110 transition-transform"><SkipForward size={28} md:size={32} strokeWidth={1.5} /></button>
                                        </div>
                                        <button className="opacity-20 hover:opacity-100 transition-opacity"><Repeat size={18} md:size={20} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background Blur */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                             <img src={currentSong.image?.replace('150x150', '500x500')} className="w-full h-full object-cover opacity-10 md:opacity-20 blur-[80px] md:blur-[100px] scale-150" />
                             <div className="absolute inset-0 bg-white/60 backdrop-blur-3xl" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Minimized Player */}
            <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className={`fixed bottom-0 left-0 right-0 z-[60] ${isSidebarOpen ? 'lg:pl-64' : ''} transition-all duration-500 section-padding py-3 bg-white/80 backdrop-blur-2xl border-t border-black/5 flex items-center justify-between`}
            >
                <div onClick={toggleFullScreen} className="flex items-center gap-4 w-1/3 cursor-pointer group hover:opacity-80 transition-opacity">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg relative shrink-0">
                        <img src={currentSong.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Maximize2 size={14} className="text-white" />
                        </div>
                    </div>
                    <div className="overflow-hidden hidden sm:block">
                        <h4 className="font-bold tracking-tight truncate text-sm">{currentSong.title}</h4>
                        <p className="text-[10px] opacity-40 font-bold uppercase truncate">{currentSong.artist}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="flex items-center gap-4 md:gap-6">
                        <button onClick={prevSong} className="opacity-40 hover:opacity-100 transition-opacity"><SkipBack size={18} /></button>
                        <button 
                            onClick={isPlaying ? pauseSong : resumeSong}
                            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                        </button>
                        <button onClick={nextSong} className="opacity-40 hover:opacity-100 transition-opacity"><SkipForward size={18} /></button>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 md:gap-6 w-1/3">
                    <button 
                        onClick={() => toggleFavorite(currentSong)}
                        className={`transition-colors ${favorites.some(f => f.id === currentSong.id) ? 'text-red-500' : 'text-gray-400 hover:text-black'}`}
                    >
                        <Heart size={20} fill={favorites.some(f => f.id === currentSong.id) ? "currentColor" : "none"} />
                    </button>
                    <div className="flex items-center gap-3 group hidden sm:flex">
                        <Volume2 size={16} className="opacity-40 group-hover:opacity-100" />
                        <input 
                            type="range"
                            min="0" max="1" step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(e.target.value)}
                            className="w-20 h-1 bg-black/5 rounded-full appearance-none accent-black cursor-pointer"
                        />
                    </div>
                    <button onClick={toggleFullScreen} className="p-2 opacity-40 hover:opacity-100">
                        <Maximize2 size={18} />
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default Player;
