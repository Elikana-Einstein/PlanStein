import { Colors } from '@/shared/constants/Colors';
import { SessionPhase } from '@/shared/types';
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const C = Colors.dark;

type Props = {
  timeFormatted: string;
  sessionNum:    number;
  totalSessions: number;
  phase:         SessionPhase;
  isRunning:     boolean;
};

// Color per phase
const PHASE_COLOR: Record<SessionPhase, string> = {
  focus:     C.primary,
  break:     C.secondary,
  longBreak: C.accent,
  idle:      C.primary,
};

export const RippleCircle: React.FC<Props> = ({
  timeFormatted, sessionNum, totalSessions, phase, isRunning,
}) => {
  const color = PHASE_COLOR[phase];

  // Three ripple rings, each offset in time
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;

  const createRipple = (anim: Animated.Value, delay: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue:         1,
          duration:        3000,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue:         0,
          duration:        0,
          useNativeDriver: true,
        }),
      ])
    );

  useEffect(() => {
    if (!isRunning) {
      ripple1.setValue(0);
      ripple2.setValue(0);
      ripple3.setValue(0);
      return;
    }
    const a1 = createRipple(ripple1, 0);
    const a2 = createRipple(ripple2, 900);
    const a3 = createRipple(ripple3, 1800);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [isRunning, phase]);

  const makeRippleStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({
      inputRange:  [0, 0.3, 1],
      outputRange: [0, 0.6, 0],
    }),
    transform: [{
      scale: anim.interpolate({
        inputRange:  [0, 1],
        outputRange: [0.4, 1],
      }),
    }],
  });

  return (
    <View style={styles.arena}>
      {/* Ripple rings */}
      <Animated.View style={[styles.ripple, styles.ripple1,
        makeRippleStyle(ripple1), { borderColor: color }]} />
      <Animated.View style={[styles.ripple, styles.ripple2,
        makeRippleStyle(ripple2), { borderColor: color }]} />
      <Animated.View style={[styles.ripple, styles.ripple3,
        makeRippleStyle(ripple3), { borderColor: color }]} />

      {/* Glow ring */}
      <View style={[styles.glowRing, { borderColor: `${color}33` }]} />

      {/* Center circle */}
      <View style={[styles.center, { borderColor: `${color}44` }]}>
        <Text style={[styles.timer, { color }]}>{timeFormatted}</Text>
        <Text style={styles.label}>remaining</Text>
        {totalSessions > 1 && (
          <Text style={[styles.session, { color }]}>
            {sessionNum} of {totalSessions}
          </Text>
        )}
      </View>
    </View>
  );
};

const ARENA = 220;
const styles = StyleSheet.create({
  arena: {
    width:          ARENA,
    height:         ARENA,
    alignItems:     'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  ripple: {
    position:     'absolute',
    borderRadius: 9999,
    borderWidth:  1,
  },
  ripple1: { width: ARENA,       height: ARENA       },
  ripple2: { width: ARENA * .78, height: ARENA * .78 },
  ripple3: { width: ARENA * .56, height: ARENA * .56 },
  glowRing: {
    position:     'absolute',
    width:        110,
    height:       110,
    borderRadius: 55,
    borderWidth:  1,
  },
  center: {
    width:          100,
    height:         100,
    borderRadius:   50,
    backgroundColor: C.surface,
    borderWidth:    1.5,
    alignItems:     'center',
    justifyContent: 'center',
    zIndex:         5,
  },
  timer: {
    fontSize:      22,
    fontWeight:    '600',
    letterSpacing: -0.8,
  },
  label: {
    fontSize:      8,
    color:         C.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop:     2,
  },
  session: {
    fontSize:  8,
    marginTop: 2,
  },
});