import { Colors } from '@/shared/constants/Colors';
import { DailyBrief } from '@/shared/types';
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet,
  Animated, ActivityIndicator,
} from 'react-native';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

type Props = {
  brief:     DailyBrief | null;
  isLoading: boolean;
  error:     string | null;
};

export const DailyBriefCard: React.FC<Props> = ({ brief, isLoading, error }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isLoading) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [isLoading]);

  return (
    <View style={styles.card}>
      {/* Label row */}
      <View style={styles.labelRow}>
        <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
        <Text style={styles.label}>Daily brief</Text>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={C.primary} />
          <Text style={styles.loadingText}>Generating your brief...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>Could not generate brief. Tap to retry.</Text>
      ) : brief ? (
        <>
          <Text style={styles.message}>{brief.message}</Text>
          <View style={styles.chips}>
            <Chip label={`${brief.tasksDue} tasks due`}    color={C.primary}   />
            <Chip label={`${brief.habitsCount} habits`}    color={C.secondary} />
            <Chip label={`${brief.streak}d streak`}        color={C.accent}    />
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>Your daily brief will appear here.</Text>
      )}
    </View>
  );
};

// ─── Chip ─────────────────────────────────────────────────────────────────────

const Chip: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <View style={[styles.chip, { borderColor: `${color}44`, backgroundColor: `${color}18` }]}>
    <Text style={[styles.chipText, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.lg,
    padding:         S.md,
    marginBottom:    S.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
    marginBottom:  S.sm,
  },
  dot: {
    width:           5,
    height:          5,
    borderRadius:    3,
    backgroundColor: C.primary,
  },
  label: {
    fontSize:      9,
    color:         C.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  message: {
    fontSize:   12,
    color:      C.textMuted,
    lineHeight: 19,
    marginBottom: S.sm,
  },
  chips: {
    flexDirection: 'row',
    gap:           6,
    flexWrap:      'wrap',
  },
  chip: {
    paddingVertical:   3,
    paddingHorizontal: 9,
    borderRadius:      R.full,
    borderWidth:       0.5,
  },
  chipText: {
    fontSize:   10,
    fontWeight: '500',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           S.sm,
    paddingVertical: S.sm,
  },
  loadingText: {
    fontSize: 12,
    color:    C.textDim,
  },
  errorText: {
    fontSize: 12,
    color:    C.error,
  },
  emptyText: {
    fontSize: 12,
    color:    C.textDim,
  },
});