import { ExploreService } from '@/services/ExplorerService';
import { PlayerService } from '@/services/PlayerService';
import { Track } from '@/shared/types';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useState, useCallback } from 'react';


export function useFilePicker() {
  const [isPicking, setIsPicking] = useState(false);
  const { setTrack, setQueue }    = usePlayerStore();

  const pickSingle = useCallback(async (): Promise<Track | null> => {
    setIsPicking(true);
    try {
      const track = await ExploreService.pickFromDevice();
      if (!track) return null;

      // Save to DB so it appears in library
      const saved = await PlayerService.saveTrack(track);
      setTrack(saved);
      setQueue([saved]);
      return saved;
    } finally {
      setIsPicking(false);
    }
  }, []);

  const pickMultiple = useCallback(async (): Promise<Track[]> => {
    setIsPicking(true);
    try {
      const tracks = await ExploreService.pickMultipleFromDevice();
      if (!tracks.length) return [];

      const saved: Track[] = [];
      for (const track of tracks) {
        const s = await PlayerService.saveTrack(track);
        saved.push(s);
      }

      setQueue(saved);
      setTrack(saved[0]);
      return saved;
    } finally {
      setIsPicking(false);
    }
  }, []);

  return { pickSingle, pickMultiple, isPicking };
}