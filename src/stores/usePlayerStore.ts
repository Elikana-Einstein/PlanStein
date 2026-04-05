import { create } from 'zustand';
import { Track, Playlist } from '../shared/types/index';

interface PlayerState {
  currentTrack: Track | null;
  queue:        Track[];
  playlist:     Playlist | null;
  isPlaying:    boolean;
  position:     number;
  duration:     number;
  isShuffled:   boolean;
  isRepeating:  boolean;

  // Actions
  setTrack:      (track: Track)       => void;
  setQueue:      (queue: Track[])     => void;
  setPlaylist:   (pl: Playlist | null)=> void;
  togglePlay:    ()                   => void;
  setIsPlaying:  (v: boolean)         => void;
  setPosition:   (pos: number)        => void;
  setDuration:   (dur: number)        => void;
  toggleShuffle: ()                   => void;
  toggleRepeat:  ()                   => void;
  nextTrack:     ()                   => void;
  prevTrack:     ()                   => void;
  clearPlayer:   ()                   => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue:        [],
  playlist:     null,
  isPlaying:    false,
  position:     0,
  duration:     0,
  isShuffled:   false,
  isRepeating:  false,

  setTrack:    (track)    => set({ currentTrack: track, position: 0 }),
  setQueue:    (queue)    => set({ queue }),
  setPlaylist: (playlist) => set({ playlist }),
  togglePlay:  ()         => set(s => ({ isPlaying: !s.isPlaying })),
  setIsPlaying:(v)        => set({ isPlaying: v }),
  setPosition: (pos)      => set({ position: pos }),
  setDuration: (dur)      => set({ duration: dur }),
  toggleShuffle: ()       => set(s => ({ isShuffled: !s.isShuffled })),
  toggleRepeat:  ()       => set(s => ({ isRepeating: !s.isRepeating })),

  nextTrack: () => {
    const { queue, currentTrack, isShuffled } = get();
    if (!queue.length) return;
    const idx = queue.findIndex(t => t.id === currentTrack?.id);
    let next: Track;
    if (isShuffled) {
      next = queue[Math.floor(Math.random() * queue.length)];
    } else {
      next = queue[(idx + 1) % queue.length];
    }
    set({ currentTrack: next, position: 0 });
  },

  prevTrack: () => {
    const { queue, currentTrack, position } = get();
    if (!queue.length) return;
    // If more than 3s in, restart current track instead of going back
    if (position > 3) {
      set({ position: 0 });
      return;
    }
    const idx  = queue.findIndex(t => t.id === currentTrack?.id);
    const prev = queue[(idx - 1 + queue.length) % queue.length];
    set({ currentTrack: prev, position: 0 });
  },

  clearPlayer: () => set({
    currentTrack: null,
    queue:        [],
    isPlaying:    false,
    position:     0,
    duration:     0,
  }),
}));