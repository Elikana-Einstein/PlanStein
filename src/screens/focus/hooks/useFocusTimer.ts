import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useState } from 'react';
import { useFocusStore } from '@/stores/useFocusStore';
import { DURATIONS } from '@/shared/constants/durations';
import { FocusService } from '@/services/FocusService';

export function useFocusTimer() {
  const {
    isRunning, phase, mode, sessionNum,
    totalSessions, setRunning, setPhase,
    nextSession, reset,
  } = useFocusStore();

  const durations = DURATIONS[mode];

  const initialTime = phase === 'focus'
    ? durations.focus
    : phase === 'longBreak'
    ? durations.longBreak
    : durations.break;

  const [timeLeft, setTimeLeft] = useState(durations.focus);

  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef   = useRef<number>(0);
  const appStateRef    = useRef<AppStateStatus>('active');

  // Format seconds → "MM:SS"
  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const phaseComplete = useCallback(async () => {
    clearInterval(intervalRef.current!);
    setRunning(false);

    // Save completed session
    if (phase === 'focus') {
      await FocusService.saveSession({
        startedAt:    startedAtRef.current,
        endedAt:      Date.now(),
        durationMins: Math.round(durations.focus / 60),
        phase:        'focus',
        mode,
        wasCompleted: true,
      });

      // Decide what comes next
      const isLastSession = sessionNum >= totalSessions;
      const nextPhase     = isLastSession ? 'longBreak' : 'break';
      setPhase(nextPhase);
      setTimeLeft(isLastSession ? durations.longBreak : durations.break);
    } else {
      // Break finished — go back to focus
      nextSession();
      setPhase('focus');
      setTimeLeft(durations.focus);
    }
  }, [phase, mode, sessionNum, totalSessions]);

  // Start timer
  const start = useCallback(() => {
    if (phase === 'idle') setPhase('focus');
    startedAtRef.current = Date.now();
    setRunning(true);
  }, [phase]);

  // Pause timer
  const pause = useCallback(() => {
    setRunning(false);
    clearInterval(intervalRef.current!);
  }, []);

  // Reset everything
  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current!);
    reset();
    setTimeLeft(DURATIONS[mode].focus);
  }, [mode]);

  // Tick every second
  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current!);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          phaseComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, phaseComplete]);

  // Handle app going to background — keep time accurate
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (appStateRef.current === 'active' && nextState === 'background') {
        // Store the timestamp when backgrounded
        startedAtRef.current = Date.now();
      }
      if (appStateRef.current !== 'active' && nextState === 'active') {
        // Calculate elapsed time while in background
        if (isRunning) {
          const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
          setTimeLeft(prev => Math.max(0, prev - elapsed));
        }
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, [isRunning]);

  const progress = 1 - timeLeft / (
    phase === 'focus'     ? durations.focus
    : phase === 'longBreak' ? durations.longBreak
    : durations.break
  );

  return {
    timeLeft,
    timeFormatted: formatTime(timeLeft),
    isRunning,
    phase,
    sessionNum,
    totalSessions,
    progress,       // 0–1 for the ring fill
    start,
    pause,
    reset: resetTimer,
  };
}