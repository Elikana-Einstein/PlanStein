// Pure utility — no hooks, no store access.
// Pass `duration` (in minutes) from the caller that already has store access.

export const DURATIONS = (duration: number) => ({
  pomodoro: {
    focus:                    25 * 60,        // always fixed at 25 min
    break:                     5 * 60,
    longBreak:                15 * 60,
    sessionsBeforeLongBreak:  4,
  },
  deepWork: {
    focus:                    90 * 60,        // always fixed at 90 min
    break:                    20 * 60,
    longBreak:                30 * 60,
    sessionsBeforeLongBreak:  2,
  },
  custom: {
    focus:                    duration * 60,  // only custom is user-defined
    break:                     5 * 60,
    longBreak:                15 * 60,
    sessionsBeforeLongBreak:  4,
  },
});

export const QUOTE_ROTATION_MS = 30_000;