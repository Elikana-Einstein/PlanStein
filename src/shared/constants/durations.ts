export const DURATIONS = {
  pomodoro: {
    focus:     25 * 60,   // 25 min in seconds
    break:      5 * 60,
    longBreak: 15 * 60,
    sessionsBeforeLongBreak: 4,
  },
  deepWork: {
    focus:     90 * 60,   // 90 min
    break:     20 * 60,
    longBreak: 30 * 60,
    sessionsBeforeLongBreak: 2,
  },
  custom: {
    focus:     25 * 60,   // user overrides these
    break:      5 * 60,
    longBreak: 15 * 60,
    sessionsBeforeLongBreak: 4,
  },
} as const;

export const QUOTE_ROTATION_MS = 30_000;  // 30 seconds