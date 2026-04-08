import { Colors } from '@/shared/constants/Colors';
import { SessionPhase } from '@/shared/types';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

const C     = Colors.dark;
const ARENA = 220;

const PHASE_COLOR: Record<SessionPhase, string> = {
  focus:     C.primary,
  break:     C.secondary,
  longBreak: C.accent,
  idle:      C.primary,
};

// ─── Single ripple ring ───────────────────────────────────────────────────────
const RippleRing: React.FC<{
  size: number; color: string; delay: number; isRunning: boolean;
}> = ({ size, color, delay, isRunning }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!isRunning) {
      cancelAnimation(progress);
      progress.value = withTiming(0, { duration: 300 });
      return;
    }
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 3000, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 0 }),
        ),
        -1,
        false,
      ),
    );
  }, [isRunning]);

  const animStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity:   p < 0.3 ? (p / 0.3) * 0.45 : ((1 - p) / 0.7) * 0.45,
      transform: [{ scale: 0.4 + p * 0.6 }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position:     'absolute',
          width:        size,
          height:       size,
          borderRadius: size / 2,
          borderWidth:  1,
          borderColor:  color,
        },
        animStyle,
      ]}
    />
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
type Props = {
  timeFormatted: string;
  sessionNum:    number;
  totalSessions: number;
  phase:         SessionPhase;
  isRunning:     boolean;
};

export const RippleCircle: React.FC<Props> = ({
  timeFormatted, sessionNum, totalSessions, phase, isRunning,
}) => {
  const color = PHASE_COLOR[phase];

  return (
    <View style={styles.arena}>
      <RippleRing size={ARENA}        color={color} delay={0}    isRunning={isRunning} />
      <RippleRing size={ARENA * 0.78} color={color} delay={900}  isRunning={isRunning} />
      <RippleRing size={ARENA * 0.56} color={color} delay={1800} isRunning={isRunning} />

      {/* Static glow ring */}
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

const styles = StyleSheet.create({
  arena: {
    width:          ARENA,
    height:         ARENA,
    alignItems:     'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  glowRing: {
    position:     'absolute',
    width:        110,
    height:       110,
    borderRadius: 55,
    borderWidth:  1,
  },
  center: {
    width:           100,
    height:          100,
    borderRadius:    50,
    backgroundColor: C.surface,
    borderWidth:     1.5,
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          5,
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