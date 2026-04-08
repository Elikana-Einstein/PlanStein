import { SessionPhase } from '@/shared/types';
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
  interpolateColor,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useKeepAwake } from 'expo-keep-awake';

const SCREEN = Dimensions.get('window');

// Neutral dark palettes per phase — subtle, non-distracting
const BG_PALETTE: Record<SessionPhase, string[]> = {
  focus:     ['#0f1117', '#111318', '#12131a', '#0e1014', '#131419', '#0d0f13'],
  break:     ['#0d1210', '#0f1411', '#111613', '#0e1210', '#101411', '#0c1110'],
  longBreak: ['#0d0f14', '#0f1016', '#111218', '#0e1015', '#101317', '#0c0e13'],
  idle:      ['#0f1117', '#111318', '#12131a', '#0e1014', '#131419', '#0d0f13'],
};

const PHASE_COLOR: Record<SessionPhase, string> = {
  focus:     '#4f8ef7',
  break:     '#4fc78a',
  longBreak: '#a78bfa',
  idle:      '#4f8ef7',
};

type ShapeKind = 'circle' | 'square' | 'diamond' | 'triangle';

interface ShapeDef {
  id:       number;
  kind:     ShapeKind;
  x:        number;   // % of screen width
  size:     number;
  delay:    number;
  duration: number;
  opacity:  number;
}

const SHAPES: ShapeDef[] = [
  { id: 0, kind: 'circle',   x: 8,  size: 7,  delay: 0,    duration: 7000,  opacity: 0.18 },
  { id: 1, kind: 'diamond',  x: 22, size: 11, delay: 1200, duration: 9000,  opacity: 0.13 },
  { id: 2, kind: 'square',   x: 40, size: 6,  delay: 600,  duration: 8000,  opacity: 0.14 },
  { id: 3, kind: 'circle',   x: 58, size: 9,  delay: 2000, duration: 11000, opacity: 0.10 },
  { id: 4, kind: 'triangle', x: 74, size: 8,  delay: 400,  duration: 7500,  opacity: 0.13 },
  { id: 5, kind: 'diamond',  x: 88, size: 6,  delay: 1800, duration: 9500,  opacity: 0.16 },
  { id: 6, kind: 'circle',   x: 32, size: 5,  delay: 3000, duration: 6500,  opacity: 0.09 },
  { id: 7, kind: 'square',   x: 68, size: 7,  delay: 2400, duration: 10000, opacity: 0.11 },
  { id: 8, kind: 'diamond',  x: 50, size: 5,  delay: 500,  duration: 8500,  opacity: 0.10 },
  { id: 9, kind: 'circle',   x: 16, size: 9,  delay: 3500, duration: 7200,  opacity: 0.12 },
];

// ─── Single floating shape ────────────────────────────────────────────────────
const FloatingShape: React.FC<{
  shape: ShapeDef; color: string; isRunning: boolean;
}> = ({ shape, color, isRunning }) => {
  const translateY = useSharedValue(0);
  const opacity    = useSharedValue(0);
  const rotate     = useSharedValue(0);

  useEffect(() => {
    if (!isRunning) {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      cancelAnimation(rotate);
      translateY.value = 0;
      opacity.value    = 0;
      rotate.value     = 0;
      return;
    }

    const travel = SCREEN.height + shape.size + 80;

    translateY.value = withDelay(
      shape.delay,
      withRepeat(
        withTiming(-travel, { duration: shape.duration, easing: Easing.linear }),
        -1,
        false,
      ),
    );

    opacity.value = withDelay(
      shape.delay,
      withRepeat(
        withSequence(
          withTiming(shape.opacity, { duration: shape.duration * 0.15 }),
          withTiming(shape.opacity, { duration: shape.duration * 0.60 }),
          withTiming(0,             { duration: shape.duration * 0.25 }),
        ),
        -1,
        false,
      ),
    );

    rotate.value = withDelay(
      shape.delay,
      withRepeat(
        withTiming(360, { duration: shape.duration * 1.4, easing: Easing.linear }),
        -1,
        false,
      ),
    );
  }, [isRunning]);

  const animStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const s = shape.size;
  const left = (shape.x / 100) * SCREEN.width;

  const renderShape = () => {
    switch (shape.kind) {
      case 'circle':
        return (
          <View style={{
            width: s, height: s, borderRadius: s / 2,
            backgroundColor: color,
          }} />
        );
      case 'square':
        return (
          <View style={{
            width: s, height: s,
            borderWidth: 1.2, borderColor: color,
          }} />
        );
      case 'diamond':
        return (
          <View style={{
            width: s, height: s,
            borderWidth: 1.2, borderColor: color,
            transform: [{ rotate: '45deg' }],
          }} />
        );
      case 'triangle':
        return (
          <View style={{
            width:            0,
            height:           0,
            borderLeftWidth:  s * 0.6,
            borderRightWidth: s * 0.6,
            borderBottomWidth: s,
            borderLeftColor:  'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
          }} />
        );
    }
  };

  return (
    <Animated.View
      style={[{ position: 'absolute', bottom: -shape.size - 10, left }, animStyle]}
    >
      {renderShape()}
    </Animated.View>
  );
};

// ─── Animated background color ────────────────────────────────────────────────
const AnimatedBg: React.FC<{
  phase: SessionPhase; isRunning: boolean; children: React.ReactNode;
}> = ({ phase, isRunning, children }) => {
  const palette  = BG_PALETTE[phase];
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!isRunning) {
      cancelAnimation(progress);
      progress.value = withTiming(0, { duration: 1500 });
      return;
    }
    progress.value = withRepeat(
      withTiming(palette.length - 1, {
        duration: (palette.length - 1) * 14000,
        easing:   Easing.linear,
      }),
      -1,
      true,
    );
  }, [isRunning, phase]);

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      palette.map((_, i) => i),
      palette,
    ),
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, bgStyle]}>
      {children}
    </Animated.View>
  );
};

// ─── Exported component ───────────────────────────────────────────────────────
type Props = {
  phase:     SessionPhase;
  isRunning: boolean;
};

export const FocusBackground: React.FC<Props> = ({ phase, isRunning }) => {
  // Keep screen awake while mounted — tied to the background, not the circle
  useKeepAwake();

  const color = PHASE_COLOR[phase];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <AnimatedBg phase={phase} isRunning={isRunning}>
        {SHAPES.map(shape => (
          <FloatingShape
            key={shape.id}
            shape={shape}
            color={color}
            isRunning={isRunning}
          />
        ))}
      </AnimatedBg>
    </View>
  );
};