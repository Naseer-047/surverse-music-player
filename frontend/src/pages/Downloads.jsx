import React, { useState, useEffect } from 'react';
import { db } from '../utils/db';
import { Download, Trash2, Play, Music } from 'lucide-react';
import usePlayerStore from '../store/playerStore';
import { motion } from 'framer-motion';

const Downloads = () => {
    const [downloadedSongs, setDownloadedSongs] = useState([]);
    const { playSong, currentSong } = usePlayerStore();

    const loadDownloads = async () => {
        const songs = await db.getAllSongs();
        setDownloadedSongs(songs);
    };

    useEffect(() => {
        loadDownloads();
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        await db.deleteSong(id);
        loadDownloads();
    };

    const handlePlay = (song) => {
        // Create a temporary URL for the Blob to play it
        const localUrl = URL.createObjectURL(song.blob);
        playSong({ ...song, url: localUrl, isLocal: true });
    };

    return (
        <div className="p-6 md:p-10 min-h-screen bg-slate-50">
            <header className="mb-10">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 flex items-center gap-4">
                    <Download className="text-blue-600" size={40} />
                    Your Downloads
                </h1>
                <p className="text-slate-500 mt-2 font-medium">Keep your vibe alive, even without internet.</p>
            </header>

            {downloadedSongs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Music className="text-slate-400" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">No downloads yet</h2>
                    <p className="text-slate-500">Songs you download will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {downloadedSongs.map((song) => (
                        <motion.div 
                            key={song.id}
                            whileHover={{ y: -5 }}
                            className={`bg-white p-4 rounded-3xl shadow-sm border-2 transition-all cursor-pointer group ${currentSong?.id === song.id ? 'border-blue-500 shadow-blue-100' : 'border-slate-100 hover:border-slate-200'}`}
                            onClick={() => handlePlay(song)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md shrink-0">
                                    <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 truncate">{song.title}</h3>
                                    <p className="text-sm text-slate-500 truncate">{song.artist}</p>
                                </div>
                                <button 
                                    onClick={(e) => handleDelete(e, song.id)}
                                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Downloads;
