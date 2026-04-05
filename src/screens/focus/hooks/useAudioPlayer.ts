import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { usePlayerStore } from '@/stores/usePlayerStore';

export function useAudioPlayer() {
  const {
    currentTrack, isPlaying, position,
    setIsPlaying, setPosition, setDuration,
    nextTrack, toggleShuffle, toggleRepeat,
    isRepeating,
  } = usePlayerStore();

  const soundRef = useRef<Audio.Sound | null>(null);

  // Load a new track whenever currentTrack changes
  useEffect(() => {
    if (!currentTrack?.uri) return;

    let isMounted = true;

    const loadTrack = async () => {
      // Unload previous sound
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS:       true,
          staysActiveInBackground:    true,
          shouldDuckAndroid:          true,
        });

        const { sound, status } = await Audio.Sound.createAsync(
          { uri: currentTrack.uri },
          { shouldPlay: isPlaying, positionMillis: 0 },
          onPlaybackStatusUpdate
        );

        if (isMounted) {
          soundRef.current = sound;
          if ('durationMillis' in status && status.durationMillis) {
            setDuration(Math.floor(status.durationMillis / 1000));
          }
        }
      } catch (err) {
        console.warn('Audio load error:', err);
      }
    };

    loadTrack();

    return () => {
      isMounted = false;
    };
  }, [currentTrack?.id]);

  // Sync isPlaying state to actual sound
  useEffect(() => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.playAsync();
    } else {
      soundRef.current.pauseAsync();
    }
  }, [isPlaying]);

  // Unload on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (!status.isLoaded) return;
    setPosition(Math.floor(status.positionMillis / 1000));
    if (status.didJustFinish) {
      if (isRepeating) {
        soundRef.current?.replayAsync();
      } else {
        nextTrack();
      }
    }
  }, [isRepeating, nextTrack]);

  const seek = useCallback(async (seconds: number) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(seconds * 1000);
    setPosition(seconds);
  }, []);

  return {
    seek,
    toggleShuffle,
    toggleRepeat,
  };
}