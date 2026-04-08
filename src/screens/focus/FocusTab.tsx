import { Colors } from '@/shared/constants/Colors';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusTimer } from './hooks/useFocusTimer';
import { useFocusStore } from '@/stores/useFocusStore';
import { RippleCircle } from './components/RippleCircle';
import { QuoteCard } from './components/QuoteCard';
import { PlayerCard } from './components/PlayerCard';
import { FocusBackground } from './components/FocusBackground';

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
    timeFormatted, timeLeft, isRunning, phase,
    sessionNum, totalSessions, start, pause, reset,
  } = useFocusTimer();

  const {
    duration,
    incrementDuration,
    decrementDuration,
    mode,
    setMode,
  } = useFocusStore();

  const breakIn =
    phase === 'focus'
      ? `Break in ${Math.ceil(timeLeft / 60)} min`
      : phase === 'break'
      ? 'Focus resumes after break'
      : phase === 'longBreak'
      ? 'Long break — well deserved!'
      : 'Choose your session type below';
  
      const [hide,setHide]=useState(false)

  return (
    <View style={styles.root}>

      {/* Layer 0 — full-screen animated background + floating shapes */}
      <FocusBackground phase={phase} isRunning={isRunning} />

      {/* Layer 1 — all UI on top, transparent so background shows through */}
      <View style={styles.ui}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Focus</Text>
          <View style={[styles.badge, phase !== 'idle' && styles.badgeActive]}>
            <Text style={[styles.badgeText, phase !== 'idle' && styles.badgeTextActive]}>
              {MODE_LABELS[mode]} · {sessionNum} of {totalSessions}
            </Text>
          </View>
        </View>

        {/* Mode pills */}
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

        {/* Ripple circle — inline in normal flow, sits above background */}
        <RippleCircle
          timeFormatted={timeFormatted}
          sessionNum={sessionNum}
          totalSessions={totalSessions}
          phase={phase}
          isRunning={isRunning}
        />

        {/* Duration picker — custom mode only */}
        {mode === 'custom' && hide == false  && (
          <View style={styles.durationPicker}>
            <TouchableOpacity
              style={[styles.durationBtn, duration <= 10 && styles.durationBtnDisabled]}
              onPress={decrementDuration}
              disabled={duration <= 10}
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color={duration <= 10 ? C.textDim : C.text}
              />
            </TouchableOpacity>

            <View style={styles.durationValue}>
              <Text style={styles.durationValueText}>{duration}</Text>
              <Text style={styles.durationUnit}>min</Text>
            </View>

            <TouchableOpacity
              style={[styles.durationBtn, duration >= 240 && styles.durationBtnDisabled]}
              onPress={incrementDuration}
              disabled={duration >= 240}
            >
              <Ionicons
                name="chevron-forward"
                size={18}
                color={duration >= 240 ? C.textDim : C.text}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Phase labels */}
        <Text style={styles.phaseLabel}>{PHASE_LABEL[phase]}</Text>
        <Text style={styles.phaseSub}>{breakIn}</Text>

        {/* Cards + controls */} 
        <View style={styles.content}>
          <QuoteCard />
          <PlayerCard />

          <View style={styles.timerControls}>
            <TouchableOpacity style={styles.resetBtn} onPress={()=>{reset(),setHide(false)}}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.startBtn, isRunning && styles.pauseBtn]}
                onPress={() => {
                      isRunning ? pause() : start();
                      setHide(true);
                    }}
              activeOpacity={0.8}
            >
              <Text style={[styles.startText, isRunning && styles.pauseText]}>
                {isRunning ? 'Pause' : phase === 'idle' ? 'Start' : 'Resume'}
              </Text>
            </TouchableOpacity>

            <View style={{ width: 60 }} />
          </View>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  ui: {
    flex:              1,
    alignItems:        'center',
    paddingHorizontal: S.md,
    // No backgroundColor — FocusBackground shows through
  },
  header: {
    width:           '100%',
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    paddingVertical: S.sm,
  },
  heading: {
    fontSize:      22,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor:   C.surfaceLight,
    borderWidth:       0.5,
    borderColor:       C.border,
    borderRadius:      R.full,
    paddingVertical:   4,
    paddingHorizontal: 12,
  },
  badgeActive: {
    backgroundColor: C.primaryFaint,
    borderColor:     C.primaryDim,
  },
  badgeText:       { fontSize: 11, color: C.textDim },
  badgeTextActive: { color: C.primary },

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

  durationPicker: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   C.surface,
    borderRadius:      40,
    paddingHorizontal: 8,
    paddingVertical:   6,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 2 },
    shadowOpacity:     0.08,
    shadowRadius:      4,
    elevation:         2,
    marginBottom:      S.sm,
    position:'absolute',
    top:260,
    bottom:-30,
    zIndex:1000,
    height:40
  },

  durationBtn: {
    width:           36,
    height:          36,
    borderRadius:    18,
    backgroundColor: C.background,
    alignItems:      'center',
    justifyContent:  'center',
  },
  durationBtnDisabled: { opacity: 0.5 },
  durationValue: {
    flexDirection:     'row',
    alignItems:        'baseline',
    paddingHorizontal: 16,
  },
  durationValueText: {
    fontSize:   20,
    fontWeight: '700',
    color:      C.text,
  },
  durationUnit: {
    fontSize:   12,
    color:      C.textDim,
    marginLeft: 2,
    fontWeight: '500',
  },

  phaseLabel: {
    fontSize:  13,
    color:     C.textMuted,
    marginTop: 4,
  },
  phaseSub: {
    fontSize:     11,
    color:        C.textDim,
    marginBottom: S.sm,
  },

  content: { width: '100%' },

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
  pauseText: {
    color: C.primary,
  },
});