import React from 'react';
import {
  ScrollView, View, Text,
  TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter }    from 'expo-router';
import { Colors } from '@/shared/constants/Colors';
import { useMeData } from './hooks/useMeData';
import { ProfileCard } from './components/ProfileCard';
import { StreakBadge } from './components/StreakBadge';
import { TodaySummary } from './components/TodaySummary';
import { ConsistencyHeatmap } from './components/ConsistencyHeatMap';
import { FocusStatsCard } from './components/FocusStatsCard';
import { HabitsPreview } from './components/HabitsPreview';
import { GoalsOverview } from './components/GoalsOverview';
import { WeeklyReviewCard } from './components/WeeklyReviewCard';
import { AchievementsRow } from './components/AchievementsRow';

const C = Colors.dark;
const S = Colors.spacing;

export const MeScreen: React.FC = () => {
  const router = useRouter();
  const {
    profile, stats, weeklyReview,
    achievements, isLoading,
    updateName, saveWeeklyReview,
  } = useMeData();

  if (isLoading || !profile || !stats) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <ActivityIndicator color={C.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Me</Text>
          <TouchableOpacity
            style={styles.gearBtn}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.gearIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* Profile */}
        <ProfileCard
          profile={profile}
          onEditName={updateName}
        />
        <StreakBadge currentStreak={stats.currentStreak} />

        {/* Today */}
        <SectionHeader
          title="Today"
          actionLabel="Full report"
          onAction={() => {}}
        />
        <TodaySummary stats={stats} />

        {/* Consistency */}
        <SectionHeader title="Consistency" />
        <ConsistencyHeatmap stats={stats} />

        {/* Focus */}
        <SectionHeader title="Focus this week" />
        <FocusStatsCard stats={stats} />

        {/* Habits — button navigates to habits screen */}
        <SectionHeader
          title="Habits"
          actionLabel="Manage →"
          onAction={() => router.push('/habits')}
        />
        <HabitsPreview habits={[]} />

        {/* Goals */}
        <SectionHeader
          title="Goals"
          actionLabel="See all"
          onAction={() => {}}
        />
        <GoalsOverview goals={[]} />

        {/* Weekly review */}
        <SectionHeader title="Weekly review" />
        <WeeklyReviewCard
          review={weeklyReview}
          onSave={saveWeeklyReview}
        />

        {/* Achievements */}
        <SectionHeader title="Achievements" />
        <AchievementsRow achievements={achievements} />

        <View style={{ height: S.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── SectionHeader ────────────────────────────────────────────────────────────

type SectionHeaderProps = {
  title:       string;
  actionLabel?: string;
  onAction?:   () => void;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title, actionLabel, onAction,
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionLabel && onAction && (
      <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
        <Text style={styles.sectionAction}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: S.md, paddingBottom: S.xl },

  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingVertical: S.sm,
  },
  heading: {
    fontSize:      22,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.5,
  },
  gearBtn: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    alignItems:      'center',
    justifyContent:  'center',
  },
  gearIcon: { fontSize: 16, color: C.textMuted },

  sectionHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginTop:      S.md,
    marginBottom:   S.sm,
  },
  sectionTitle: {
    fontSize:      11,
    color:         C.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionAction: {
    fontSize: 11,
    color:    C.primary,
  },
});