import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { Colors } from '../constants/Colors';

const C = Colors.dark;

type Props = {
  progress: number;      // 0–1
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showLabel?: boolean;   // show number inside ring
};

export const ProgressRing: React.FC<Props> = ({
  progress,
  size         = 80,
  strokeWidth  = 7,
  color        = C.primary,
  trackColor   = C.surfaceLight,
  showLabel    = true,
}) => {
  const radius      = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  // Animated stroke offset
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue:         clampedProgress,
      duration:        900,
      easing:          Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clampedProgress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange:  [0, 1],
    outputRange: [circumference, 0],
  });

  // AnimatedCircle — wrap Circle with Animated
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const displayScore = Math.round(clampedProgress * 100);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>

        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>

      {/* Label centred over the SVG */}
      {showLabel && (
        <View
          style={{
            position:       'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          <Svg width={size} height={size}>
            <SvgText
              x={size / 2}
              y={size / 2 + 6}
              textAnchor="middle"
              fill={color}
              fontSize={size * 0.22}
              fontWeight="600"
            >
              {displayScore}
            </SvgText>
          </Svg>
        </View>
      )}
    </View>
  );
};