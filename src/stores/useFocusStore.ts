import { create } from 'zustand';
import { SessionPhase, SessionMode } from '../shared/types/index';

interface FocusState {
  // Timer state
  isRunning:     boolean;
  phase:         SessionPhase;
  mode:          SessionMode;
  sessionNum:    number;
  totalSessions: number;

  // Actions
  setRunning:    (running: boolean)      => void;
  setPhase:      (phase: SessionPhase)   => void;
  setMode:       (mode: SessionMode)     => void;
  nextSession:   ()                      => void;
  reset:         ()                      => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  isRunning:     false,
  phase:         'idle',
  mode:          'pomodoro',
  sessionNum:    1,
  totalSessions: 4,

  setRunning: (running) => set({ isRunning: running }),

  setPhase: (phase) => set({ phase }),

  setMode: (mode) => {
    const totals: Record<SessionMode, number> = {
      pomodoro:  4,
      deepWork:  2,
      custom:    4,
    };
    set({ mode, totalSessions: totals[mode], sessionNum: 1, phase: 'idle', isRunning: false });
  },

  nextSession: () => {
    const { sessionNum, totalSessions } = get();
    if (sessionNum >= totalSessions) {
      set({ sessionNum: 1, phase: 'idle', isRunning: false });
    } else {
      set({ sessionNum: sessionNum + 1 });
    }
  },

  reset: () => set({
    isRunning:  false,
    phase:      'idle',
    sessionNum: 1,
  }),
}));