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
    playSong: (song, index = -1) => set({ 
        currentSong: song, 
        isPlaying: true, 
        currentIndex: index !== -1 ? index : undefined 
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
    })
}));

export default usePlayerStore;
