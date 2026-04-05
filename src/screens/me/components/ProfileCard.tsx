import { Colors } from '@/shared/constants/Colors';
import { UserProfile } from '@/shared/types';
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Modal, TextInput, Alert,
} from 'react-native';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

type Props = {
  profile:    UserProfile;
  onEditName: (name: string) => void;
};

export const ProfileCard: React.FC<Props> = ({ profile, onEditName }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [draft,    setDraft]    = useState(profile.name);

  const initials = profile.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const memberSince = new Date(profile.memberSince)
    .toLocaleDateString('en-KE', { month: 'long', year: 'numeric' });

  const save = () => {
    const name = draft.trim();
    if (!name) return;
    onEditName(name);
    setShowEdit(false);
  };

  return (
    <>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => { setDraft(profile.name); setShowEdit(true); }}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.sub}>Member since {memberSince}</Text>
      </View>

      {/* Edit name modal */}
      <Modal
        visible={showEdit}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEdit(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Edit name</Text>
            <TextInput
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              placeholder="Your name"
              placeholderTextColor={C.textDim}
              autoFocus
              onSubmitEditing={save}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowEdit(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, !draft.trim() && styles.saveBtnDisabled]}
                onPress={save}
                disabled={!draft.trim()}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.xl,
    padding:         S.lg,
    alignItems:      'center',
    marginBottom:    S.sm,
    position:        'relative',
  },
  editBtn: {
    position:          'absolute',
    top:               S.md,
    right:             S.md,
    backgroundColor:   C.primaryFaint,
    borderWidth:       0.5,
    borderColor:       C.primaryDim,
    borderRadius:      R.full,
    paddingVertical:   4,
    paddingHorizontal: 10,
  },
  editText: { fontSize: 11, color: C.primary, fontWeight: '500' },

  avatar: {
    width:           64,
    height:          64,
    borderRadius:    32,
    backgroundColor: C.primaryFaint,
    borderWidth:     2,
    borderColor:     C.primary,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    S.sm,
  },
  avatarText: {
    fontSize:      22,
    fontWeight:    '600',
    color:         C.primary,
    letterSpacing: -0.5,
  },
  name: {
    fontSize:      18,
    fontWeight:    '600',
    color:         C.textPrimary,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize:  11,
    color:     C.textDim,
    marginTop: 3,
  },

  // Modal
  overlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems:      'center',
    justifyContent:  'center',
    padding:         S.lg,
  },
  modal: {
    width:           '100%',
    backgroundColor: C.surface,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.xl,
    padding:         S.lg,
  },
  modalTitle: {
    fontSize:      18,
    fontWeight:    '600',
    color:         C.textPrimary,
    marginBottom:  S.md,
  },
  input: {
    backgroundColor: C.surfaceLight,
    borderWidth:     0.5,
    borderColor:     C.border,
    borderRadius:    R.md,
    padding:         S.md,
    fontSize:        14,
    color:           C.textPrimary,
    marginBottom:    S.md,
  },
  modalActions: { flexDirection: 'row', gap: S.sm },
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
  saveBtnDisabled: { opacity: 0.4 },
  saveText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});