import { Colors } from '@/shared/constants/Colors';
import { WeeklyReview } from '@/shared/types';
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Modal, TextInput,
} from 'react-native';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

type Props = {
  review:  WeeklyReview | null;
  onSave:  (note: string) => void;
};

export const WeeklyReviewCard: React.FC<Props> = ({ review, onSave }) => {
  const [showModal, setShowModal] = useState(false);
  const [note,      setNote]      = useState(review?.note ?? '');

  const weekNum = getWeekNumber(new Date());
  const isDone  = !!review;

  const save = () => {
    onSave(note);
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.card, isDone && styles.cardDone]}
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
      >
        <View style={styles.icon}>
          <Text style={styles.iconText}>📝</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>
            {isDone ? `Week ${weekNum} reviewed` : `Week ${weekNum} review ready`}
          </Text>
          <Text style={styles.sub}>
            {isDone ? 'Tap to edit your reflection →' : 'Tap to reflect on this week →'}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Week {weekNum} reflection</Text>
            <Text style={styles.modalPrompt}>
              What went well? What will you improve next week?
            </Text>
            <TextInput
              style={styles.textarea}
              value={note}
              onChangeText={setNote}
              placeholder="Write your thoughts..."
              placeholderTextColor={C.textDim}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={save}>
                <Text style={styles.saveText}>Save reflection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

function getWeekNumber(date: Date): number {
  const d        = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day      = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

const styles = StyleSheet.create({
  card: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: C.primaryFaint,
    borderWidth:     0.5,
    borderColor:     C.primaryDim,
    borderRadius:    R.lg,
    padding:         S.md,
    marginBottom:    S.sm,
    gap:             S.md,
  },
  cardDone: {
    backgroundColor: C.surfaceLight,
    borderColor:     C.border,
  },
  icon: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.primaryDim,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  iconText: { fontSize: 16 },
  body:     { flex: 1 },
  title: {
    fontSize:   13,
    fontWeight: '500',
    color:      C.textPrimary,
    marginBottom: 2,
  },
  sub: { fontSize: 11, color: C.primary },

  // Modal
  overlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent:  'flex-end',
  },
  modal: {
    backgroundColor:      C.surface,
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    borderWidth:          0.5,
    borderColor:          C.border,
    padding:              S.lg,
    paddingBottom:        40,
  },
  modalTitle: {
    fontSize:      18,
    fontWeight:    '600',
    color:         C.textPrimary,
    marginBottom:  4,
  },
  modalPrompt: {
    fontSize:     12,
    color:        C.textDim,
    marginBottom: S.md,
  },
  textarea: {
    backgroundColor: C.surfaceLight,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.md,
    padding:         S.md,
    fontSize:        14,
    color:           C.textPrimary,
    minHeight:       120,
    marginBottom:    S.md,
  },
  actions: { flexDirection: 'row', gap: S.sm },
  cancelBtn: {
    flex:            1,
    paddingVertical: 12,
    borderRadius:    R.full,
    borderWidth:     0.5,
    borderColor:     C.border,
    alignItems:      'center',
  },
  cancelText: { fontSize: 14, color: C.textDim },
  saveBtn: {
    flex:            1,
    paddingVertical: 12,
    borderRadius:    R.full,
    backgroundColor: C.primary,
    alignItems:      'center',
  },
  saveText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});