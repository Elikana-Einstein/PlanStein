import { useEffect, useRef, useCallback, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useFocusStore } from '@/stores/useFocusStore';
import { FocusService } from '@/services/FocusService';
import { DURATIONS } from '@/shared/constants/durations';

export function useFocusTimer() {
  const {
    isRunning, phase, mode, sessionNum,
    totalSessions, duration,
    setRunning, setPhase, nextSession, reset,
  } = useFocusStore();

  // DURATIONS is now a pure function — pass duration directly
  const durations        = DURATIONS(duration);
  const currentDurations = durations[mode];

  const getCurrentTime = useCallback((): number => {
    if (phase === 'focus')     return currentDurations.focus;
    if (phase === 'longBreak') return currentDurations.longBreak;
    if (phase === 'break')     return currentDurations.break;
    return currentDurations.focus; // idle — show focus time as preview
  }, [phase, currentDurations]);

  const [timeLeft, setTimeLeft] = useState<number>(getCurrentTime);

  const intervalRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef  = useRef<number>(0);   // when this session actually began
  const backgroundedAtRef = useRef<number>(0);  // when app went to background
  const appStateRef      = useRef<AppStateStatus>('active');
  const isCompletingRef  = useRef<boolean>(false); // guard against double-fire

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const clearTick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // ─── Phase complete ──────────────────────────────────────────────────────────

  const phaseComplete = useCallback(async () => {
    // Guard: prevent firing more than once per phase
    if (isCompletingRef.current) return;
    isCompletingRef.current = true;

    clearTick();
    setRunning(false);

    if (phase === 'focus') {
      await FocusService.saveSession({
        startedAt:    sessionStartRef.current,
        endedAt:      Date.now(),
        durationMins: Math.round(currentDurations.focus / 60),
        phase:        'focus',
        mode,
        wasCompleted: true,
      });

      const isLastSession = sessionNum >= totalSessions;
      const nextPhase     = isLastSession ? 'longBreak' : 'break';
      setPhase(nextPhase);
      setTimeLeft(isLastSession ? currentDurations.longBreak : currentDurations.break);
    } else {
      // Break finished — advance session, return to focus
      nextSession();
      setPhase('focus');
      setTimeLeft(currentDurations.focus);
    }

    isCompletingRef.current = false;
  }, [phase, mode, sessionNum, totalSessions, currentDurations, setRunning, setPhase, nextSession]);

  // ─── Controls ────────────────────────────────────────────────────────────────

  const start = useCallback(() => {
    if (phase === 'idle') setPhase('focus');
    sessionStartRef.current = Date.now();
    setRunning(true);
  }, [phase, setPhase, setRunning]);

  const pause = useCallback(() => {
    clearTick();
    setRunning(false);
  }, [setRunning]);

  const resetTimer = useCallback(() => {
    clearTick();
    reset();
    setTimeLeft(currentDurations.focus);
    isCompletingRef.current = false;
  }, [reset, currentDurations]);

  // ─── Sync timeLeft when phase or mode changes ────────────────────────────────

  useEffect(() => {
    setTimeLeft(getCurrentTime());
  }, [phase, mode, duration]); // include duration so custom changes are reflected

  // ─── Tick ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isRunning) {
      clearTick();
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

    return clearTick;
  }, [isRunning, phaseComplete]);

  // ─── Background / foreground correction ──────────────────────────────────────

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (appStateRef.current === 'active' && nextState === 'background') {
        // Record exactly when we went to background — separate from sessionStartRef
        backgroundedAtRef.current = Date.now();
      }

      if (appStateRef.current !== 'active' && nextState === 'active') {
        if (isRunning) {
          const elapsed = Math.floor((Date.now() - backgroundedAtRef.current) / 1000);
          setTimeLeft(prev => {
            const remaining = Math.max(0, prev - elapsed);
            if (remaining === 0) phaseComplete();
            return remaining;
          });
        }
      }

      appStateRef.current = nextState;
    });

    return () => sub.remove();
  }, [isRunning, phaseComplete]);

  // ─── Derived ──────────────────────────────────────────────────────────────────

  const totalTime = getCurrentTime();
  const progress  = totalTime > 0 ? 1 - timeLeft / totalTime : 0;

  return {
    timeLeft,
    timeFormatted: formatTime(timeLeft),
    isRunning,
    phase,
    sessionNum,
    totalSessions,
    progress,
    start,
    pause,
    reset: resetTimer,
  };
}