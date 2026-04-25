import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ActivityIndicator, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter }    from 'expo-router';
import { Ionicons }     from '@expo/vector-icons';
import { useBooksStore } from '../store/useBooksStore';
import { Colors } from '@/shared/constants/Colors';

const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

export const UploadScreen: React.FC = () => {
  const router = useRouter();
  const { uploadBook, processingStep, error } = useBooksStore();
  const [urlInput, setUrlInput] = useState('');
  const [showUrl,  setShowUrl]  = useState(false);

  const isProcessing = processingStep !== 'idle'
    && processingStep !== 'done'
    && processingStep !== 'error';

  const handleDevice = async () => {
    await uploadBook('device');
    if (useBooksStore.getState().processingStep === 'done') {
      router.replace('/books/booksScreen');
    }
  };

  const handleUrl = async () => {
    if (!urlInput.trim()) return;
    await uploadBook('url', urlInput.trim());
    if (useBooksStore.getState().processingStep === 'done') {
      router.replace('/books/booksScreen');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Book distiller</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="book-outline" size={32} color={C.primary} />
        </View>
        <Text style={styles.heroTitle}>Upload a book</Text>
        <Text style={styles.heroSub}>
          AI extracts the key lessons and stories into a short distilled version you can actually finish.
        </Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Drop zone */}
      <TouchableOpacity
        style={styles.dropZone}
        onPress={handleDevice}
        disabled={isProcessing}
        activeOpacity={0.7}
      >
        {isProcessing ? (
          <ActivityIndicator color={C.primary} />
        ) : (
          <>
            <View style={styles.dropIcon}>
              <Ionicons name="cloud-upload-outline" size={24} color={C.primary} />
            </View>
            <Text style={styles.dropText}>Tap to upload PDF</Text>
            <Text style={styles.dropSub}>Up to 50MB · PDF only</Text>
          </>
        )}
      </TouchableOpacity>

      {/* URL input */}
      {showUrl ? (
        <View style={styles.urlWrap}>
          <TextInput
            style={styles.urlInput}
            value={urlInput}
            onChangeText={setUrlInput}
            placeholder="Paste PDF URL..."
            placeholderTextColor={C.textDim}
            autoFocus
          />
          <TouchableOpacity
            style={styles.urlSubmit}
            onPress={handleUrl}
            disabled={!urlInput.trim() || isProcessing}
          >
            <Text style={styles.urlSubmitText}>Go</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Import options */}
      <View style={styles.options}>
        <OptionButton
          label="Google Drive"
          color={C.secondary}
          icon="logo-google"
          onPress={() => {}}
        />
        <OptionButton
          label="Dropbox"
          color={C.accent}
          icon="cloud-outline"
          onPress={() => {}}
        />
        <OptionButton
          label="URL / Link"
          color={C.error}
          icon="link-outline"
          onPress={() => setShowUrl(v => !v)}
        />
      </View>

      <Text style={styles.privacy}>
        Books are processed by AI and stored only on your device
      </Text>

    </SafeAreaView>
  );
};

const OptionButton: React.FC<{
  label: string; color: string;
  icon: any; onPress: () => void;
}> = ({ label, color, icon, onPress }) => (
  <TouchableOpacity style={styles.optBtn} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={icon} size={20} color={color} />
    <Text style={styles.optLabel}>{label}</Text>
    <Text style={styles.optSub}>Import PDF</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.background, paddingHorizontal: S.md },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: S.sm },
  back:    { fontSize: 16, color: C.primary, width: 60 },
  heading: { fontSize: 17, fontWeight: '600', color: C.textPrimary, letterSpacing: -0.3 },

  hero:      { alignItems: 'center', paddingVertical: S.lg },
  heroIcon:  { width: 64, height: 64, borderRadius: 20, backgroundColor: '#1a1030', borderWidth: 1, borderColor: '#2a1e5a', alignItems: 'center', justifyContent: 'center', marginBottom: S.md },
  heroTitle: { fontSize: 18, fontWeight: '600', color: C.textPrimary, letterSpacing: -0.3, marginBottom: S.sm },
  heroSub:   { fontSize: 12, color: C.textDim, textAlign: 'center', lineHeight: 18, maxWidth: 260 },

  dropZone:  { width: '100%', backgroundColor: '#0f0f1e', borderWidth: 1, borderColor: '#2a1e5a', borderStyle: 'dashed', borderRadius: R.lg, padding: 24, alignItems: 'center', gap: S.sm, marginBottom: S.md },
  dropIcon:  { width: 40, height: 40, borderRadius: 12, backgroundColor: '#1a1030', borderWidth: 0.5, borderColor: '#2a1e5a', alignItems: 'center', justifyContent: 'center' },
  dropText:  { fontSize: 13, color: C.primary, fontWeight: '500' },
  dropSub:   { fontSize: 10, color: C.textDim },

  urlWrap:       { flexDirection: 'row', gap: S.sm, marginBottom: S.md },
  urlInput:      { flex: 1, backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.border, borderRadius: R.md, padding: S.sm, fontSize: 13, color: C.textPrimary },
  urlSubmit:     { backgroundColor: C.primary, borderRadius: R.md, paddingHorizontal: S.md, alignItems: 'center', justifyContent: 'center' },
  urlSubmitText: { fontSize: 13, fontWeight: '600', color: '#fff' },

  options:  { flexDirection: 'row', gap: S.sm, marginBottom: S.md },
  optBtn:   { flex: 1, backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.border, borderRadius: R.md, padding: S.md, alignItems: 'center', gap: 4 },
  optLabel: { fontSize: 10, color: C.textMuted, fontWeight: '500' },
  optSub:   { fontSize: 9,  color: C.textDim },

  privacy: { fontSize: 10, color: C.textDim, textAlign: 'center' },
  errorBox: { backgroundColor: '#4d1010', borderRadius: R.md, padding: S.sm, marginBottom: S.md },
  errorText: { color: '#ffb3b3', fontSize: 12, lineHeight: 18 },
});