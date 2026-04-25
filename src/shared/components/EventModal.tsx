import React, { useState, useRef, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { generateUUID, todayDate } from '../utils';
import { useTasksStore } from '@/stores/tasksStore';
import { useEventsStore } from '@/stores/eventStore';
import { EventsService } from '@/services/EventsService';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

type ReminderOption = 'evening_before' | 'morning_of' | null;

interface EventForm {
  id: string;
  title: string;
  date: Date;
  time: Date | null;       // the event's time-of-day
  recurrent: boolean;
  reminder: ReminderOption; // UI selection
  category: string;
  completed: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORIES = ['Personal', 'Work', 'Health', 'Social', 'Finance', 'Other'];

const EVENING_HOUR = 18; // 6:00 PM
const MORNING_HOUR = 8;  // 8:00 AM

/**
 * Computes the actual reminder timestamp to store in the DB.
 *  - "evening_before" → 18:00 on (eventDate - 1 day)
 *  - "morning_of"     → 08:00 on eventDate
 * Returns an ISO string or null.
 */
function computeReminderTime(
  eventDate: Date,
  reminder: ReminderOption
): string | null {
  if (!reminder) return null;

  const base = new Date(eventDate);

  if (reminder === 'evening_before') {
    base.setDate(base.getDate() - 1);
    base.setHours(EVENING_HOUR, 0, 0, 0);
  } else {
    // morning_of
    base.setHours(MORNING_HOUR, 0, 0, 0);
  }

  return base.toISOString();
}

/** Formats a Date as "HH:MM" for display. */
function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// ─── Component ────────────────────────────────────────────────────────────────

const INITIAL_FORM: EventForm = {
  id: '',
  title: '',
  date: todayDate,
  time: null,
  recurrent: false,
  reminder: null,
  category: 'Personal',
  completed: false,
};

const EventModalComponent = () => {
  const toggleModal = useTasksStore((state) => state.toggleModal);
  const openModal   = useTasksStore((state) => state.openModal);
  const loadAllEvents = useEventsStore((state) => state.loadAllEvents);

  const [form, setForm] = useState<EventForm>(INITIAL_FORM);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, []);

  // ── Close ──────────────────────────────────────────────────────────────────

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setForm(INITIAL_FORM);
      toggleModal();
    });
  };

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert('Missing Information', 'Please enter an event title.');
      return;
    }

    try {
      const id            = generateUUID();
      const reminder_time = computeReminderTime(form.date, form.reminder);

      const payload = {
        id,
        title:         form.title.trim(),
        date:          form.date.toISOString().split('T')[0],          // "YYYY-MM-DD"
        time:          form.time ? formatTime(form.time) : null,       // "HH:MM" or null
        recurrent:     form.recurrent ? 1 : 0,
        reminder_time,                                                  // ISO string or null
        category:      form.category,
        completed:     0,
      };

      await EventsService.addEvent(payload);
      console.log('Event payload:', payload);

      await loadAllEvents();
      setForm(INITIAL_FORM);
      handleClose();
    } catch (error) {
      console.error('Failed to save event:', error);
      Alert.alert('Error', 'Could not save the event. Please try again.');
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const reminderLabel: Record<NonNullable<ReminderOption>, string> = {
    evening_before: `Evening before (6:00 PM)`,
    morning_of:     `Morning of (8:00 AM)`,
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={openModal}
      onRequestClose={toggleModal}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Add New Event</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.content}>

              {/* ── Title ── */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Event Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Team dinner"
                  placeholderTextColor={C.textDim}
                  value={form.title}
                  onChangeText={(text) => setForm({ ...form, title: text })}
                  autoFocus={true}
                  returnKeyType="next"
                />
              </View>

              {/* ── Category ── */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.chipRow}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.chip,
                        form.category === cat && styles.chipActive,
                      ]}
                      onPress={() => setForm({ ...form, category: cat })}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          form.category === cat && styles.chipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* ── Date ── */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={[styles.dateButtonText, { color: C.text }]}>
                    {form.date.toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={form.date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    minimumDate={new Date()}
                    onChange={(e, selectedDate) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (e.type === 'set' && selectedDate) {
                        setForm({ ...form, date: selectedDate });
                      }
                    }}
                  />
                )}
              </View>

              {/* ── Time ── */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Time (optional)</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={[
                    styles.dateButtonText,
                    form.time ? { color: C.text } : {},
                  ]}>
                    {form.time ? formatTime(form.time) : 'Select a time'}
                  </Text>
                </TouchableOpacity>

                {showTimePicker && (
                  <DateTimePicker
                    value={form.time ?? new Date()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, selectedTime) => {
                      setShowTimePicker(Platform.OS === 'ios');
                      if (e.type === 'set' && selectedTime) {
                        setForm({ ...form, time: selectedTime });
                      }
                    }}
                  />
                )}
              </View>

              {/* ── Recurring ── */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Recurring</Text>
                <View style={styles.frequencyContainer}>
                  {([false, true] as const).map((option) => (
                    <TouchableOpacity
                      key={String(option)}
                      style={[
                        styles.frequencyOption,
                        form.recurrent === option && styles.frequencyOptionActive,
                      ]}
                      onPress={() => setForm({ ...form, recurrent: option })}
                    >
                      <Text
                        style={[
                          styles.frequencyOptionText,
                          form.recurrent === option && styles.frequencyOptionTextActive,
                        ]}
                      >
                        {option ? 'Yes' : 'No'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* ── Reminder ── */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reminder (optional)</Text>
                <View style={styles.frequencyContainer}>
                  {(['evening_before', 'morning_of'] as ReminderOption[]).map((opt) => (
                    <TouchableOpacity
                      key={opt!}
                      style={[
                        styles.frequencyOption,
                        form.reminder === opt && styles.frequencyOptionActive,
                      ]}
                      onPress={() =>
                        setForm({ ...form, reminder: form.reminder === opt ? null : opt })
                      }
                    >
                      <Text
                        style={[
                          styles.frequencyOptionText,
                          form.reminder === opt && styles.frequencyOptionTextActive,
                        ]}
                      >
                        {reminderLabel[opt!]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Preview computed reminder time */}
                {form.reminder && (
                  <Text style={styles.reminderPreview}>
                    🔔 Reminder set for{' '}
                    {new Date(
                      computeReminderTime(form.date, form.reminder)!
                    ).toLocaleString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                )}
              </View>

              {/* ── Buttons ── */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save Event</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: C.surface,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: C.textDim,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: S.sm,
    marginBottom: S.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: S.lg,
    paddingBottom: S.md,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: {
    color: C.primary,
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: C.textDim,
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: S.lg,
  },
  inputGroup: {
    marginBottom: S.lg,
    backgroundColor: C.surface,
    padding: S.md,
    borderRadius: R.md,
  },
  label: {
    color: C.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: S.xs,
  },
  input: {
    backgroundColor: C.background,
    borderRadius: R.md,
    paddingHorizontal: S.md,
    paddingVertical: S.sm,
    color: C.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  dateButton: {
    backgroundColor: C.background,
    borderRadius: R.md,
    paddingHorizontal: S.md,
    paddingVertical: S.sm,
    borderWidth: 1,
    borderColor: C.border,
  },
  dateButtonText: {
    fontSize: 16,
    color: C.textDim,
  },
  frequencyContainer: {
    flexDirection: 'row',
    backgroundColor: C.background,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: 4,
    gap: 4,
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: S.sm,
    borderRadius: R.sm,
    alignItems: 'center',
  },
  frequencyOptionActive: {
    backgroundColor: C.primary,
  },
  frequencyOptionText: {
    fontSize: 14,
    color: C.textDim,
    textAlign: 'center',
  },
  frequencyOptionTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  reminderPreview: {
    marginTop: S.sm,
    color: C.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: S.md,
    paddingVertical: S.xs,
    borderRadius: R.sm,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.background,
  },
  chipActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  chipText: {
    fontSize: 13,
    color: C.textDim,
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: S.md,
    marginTop: S.lg,
  },
  button: {
    flex: 1,
    paddingVertical: S.md,
    borderRadius: R.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: C.background,
    borderWidth: 1,
    borderColor: C.border,
  },
  cancelButtonText: {
    color: C.text,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: C.primary,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventModalComponent;