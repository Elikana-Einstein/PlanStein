import { Colors } from '@/shared/constants/Colors';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView as SAV } from 'react-native-safe-area-context';
import { useFocusTimer } from './hooks/useFocusTimer';
import { useFocusStore } from '@/stores/useFocusStore';
import { DURATIONS } from '@/shared/constants/durations';
import { RippleCircle } from './components/RippleCircle';
import { QuoteCard } from './components/QuoteCard';
import { PlayerCard } from './components/PlayerCard';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

type Mode = 'pomodoro' | 'deepWork' | 'custom';

const MODE_LABELS: Record<Mode, string> = {
  pomodoro: 'Pomodoro',
  deepWork: 'Deep work',
  custom:   'Custom',
};

const PHASE_LABEL: Record<string, string> = {
  focus:     'Focus phase',
  break:     'Break phase',
  longBreak: 'Long break',
  idle:      'Start when ready',
};

export const FocusTab: React.FC = () => {
  const {
    timeFormatted, isRunning, phase,
    sessionNum, totalSessions, start, pause, reset,
  } = useFocusTimer();

  const { mode, setMode } = useFocusStore();
  const durations = DURATIONS[mode];

  const breakIn = phase === 'focus'
    ? `Break in ${Math.round(durations.focus / 60)} mins`
    : phase === 'break'
    ? 'Focus resumes after break'
    : phase === 'longBreak'
    ? 'Long break — well deserved!'
    : 'Choose your session type below';

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Focus</Text>
        <View style={[styles.badge, phase !== 'idle' && styles.badgeActive]}>
          <Text style={[styles.badgeText, phase !== 'idle' && styles.badgeTextActive]}>
            {MODE_LABELS[mode]} · {sessionNum} of {totalSessions}
          </Text>
        </View>
      </View>

      {/* Session mode pills */}
      <View style={styles.pills}>
        {(['pomodoro', 'deepWork', 'custom'] as Mode[]).map(m => (
          <TouchableOpacity
            key={m}
            style={[styles.pill, mode === m && styles.pillActive]}
            onPress={() => setMode(m)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pillText, mode === m && styles.pillTextActive]}>
              {MODE_LABELS[m]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ripple circle */}
      <RippleCircle
        timeFormatted={timeFormatted}
        sessionNum={sessionNum}
        totalSessions={totalSessions}
        phase={phase}
        isRunning={isRunning}
      />

      {/* Phase label */}
      <Text style={styles.phaseLabel}>{PHASE_LABEL[phase]}</Text>
      <Text style={styles.phaseSub}>{breakIn}</Text>

      {/* Quote */}
      <View style={styles.content}>
        <QuoteCard />

        {/* Player */}
        <PlayerCard />

        {/* Start / Pause / Reset row */}
        <View style={styles.timerControls}>
          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.startBtn, isRunning && styles.pauseBtn]}
            onPress={isRunning ? pause : start}
            activeOpacity={0.8}
          >
            <Text style={styles.startText}>
              {isRunning ? 'Pause' : phase === 'idle' ? 'Start' : 'Resume'}
            </Text>
          </TouchableOpacity>

          <View style={{ width: 60 }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:  1,
    alignItems: 'center',
    paddingHorizontal: S.md,
  },
  header: {
    width:          '100%',
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: S.sm,
  },
  heading: {
    fontSize:      22,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor: C.surfaceLight,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.full,
    paddingVertical:   4,
    paddingHorizontal: 12,
  },
  badgeActive: {
    backgroundColor: C.primaryFaint,
    borderColor:     C.primaryDim,
  },
  badgeText:       { fontSize: 11, color: C.textDim },
  badgeTextActive: { color: C.primary },

  // Pills
  pills: {
    flexDirection: 'row',
    gap:           S.sm,
    marginBottom:  S.sm,
  },
  pill: {
    paddingVertical:   5,
    paddingHorizontal: 14,
    borderRadius:      R.full,
    borderWidth:       0.5,
    borderColor:       C.border,
    backgroundColor:   C.surfaceLight,
  },
  pillActive: {
    backgroundColor: C.primaryFaint,
    borderColor:     C.primaryDim,
  },
  pillText:       { fontSize: 11, color: C.textDim },
  pillTextActive: { color: C.primary },

  // Phase
  phaseLabel: {
    fontSize:   13,
    color:      C.textMuted,
    marginTop:  4,
  },
  phaseSub: {
    fontSize:     11,
    color:        C.textDim,
    marginBottom: S.sm,
  },

  content: { width: '100%' },

  // Timer controls
  timerControls: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginTop:      S.sm,
  },
  resetBtn: {
    width:           60,
    paddingVertical: 10,
    alignItems:      'center',
  },
  resetText: {
    fontSize: 13,
    color:    C.textDim,
  },
  startBtn: {
    flex:            1,
    maxWidth:        160,
    paddingVertical: 14,
    borderRadius:    R.full,
    backgroundColor: C.primary,
    alignItems:      'center',
  },
  pauseBtn: {
    backgroundColor: C.surfaceLight,
    borderWidth:     0.5,
    borderColor:     C.primaryDim,
  },
  startText: {
    fontSize:   15,
    fontWeight: '600',
    color:      '#fff',
  },
});