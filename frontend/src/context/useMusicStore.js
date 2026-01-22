import { create } from 'zustand';

const useMusicStore = create((set, get) => ({
  currentSong: null,
  isPlaying: false,
  playlist: [],
  currentIndex: -1,
  volume: 1,

  playSong: (song) => {
      const { playlist } = get();
      const index = playlist.findIndex((s) => s.id === song.id);
      set({ currentSong: song, isPlaying: true, currentIndex: index });
  },
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setPlaylist: (list) => set({ playlist: list }),
  
  playNext: () => {
      const { playlist, currentIndex } = get();
      if (currentIndex < playlist.length - 1) {
          set({ currentSong: playlist[currentIndex + 1], currentIndex: currentIndex + 1, isPlaying: true });
      }
  },
  
  playPrev: () => {
      const { playlist, currentIndex } = get();
      if (currentIndex > 0) {
          set({ currentSong: playlist[currentIndex - 1], currentIndex: currentIndex - 1, isPlaying: true });
      }
  },
  
  setVolume: (val) => set({ volume: val }),
}));

export default useMusicStore;
