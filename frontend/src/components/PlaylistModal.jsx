import React from 'react';
import usePlayerStore from '../store/playerStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus } from 'lucide-react';

const PlaylistModal = () => {
    const { isPlaylistModalOpen, closePlaylistModal, playlists, addToPlaylist, songToAdd, createPlaylist } = usePlayerStore();
    const [newExName, setNewExName] = React.useState('');
    const [isCreating, setIsCreating] = React.useState(false);

    if (!isPlaylistModalOpen) return null;

    const handleCreate = (e) => {
        e.preventDefault();
        if (newExName.trim()) {
            createPlaylist(newExName);
            setNewExName('');
            setIsCreating(false);
        }
    };

    return (
        <AnimatePresence>
            {isPlaylistModalOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                    onClick={closePlaylistModal}
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                        className="bg-white p-6 rounded-[2rem] shadow-2xl w-full max-w-sm"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black italic">Add to Playlist</h3>
                            <button onClick={closePlaylistModal}><X size={20} /></button>
                        </div>
                        
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto mb-4">
                            {playlists.map(playlist => (
                                <button 
                                    key={playlist.id}
                                    onClick={() => {
                                        addToPlaylist(playlist.id, songToAdd);
                                        closePlaylistModal();
                                    }}
                                    className="w-full text-left p-4 rounded-xl hover:bg-black/5 font-bold flex justify-between items-center group transition-colors"
                                >
                                    <span className="truncate flex-1">{playlist.name}</span>
                                    {playlist.songs.some(s => s.id === songToAdd?.id) && <Check size={16} className="text-green-500 ml-2" />}
                                </button>
                            ))}
                        </div>

                        {/* Quick Create */}
                        {isCreating ? (
                            <form onSubmit={handleCreate} className="flex gap-2">
                                <input 
                                    autoFocus
                                    className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Name..."
                                    value={newExName}
                                    onChange={e => setNewExName(e.target.value)}
                                />
                                <button type="submit" className="bg-black text-white p-2 rounded-xl"><Check size={16} /></button>
                            </form>
                        ) : (
                            <button 
                                onClick={() => setIsCreating(true)}
                                className="w-full py-3 border-2 border-dashed border-black/10 rounded-xl font-bold text-sm text-gray-400 hover:text-black hover:border-black/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> New Playlist
                            </button>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PlaylistModal;
