import React, { useState } from 'react';
import usePlayerStore from '../store/playerStore';
import { Play, Plus, Trash2, Music2, X, Disc, ChevronLeft, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PlaylistPage = () => {
    const { playlists, createPlaylist, deletePlaylist, playSong, setQueue, removeFromPlaylist } = usePlayerStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    const handleCreate = (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) return;
        createPlaylist(newPlaylistName);
        setNewPlaylistName('');
        setIsCreating(false);
    };

    const handlePlayPlaylist = (playlist) => {
        if (playlist.songs.length === 0) return;
        setQueue(playlist.songs);
        playSong(playlist.songs[0], 0);
    };

    return (
        <div className="min-h-screen bg-[#F8F8F8] p-6 pb-32 lg:p-12">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-2">Your Vault</h1>
                    <p className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-40">Curate your sonic universe</p>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Create Playlist Modal */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.form 
                            onSubmit={handleCreate}
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md"
                        >
                            <h3 className="text-2xl font-black italic mb-6">New Playlist</h3>
                            <input 
                                type="text" 
                                placeholder="My Awesome Mix..." 
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                className="w-full bg-[#F8F8F8] p-4 rounded-xl font-bold mb-6 focus:outline-none focus:ring-2 focus:ring-black"
                                autoFocus
                            />
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-4 font-bold opacity-40 hover:opacity-100">Cancel</button>
                                <button type="submit" className="flex-1 bg-black text-white rounded-xl py-4 font-bold hover:scale-105 transition-transform">Create</button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>

            {!selectedPlaylist ? (
                // Playlist List
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {playlists.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-30">
                            <Disc size={64} className="mb-4" />
                            <p className="font-bold uppercase tracking-widest">No playlists yet</p>
                        </div>
                    )}
                    {playlists.map((playlist) => (
                        <div key={playlist.id} onClick={() => setSelectedPlaylist(playlist)} className="group cursor-pointer">
                            <div className="aspect-square bg-white rounded-[2rem] mb-4 relative overflow-hidden border border-black/5 shadow-sm group-hover:shadow-xl transition-all duration-500">
                                {playlist.songs.length > 0 ? (
                                    <div className="grid grid-cols-2 h-full">
                                        {playlist.songs.slice(0, 4).map((s, i) => (
                                            <img key={i} src={s.image} className="w-full h-full object-cover" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <Music2 className="opacity-10" size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); handlePlayPlaylist(playlist); }}
                                        className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                                     >
                                        <Play size={20} fill="currentColor" className="ml-1" />
                                     </button>
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); deletePlaylist(playlist.id); }}
                                        className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                                     >
                                        <Trash2 size={18} />
                                     </button>
                                </div>
                            </div>
                            <h4 className="font-bold truncate text-lg px-2">{playlist.name}</h4>
                            <p className="text-xs font-bold opacity-40 px-2 uppercase tracking-wide">{playlist.songs.length} Songs</p>
                        </div>
                    ))}
                </div>
            ) : (
                // Selected Playlist View
                <div>
                     <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => setSelectedPlaylist(null)} className="p-3 bg-white rounded-full hover:shadow-lg transition-all">
                            <ChevronLeft size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-12">
                        <div className="w-full md:w-64 aspect-square bg-white rounded-[2rem] overflow-hidden shadow-2xl relative group shrink-0">
                            {selectedPlaylist.songs.length > 0 ? (
                                <img src={selectedPlaylist.songs[0].image.replace('150x150', '500x500')} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <Music2 size={64} className="opacity-10" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col justify-end items-start text-left">
                            <span className="inline-block px-3 py-1 mb-4 rounded-full border border-black/10 text-[10px] font-bold tracking-widest uppercase">Playlist</span>
                            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-none mb-6">{selectedPlaylist.name}</h1>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => handlePlayPlaylist(selectedPlaylist)}
                                    className="bg-black text-white px-8 py-3 rounded-full font-black text-xs tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
                                >
                                    <Play size={16} fill="currentColor" /> PLAY ALL
                                </button>
                                <p className="text-sm font-bold opacity-40">{selectedPlaylist.songs.length} Songs</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {selectedPlaylist.songs.map((song, i) => (
                             <div key={i} className="flex items-center gap-4 md:gap-8 p-4 bg-white rounded-2xl border border-black/5 hover:bg-black hover:text-white transition-all group cursor-pointer" onClick={() => { setQueue(selectedPlaylist.songs); playSong(song, i); }}>
                                <span className="text-xl font-black italic opacity-20 w-8 text-center">{i + 1}</span>
                                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                                    <img src={song.image} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold truncate">{song.title}</h4>
                                    <p className="text-xs opacity-50 font-bold uppercase truncate">{song.artist}</p>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); removeFromPlaylist(selectedPlaylist.id, song.id); }}
                                    className="p-3 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                             </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistPage;
