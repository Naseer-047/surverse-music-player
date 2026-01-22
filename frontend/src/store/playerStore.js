import { create } from 'zustand';

const usePlayerStore = create((set) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,
    volume: 0.5,
    isFullScreen: false,
    isSidebarOpen: false,
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    toggleFullScreen: () => set((state) => ({ isFullScreen: !state.isFullScreen })),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setQueue: (newQueue) => set({ queue: newQueue }),
    playSong: (song, index = 0) => set({ 
        currentSong: song, 
        isPlaying: true, 
        currentIndex: index 
    }),
    pauseSong: () => set({ isPlaying: false }),
    resumeSong: () => set({ isPlaying: true }),
    setVolume: (val) => set({ volume: val }),
    nextSong: () => set((state) => {
        if (state.queue.length === 0) return state;
        const nextIdx = (state.currentIndex + 1) % state.queue.length;
        return { 
            currentSong: state.queue[nextIdx], 
            currentIndex: nextIdx,
            isPlaying: true 
        };
    }),
    prevSong: () => set((state) => {
        if (state.queue.length === 0) return state;
        const prevIdx = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
        return { 
            currentSong: state.queue[prevIdx], 
            currentIndex: prevIdx,
            isPlaying: true 
        };
    }),
    
    // Playlist Actions
    playlists: JSON.parse(localStorage.getItem('surverse_playlists')) || [],
    isPlaylistModalOpen: false,
    songToAdd: null,

    openPlaylistModal: (song) => set({ isPlaylistModalOpen: true, songToAdd: song }),
    closePlaylistModal: () => set({ isPlaylistModalOpen: false, songToAdd: null }),

    createPlaylist: (name) => set((state) => {
// ...
        const newPlaylist = { id: Date.now(), name, songs: [], createdAt: new Date().toISOString() };
        const updatedPlaylists = [newPlaylist, ...state.playlists];
        localStorage.setItem('surverse_playlists', JSON.stringify(updatedPlaylists));
        return { playlists: updatedPlaylists };
    }),

    deletePlaylist: (id) => set((state) => {
        const updatedPlaylists = state.playlists.filter(p => p.id !== id);
        localStorage.setItem('surverse_playlists', JSON.stringify(updatedPlaylists));
        return { playlists: updatedPlaylists };
    }),

    addToPlaylist: (playlistId, song) => set((state) => {
        const updatedPlaylists = state.playlists.map(p => {
            if (p.id === playlistId) {
                // Prevent duplicates
                if (p.songs.some(s => s.id === song.id)) return p;
                return { ...p, songs: [...p.songs, song] };
            }
            return p;
        });
        localStorage.setItem('surverse_playlists', JSON.stringify(updatedPlaylists));
        return { playlists: updatedPlaylists };
    }),

    removeFromPlaylist: (playlistId, songId) => set((state) => {
        const updatedPlaylists = state.playlists.map(p => {
            if (p.id === playlistId) {
                return { ...p, songs: p.songs.filter(s => s.id !== songId) };
            }
            return p;
        });
        localStorage.setItem('surverse_playlists', JSON.stringify(updatedPlaylists));
        return { playlists: updatedPlaylists };
    }),

    // Favorites Actions
    favorites: JSON.parse(localStorage.getItem('surverse_favorites')) || [],

    toggleFavorite: (song) => set((state) => {
        const isFav = state.favorites.some(f => f.id === song.id);
        let updatedFavorites;
        if (isFav) {
            updatedFavorites = state.favorites.filter(f => f.id !== song.id);
        } else {
            updatedFavorites = [song, ...state.favorites];
        }
        localStorage.setItem('surverse_favorites', JSON.stringify(updatedFavorites));
        return { favorites: updatedFavorites };
    })
}));

export default usePlayerStore;
