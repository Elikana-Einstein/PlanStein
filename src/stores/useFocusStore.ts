import { create } from 'zustand';
import { SessionPhase, SessionMode } from '../shared/types/index';
import { Vibration } from 'react-native';

interface FocusState {
  // Timer state
  isRunning:     boolean;
  phase:         SessionPhase;
  mode:          SessionMode;
  sessionNum:    number;
  totalSessions: number;
  duration:      number; // Current session duration in minutes

  // Actions
  setRunning:    (running: boolean)      => void;
  setPhase:      (phase: SessionPhase)   => void;
  setMode:       (mode: SessionMode)     => void;
  nextSession:   ()                      => void;
  reset:         ()                      => void;

  // Duration actions
  setDuration:        (duration: number) => void;
  incrementDuration:  () => void;
  decrementDuration:  () => void;
  resetDuration:      () => void;
}

const MIN_DURATION = 10;
const MAX_DURATION = 240;
const STEP = 5;
const DEFAULT_DURATION = 25; // Pomodoro default is 25 min
const DEFAULT_SESSION_NUMS: Record<SessionMode, number> = {
  pomodoro:  4,
  deepWork:  2,
  custom:    4,
};
const DEFAULT_DURATIONS: Record<SessionMode, number> = {
  pomodoro:  25,
  deepWork:  50,
  custom:    25,
};

export const useFocusStore = create<FocusState>((set, get) => ({
  isRunning:     false,
  phase:         'idle',
  mode:          'pomodoro',
  sessionNum:    1,
  totalSessions: DEFAULT_SESSION_NUMS.pomodoro,
  duration:      DEFAULT_DURATIONS.pomodoro,

  setRunning: (running) => set({ isRunning: running }),

  setPhase: (phase) => set({ phase }),

  setMode: (mode) => {
    set({ 
      mode, 
      totalSessions: DEFAULT_SESSION_NUMS[mode], 
      sessionNum: 1, 
      phase: 'idle', 
      isRunning: false,
      duration: DEFAULT_DURATIONS[mode], // Also reset duration when mode changes
    });
  },

  nextSession: () => {
    const { sessionNum, totalSessions, mode } = get();
    if (sessionNum >= totalSessions) {
      // All sessions complete
      set({ sessionNum: 1, phase: 'idle', isRunning: false });
    } else {
      // Move to next session
      set({ sessionNum: sessionNum + 1, phase: 'idle', isRunning: false });
    }
  },

  reset: () => {
    const { mode } = get();
    set({
      isRunning: false,
      phase: 'idle',
      sessionNum: 1,
      duration: DEFAULT_DURATIONS[mode],
    });
  },

  setDuration: (duration) => {
    const clamped = Math.min(Math.max(duration, MIN_DURATION), MAX_DURATION);
    set({ duration: clamped });
  },
  
  incrementDuration: () => {
    const { duration } = get();
    if (duration < MAX_DURATION) {
      const newDuration = Math.min(duration + STEP, MAX_DURATION);
      set({ duration: newDuration });
      Vibration.vibrate(10);
    }
  },
  
  decrementDuration: () => {
    const { duration } = get();
    if (duration > MIN_DURATION) {
      const newDuration = Math.max(duration - STEP, MIN_DURATION);
      set({ duration: newDuration });
      Vibration.vibrate(10);
    }
  },
   
  resetDuration: () => {
    const { mode } = get();
    set({ duration: DEFAULT_DURATIONS[mode] });
  },
}));