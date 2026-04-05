import { QUOTE_ROTATION_MS } from '@/shared/constants/durations';
import { FOCUS_QUOTES } from '@/shared/constants/quotes';
import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function useQuoteRotator() {
  const [index,    setIndex]    = useState(0);
  const fadeAnim  = useRef(new Animated.Value(1)).current;

  const rotateTo = (nextIndex: number) => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue:         0,
      duration:        600,
      useNativeDriver: true,
    }).start(() => {
      setIndex(nextIndex);
      // Fade in
      Animated.timing(fadeAnim, {
        toValue:         1,
        duration:        600,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (index + 1) % FOCUS_QUOTES.length;
      rotateTo(next);
    }, QUOTE_ROTATION_MS);

    return () => clearInterval(interval);
  }, [index]);

  return {
    quote:    FOCUS_QUOTES[index],
    fadeAnim,
    index,
    total:    FOCUS_QUOTES.length,
  };
}