import React from 'react';
import usePlayerStore from '../store/playerStore';
import { Play, Heart, Music2, Disc } from 'lucide-react';

const FavoritesPage = () => {
    const { favorites, playSong, toggleFavorite, setQueue } = usePlayerStore();

    return (
        <div className="min-h-screen bg-[#F8F8F8] p-6 pb-32 lg:p-12">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-2">Liked Echoes</h1>
                    <p className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-40">Your personal collection</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xl">
                    <Heart fill="currentColor" size={24} />
                </div>
            </div>

            {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-30">
                    <Heart size={64} className="mb-4" />
                    <p className="font-bold uppercase tracking-widest">No favorites yet</p>
                    <p className="text-xs mt-2">Hit the heart icon to save songs here</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((song, idx) => (
                        <div key={song.id} className="bg-white p-4 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 group border border-black/5 flex items-center gap-4 cursor-pointer" onClick={() => { setQueue(favorites); playSong(song, idx); }}>
                            <div className="w-20 h-20 rounded-2xl overflow-hidden relative shrink-0">
                                <img src={song.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Play size={24} className="text-white fill-current" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold truncate text-lg">{song.title}</h4>
                                <p className="text-xs font-bold opacity-40 uppercase truncate">{song.artist}</p>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(song); }}
                                className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all scale-100 active:scale-90"
                            >
                                <Heart fill="currentColor" size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
