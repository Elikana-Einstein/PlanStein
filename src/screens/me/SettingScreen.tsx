import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, StyleSheet, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter }    from 'expo-router';
import { Colors } from '@/shared/constants/Colors';
import { useMeStore } from '@/stores/useMeStore';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

export const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { clearAllData } = useMeStore();

  const [taskReminders,  setTaskReminders]  = useState(true);
  const [habitReminders, setHabitReminders] = useState(true);
  const [focusAlerts,    setFocusAlerts]    = useState(false);
  const [seedData,       setSeedData]       = useState(false);

  const handleClearData = () => {
    Alert.alert(
      'Clear all data',
      'This will permanently delete all your tasks, habits, focus sessions, and goals. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text:    'Clear everything',
          style:   'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Done', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Settings</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Preferences */}
        <SectionLabel title="Preferences" />
        <View style={styles.card}>
          <SettingRow
            label="Focus duration"
            value="25 min"
            color={C.secondary}
            onPress={() => {}}
          />
          <SettingRow
            label="Break duration"
            value="5 min"
            color={C.secondary}
            onPress={() => {}}
          />
          <SettingRow
            label="Theme"
            value="Dark"
            color={C.accent}
            onPress={() => {}}
            isLast
          />
        </View>

        {/* Notifications */}
        <SectionLabel title="Notifications" />
        <View style={styles.card}>
          <ToggleRow
            label="Task reminders"
            value={taskReminders}
            onToggle={setTaskReminders}
          />
          <ToggleRow
            label="Habit reminders"
            value={habitReminders}
            onToggle={setHabitReminders}
          />
          <ToggleRow
            label="Focus session alerts"
            value={focusAlerts}
            onToggle={setFocusAlerts}
            isLast
          />
        </View>

        {/* Data */}
        <SectionLabel title="Data" />
        <View style={styles.card}>
          <SettingRow
            label="Export my data"
            color={C.success}
            onPress={() => {}}
          />
          <ToggleRow
            label="Seed mock data"
            value={seedData}
            onToggle={setSeedData}
            isLast
          />
        </View>

        {/* Danger */}
        <SectionLabel title="Danger zone" />
        <View style={[styles.card, styles.dangerCard]}>
          <TouchableOpacity
            style={styles.dangerRow}
            onPress={handleClearData}
            activeOpacity={0.7}
          >
            <Text style={styles.dangerLabel}>Clear all data</Text>
            <Text style={styles.dangerChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <SectionLabel title="About" />
        <View style={styles.card}>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.rowLabelMuted}>Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <Text style={styles.rowLabelMuted}>Give feedback</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ title: string }> = ({ title }) => (
  <Text style={sStyles.label}>{title}</Text>
);

type SettingRowProps = {
  label:   string;
  value?:  string;
  color?:  string;
  onPress: () => void;
  isLast?: boolean;
};

const SettingRow: React.FC<SettingRowProps> = ({
  label, value, onPress, isLast,
}) => (
  <TouchableOpacity
    style={[styles.row, !isLast && styles.rowBorder]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.rowLabel}>{label}</Text>
    {value && <Text style={styles.rowValue}>{value}</Text>}
    <Text style={styles.chevron}>›</Text>
  </TouchableOpacity>
);

type ToggleRowProps = {
  label:    string;
  value:    boolean;
  onToggle: (v: boolean) => void;
  isLast?:  boolean;
};

const ToggleRow: React.FC<ToggleRowProps> = ({
  label, value, onToggle, isLast,
}) => (
  <View style={[styles.row, !isLast && styles.rowBorder]}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: C.surfaceLight, true: C.primary }}
      thumbColor="#fff"
    />
  </View>
);

const sStyles = StyleSheet.create({
  label: {
    fontSize:      10,
    color:         C.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom:  S.sm,
    marginTop:     S.md,
    paddingHorizontal: S.md,
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.background },

  header: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: S.md,
    paddingVertical:   S.sm,
  },
  backBtn:  { width: 60 },
  backText: { fontSize: 16, color: C.primary },
  heading: {
    fontSize:      18,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.3,
  },

  card: {
    backgroundColor:  C.surface,
    borderWidth:      0.5,
    borderColor:      C.border,
    borderRadius:     R.lg,
    overflow:         'hidden',
    marginHorizontal: S.md,
    marginBottom:     S.sm,
  },
  dangerCard: {
    borderColor: '#2a0a0a',
  },

  row: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   S.md,
    paddingHorizontal: S.md,
    gap:               S.sm,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderFaint,
  },
  rowLabel:     { flex: 1, fontSize: 13, color: C.textMuted },
  rowLabelMuted:{ flex: 1, fontSize: 13, color: C.textDim   },
  rowValue:     { fontSize: 13, color: C.textDim },
  chevron:      { fontSize: 18, color: C.textDim },

  dangerRow: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   S.md,
    paddingHorizontal: S.md,
  },
  dangerLabel:   { flex: 1, fontSize: 13, color: C.error },
  dangerChevron: { fontSize: 18, color: C.error },
});